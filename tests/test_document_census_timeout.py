"""Document census regressions: bounded Git commands and fail-closed timeouts."""

import contextlib
import io
import runpy
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

from scripts import document_census


class CensusTimeoutTests(unittest.TestCase):
    def test_all_git_operations_have_deadline(self):
        with patch.object(document_census.subprocess, "run") as run:
            run.return_value.stdout = b"object-id"
            self.assertEqual(document_census.run_git("rev-parse", "HEAD"), b"object-id")
            self.assertEqual(run.call_args.kwargs["timeout"], 120)
            self.assertTrue(run.call_args.kwargs["check"])

    def test_stalled_git_propagates_timeout(self):
        timeout = subprocess.TimeoutExpired(["git", "cat-file", "--batch"], 120)
        with patch.object(document_census.subprocess, "run", side_effect=timeout):
            with self.assertRaises(subprocess.TimeoutExpired):
                document_census.run_git("cat-file", "--batch")

    def test_cli_fails_closed_on_timeout(self):
        timeout = subprocess.TimeoutExpired(["git", "rev-parse"], 120)
        script = Path(document_census.__file__)
        with patch.object(subprocess, "run", side_effect=timeout):
            with contextlib.redirect_stderr(io.StringIO()) as stderr:
                with self.assertRaises(SystemExit) as raised:
                    runpy.run_path(str(script), run_name="__main__")
        self.assertEqual(raised.exception.code, 1)
        self.assertIn("timed out after 120 seconds", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()
