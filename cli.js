#!/usr/bin/env node

'use strict'

var program = require('commander')
var process = require('process')
var gulpEquations = require('./')
var gutil = require('gulp-util')

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-i, --input <file>', 'input file', getInput)
  .option('-o, --output <file>', 'output file destination')
  .option('-d, --imageDirectory <path>', 'image output destination')
  .parse(process.argv)

// Get the input file from either explicit argument:
var inputFile
function getInput (value) {
  inputFile = value
}

// Or default to first unconsumed input argument:
if (!inputFile) {
  inputFile = program.args[0]
}

// If still no input file, throw an error:
if (!inputFile) {
  gutil.log('[0;33mWarning: no input file specified. Processing all *.mdtex files in directory.[0m')
}

// Get an output file, if provided:
var outputFile = program.output

gulpEquations(inputFile, outputFile, program.imageDirectory)
