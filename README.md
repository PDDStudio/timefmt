# :clock4: `timefmt`

> A tiny time converting util for the command line.

## :package: Installation

You can choose one of the following ways to install `timefmt`

### :beginner: Install via your favorite Node Package Manager

You can use `npm` or `yarn` (or any other package manager of your choice) to install this utility.

```sh
# when using npm
npm i -g timefmt
# when using yarn
yarn global add timefmt
```

### :beers: Install via Homebrew (MacOS)

If you've [Homebrew](https://brew.sh) installed, simply run:

```sh
# tap the timefmt formula
brew tap pddstudio/timefmt
# Install timefmt using brew
brew install timefmt
```

## :question: Usage

_See `timefmt --help` for usage instructions._

Convert `1m 30s` to `ms`:

```sh
timefmt 1m 30s --output ms
# => The given input time 1m 30s equals: 90000 ms
```

### :information_source: Usage Information

```
Run timefmt --help for a list of all available commands, conversion outputs and more.
```

## :star: License

MIT License - See [LICENSE](./LICENSE) for details.
