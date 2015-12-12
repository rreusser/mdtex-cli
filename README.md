# mdtex-cli

> Markdown equation processing as a command line script

## Introduction

This is a convenience wrapper for [gulp-markdown-equations](https://github.com/rreusser/gulp-markdown-equations). That packages requires a custom gulpfile in your project with all oft he custom setup. That's nice, but it's a pain. This project takes a simple workflow and wraps it in a cli utility. The result is:

<p align="center"><img alt="simple&bsol;&semi;&bsol;LaTeX&bsol;&semi;typesetting&period;" valign="middle" src="images/simplelatextypesetting-95e156e622.png" width="234.5" height="32.5"></p>

## Installation

```bash
$ npm install -g mdtex-cli
```

## Examples

Process all files matching `*.mdtex` in the current directory, outputting them as `*.md` and equations into `./images`:

```bash
$ mdtex
```

Process a specific file:

```bash
$ mdtex README.mdtex --output README.md --imageDirectory ./image-files
```

## Requirements

You will need the following commands accessible in your `PATH` variable in order to use this utility:

- `pdflatex`
- `convert` (optional for trimming, part of the ImageMagick suite)
- `pdftocairo` (part of the [Poppler](http://poppler.freedesktop.org/) package)

## Usage

```
$ mdtex --help

  Usage: cli [options] <file ...>

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    -i, --input <file>           input file
    -o, --output <file>          output file destination
    -d, --imageDirectory <path>  image output destination
```

## License

(c) 2015 Ricky Reusser. ISC License.