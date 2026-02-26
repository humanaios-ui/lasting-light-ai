import argparse

from acat2c.runner import run_from_config, run_cli, validate_run


def main() -> None:
    parser = argparse.ArgumentParser(prog="acat2c")
    sub = parser.add_subparsers(dest="cmd", required=True)

    # --- run ---
    run_p = sub.add_parser("run", help="Run an ACAT-2C evaluation")

    # Back-compat: config-driven runs
    run_p.add_argument("--config", help="Path to a run config file (legacy/compatible mode)")

    # New contract: direct flags
    run_p.add_argument("--battery", help="Battery path (file or directory, depending on battery format)")
    run_p.add_argument("--provider", help="Provider adapter name (stub/local_stub/openai/anthropic)")
    run_p.add_argument("--out", help="Output directory for the run (e.g., runs/<run_id>)")
    run_p.add_argument("--locked", help="Locked config directory (e.g., configs/locked/v0.5)")
    run_p.add_argument("--temperature", type=float, default=None, help="Sampling temperature (provider-dependent)")
    run_p.add_argument("--model", default=None, help="Model id/name (provider-dependent)")
    run_p.add_argument("--force", action="store_true", help="Overwrite existing --out directory if it exists")
    run_p.add_argument("--max-prompts", type=int, default=None, help="Limit prompts (debug/CI)")

    # --- validate ---
    val_p = sub.add_parser("validate", help="Validate a completed run folder")
    val_p.add_argument("run_dir", help="Path to runs/<run_id>/")

    args = parser.parse_args()

    if args.cmd == "run":
        if args.config:
            run_from_config(args.config)
            return

        missing = [k for k in ("battery", "provider", "out") if getattr(args, k) is None]
        if missing:
            raise SystemExit(
                f"Missing required args for direct run mode: {', '.join('--' + m for m in missing)} "
                "(or provide --config)."
            )

        run_cli(
            battery_path=args.battery,
            provider=args.provider,
            out_dir=args.out,
            locked_path=args.locked,
            temperature=args.temperature,
            model=args.model,
            force=args.force,
            max_prompts=args.max_prompts,
        )
        return

    if args.cmd == "validate":
        ok = validate_run(args.run_dir)
        raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
