import sys

def main():
    print("🌴 JungleScript")

    if len(sys.argv) < 2:
        print("JungleScript is ready!")
        print("Usage: junglescript <file.jls>")
        return

    filename = sys.argv[1]

    try:
        with open(filename, "r", encoding="utf-8") as file:
            code = file.read()

        print(f"Running {filename}...")
        print()
        print(code)

    except FileNotFoundError:
        print(f"Error: {filename} was not found.")

if __name__ == "__main__":
    main()