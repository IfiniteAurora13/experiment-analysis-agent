"""Convenient repository entry point; the installed app uses experimentos.demo_data."""

from experimentos.demo_data import SCENARIOS, encode_csv, main, make_bundle

if __name__ == "__main__":
    main()
