import argparse
from acat2c.runner import run_from_config


def main():
    parser = argparse.ArgumentParser(prog="acat2c")
    sub = parser.add_subparsers(dest="cmd", required=True)

    run_p = sub.add_parser("run", help="Run an ACAT-2C evaluation")
    run_p.add_argument("--config", required=True)

    args = parser.parse_args()

    if args.cmd == "run":
        run_from_config(args.config)


if __name__ == "__main__":
    main()
