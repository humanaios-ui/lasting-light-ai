# FDS: F3-Component | Parent: docs/audits/2026-10-18-document-audit.md | Hawkins: internal-only | Status: ACTIVE
"""Emit a NUL-safe, per-file inventory for the pinned lasting-light-ai main tree."""

from __future__ import annotations

import csv
import subprocess
import sys
from collections import Counter


PINNED_COMMIT = "6aa8f7ca685786775c200415255a480e52816e95"
PINNED_TREE = "daf7211e29b8a6c07ab6049c6458bc1b06ab9882"
EXPECTED_FILES = 329

INSPECTED = {
    "ACAT_PROMPT_V5_0.txt",
    "METHODS.md",
    "PRIVACY.md",
    "README.md",
    "START_HERE.md",
    "VALIDATION_PLAN.md",
    "ai-instructions.txt",
    "docs/EVIDENCE-GRAPH.md",
}

EVIDENCE_LINKED = {
    "public/_redirects": "1-6",
    "public/assess.html": "686, 1149-1187, 1302-1374",
    "public/constitution.html": "182",
    "public/funding.html": "160, 230, 286",
    "public/index.html": "1-2, 862, 914",
    "public/lumina_tide_pool_v2.html": "279-315",
    "public/observatory.html": "512-559, 845",
    "src/App.tsx": "216-249",
    "src/components/AcatTool.tsx": "187-210, 276-322, 574-680",
    "src/lib/validation.ts": "143-180",
}

REGISTRY_IDS = {
    "ACAT_PROMPT_V5_0.txt": "HAIOS-RES-001",
    "METHODS.md": "HAIOS-RES-002",
    "VALIDATION_PLAN.md": "HAIOS-PROC-002",
    "ai-instructions.txt": "HAIOS-PROC-003",
    "public/methodology.html": "HAIOS-RES-004",
}

TEST_SUFFIXES = (".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx")
SOURCE_SUFFIXES = {
    ".cjs", ".css", ".gs", ".html", ".js", ".py", ".sh", ".sql",
    ".ts", ".tsx",
}
CONFIG_SUFFIXES = {
    ".example", ".json", ".json5", ".jsonl", ".jsonld", ".lock",
    ".toml", ".yaml", ".yml",
}
DOCUMENT_SUFFIXES = {".md", ".rst", ".tex", ".txt"}
MEDIA_SUFFIXES = {".docx", ".gif", ".jpeg", ".jpg", ".pdf", ".png", ".svg", ".webp"}


def run_git(*args: str, input_bytes: bytes | None = None) -> bytes:
    return subprocess.run(
        ["git", *args],
        input=input_bytes,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    ).stdout


def tree_entries() -> list[tuple[str, str, str, int]]:
    resolved = run_git("rev-parse", "--verify", f"{PINNED_COMMIT}^{{commit}}")
    if resolved.decode().strip() != PINNED_COMMIT:
        raise RuntimeError("The pinned main commit could not be verified.")
    tree = run_git("rev-parse", f"{PINNED_COMMIT}^{{tree}}").decode().strip()
    if tree != PINNED_TREE:
        raise RuntimeError(f"Pinned tree changed: expected {PINNED_TREE}, got {tree}.")

    listing = run_git(
        "ls-tree",
        "-r",
        "-z",
        "--full-tree",
        "--format=%(objectmode)%x09%(objecttype)%x09%(objectname)%x09%(objectsize)%x09%(path)",
        PINNED_COMMIT,
    )
    entries = []
    for record in listing.split(b"\0"):
        if not record:
            continue
        mode, kind, oid, size, path = record.split(b"\t", 4)
        if kind != b"blob":
            raise RuntimeError(f"Unsupported tree object for {path!r}: {kind!r}")
        entries.append(
            (
                path.decode("utf-8", "surrogateescape"),
                oid.decode("ascii"),
                mode.decode("ascii"),
                int(size),
            )
        )
    if len(entries) != EXPECTED_FILES:
        raise RuntimeError(
            f"Pinned tree has {len(entries)} files; expected {EXPECTED_FILES}."
        )
    return entries


