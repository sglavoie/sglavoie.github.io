import argparse

import toml


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Set up the dependencies for the project."
    )
    parser.add_argument("build_system")

    args = parser.parse_args()

    if args.build_system == "pip":
        setup_system("pip")
    else:
        raise ValueError("Invalid arguments were passed.")


def setup_system(name: str) -> None:
    with open("pyproject.toml", "r") as file:
        data = toml.load(file)

    data["build-system"]["requires"] = data["tool"]["building"][name]["requires"]
    data["build-system"]["build-backend"] = data["tool"]["building"][name]["backend"]

    with open("pyproject.toml", "w") as file:
        toml.dump(data, file)


if __name__ == "__main__":
    main()