def blob_contents(entries: list[tuple[str, str, str, int]]) -> dict[str, bytes]:
    payload = b"".join(f"{oid}\n".encode("ascii") for _, oid, _, _ in entries)
    output = run_git("cat-file", "--batch", input_bytes=payload)
    contents: dict[str, bytes] = {}
    offset = 0
    for path, oid, _, expected_size in entries:
        header_end = output.find(b"\n", offset)
        if header_end < 0:
            raise RuntimeError(f"Missing blob header for {path!r}.")
        header = output[offset:header_end].split()
        if len(header) != 3 or header[0].decode("ascii") != oid:
            raise RuntimeError(f"Invalid blob header for {path!r}.")
        size = int(header[2])
        if size != expected_size:
            raise RuntimeError(f"Blob size mismatch for {path!r}.")
        data_start = header_end + 1
        data_end = data_start + size
        if output[data_end : data_end + 1] != b"\n":
            raise RuntimeError(f"Invalid blob boundary for {path!r}.")
        contents[path] = output[data_start:data_end]
        offset = data_end + 1
    if offset != len(output):
        raise RuntimeError("Unparsed bytes remain after reading the pinned blobs.")
    return contents


def category(path: str, data: bytes, mode: str) -> str:
    if mode == "120000":
        return "symlink"
    if mode == "160000":
        return "submodule"
    suffix = "." + path.rsplit(".", 1)[-1].lower() if "." in path.rsplit("/", 1)[-1] else ""
    if b"\0" in data or suffix in MEDIA_SUFFIXES:
        return "binary/media"
    try:
        data.decode("utf-8")
    except UnicodeDecodeError:
        return "binary/unsupported"
    lowered = path.lower()
    if (
        "/test/" in f"/{lowered}/"
        or "/tests/" in f"/{lowered}/"
        or "/e2e/" in f"/{lowered}/"
        or lowered.endswith(TEST_SUFFIXES)
    ):
        return "test/fixture"
    if lowered.startswith(("data/", "logs/", "fixtures/")) or suffix in {".csv", ".jsonl"}:
        return "data/fixture"
    if lowered.startswith(".github/workflows/") or suffix in CONFIG_SUFFIXES:
        return "workflow/config/schema"
    if suffix in SOURCE_SUFFIXES:
        return "source/markup"
    if suffix in DOCUMENT_SUFFIXES:
        return "documentation"
    return "other-text"


def coverage(path: str, kind: str, revision: str) -> tuple[str, str]:
    if kind.startswith("binary/") or kind in {"symlink", "submodule"}:
        return "metadata-only", "Content not inspected; binary/type and Git object metadata only."
    if revision != PINNED_COMMIT:
        return "pending", "Coverage notes apply only to the pinned main revision."
    if path in INSPECTED:
        return "inspected", "Entire text file read; evidence and limits summarized in the audit report."
    if path in EVIDENCE_LINKED:
        return "evidence-linked", f"Selected source span(s) read: {EVIDENCE_LINKED[path]}; whole-file review pending."
    return "pending", "Not semantically reviewed; no file-level or peer-review claim."


def main() -> int:
    entries = tree_entries()
    contents = blob_contents(entries)
    writer = csv.writer(sys.stdout, lineterminator="\n")
    writer.writerow(
        [
            "revision",
            "path",
            "blob_id",
            "mode",
            "size_bytes",
            "category",
            "visibility",
            "sensitivity",
            "registry_id",
            "canonical_owner",
            "generator",
            "source_coverage",
            "independent_review",
            "coverage_note",
        ]
    )
    states: Counter[str] = Counter()
    for path, oid, mode, size in entries:
        file_kind = category(path, contents[path], mode)
        state, note = coverage(path, file_kind, PINNED_COMMIT)
        states[state] += 1
        is_public_candidate = path.startswith("public/") or path.endswith(".html")
        registry_id = REGISTRY_IDS.get(path, "not-crosswalked")
        owner = (
            "lasting-light-ai (registry canonical repo; person owner unresolved)"
            if registry_id != "not-crosswalked"
            else "not-resolved"
        )
        writer.writerow(
            [
                PINNED_COMMIT,
                path,
                oid,
                mode,
                size,
                file_kind,
                "public-candidate" if is_public_candidate else "repository-tracked",
                "not-assessed",
                registry_id,
                owner,
                "not-assessed",
                state,
                "PENDING",
                note,
            ]
        )
    if sum(states.values()) != EXPECTED_FILES:
        raise RuntimeError(f"Coverage states do not sum to {EXPECTED_FILES}: {states}")
    print(
        "coverage_state_counts="
        + ", ".join(f"{state}:{states[state]}" for state in (
            "inspected", "evidence-linked", "metadata-only", "exception", "pending", "blocked"
        )),
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (RuntimeError, subprocess.CalledProcessError) as error:
        print(f"document census failed: {error}", file=sys.stderr)
        raise SystemExit(1)
