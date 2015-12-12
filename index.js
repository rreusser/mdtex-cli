var gulp = require('gulp')
var mdEq = require('gulp-markdown-equations')
var tap = require('gulp-tap')
var filter = require('gulp-filter')
var latex = require('gulp-latex')
var pdftocairo = require('gulp-pdftocairo')
var spawn = require('gulp-spawn')
var rename = require('gulp-rename')
var count = require('gulp-count')
var hasbin = require('hasbin')
var process = require('process')
var gutil = require('gulp-util')

function gulpEquations (input, output, imageDirOpt, done) {
  if (!hasbin.sync('pdftocairo')) {
    console.error('Error: pdftocairo not found in PATH. pdftocairo is required for conversion')
    process.exit(1)
  }

  if (!hasbin.sync('pdflatex')) {
    console.error('Error: pdflatex not found in PATH. pdflatex is required for conversion')
    process.exit(1)
  }

  var hasConvert = hasbin.sync('convert')
  if (!hasConvert) {
    gutil.log('[0;33mWarning: convert not found in PATH. ImageMagick is recommended for conversion. Equations will not be automatically cropped.[0m')
  }

  var texFilter = filter('*.tex', {restore: true})
  var mdFilter = filter('*.md')
  var imageDir = imageDirOpt || 'images'

  // Instantiate the transform and set some defaults:
  var eqSub = mdEq({
    defaults: {
      display: { margin: '1pt' },
      inline: {margin: '1pt'}
    }
  })

  var pipeline = gulp.src(input || '*.mdtex')
    .pipe(eqSub)

    // Separate the equations:
    .pipe(texFilter)

    // Render the equations to pdf:
    .pipe(latex())

    // Convert the pdf equations to png:
    .pipe(pdftocairo({format: 'png'}))

  // Trim whitespace:
  if (hasConvert) {
    pipeline
      .pipe(tap(function(file) {
        gutil.log('Cropping equation \'[0;36m' + file.basename + '[0m\'')
      })).pipe(spawn({
          cmd: 'convert',
          args: ['-', '-trim', '+repage', '-']
      }))
  }

  pipeline
    // Send them to the images folder:
    .pipe(gulp.dest(imageDir))

    // Match the output images up with the markdown input so that we can use the resulting
    // metadata to construct html that replaces the original equations:
    .pipe(tap(function (file) {
      eqSub.complete(file, function (cb) {
        var img = '<img alt="' + this.alt + '" valign="middle" src="' + this.path + '" width="' + this.width / 2 + '" height="' + this.height / 2 + '">'
        this.display ? cb('<p align="center">' + img + '</p>') : cb(img)
      })
    }))

    // Grab the original markdown file that's now complete:
    .pipe(texFilter.restore).pipe(mdFilter)

    // Rename the output, if desired:
    .pipe(rename(function (path) {
      if (output) {
        var origName = path.basename + path.extname
        path.basename = output
        path.extname = ''
        gutil.log('Redirecting \'[0;36m' + origName + '[0m\' to \'[0;36m' + path.basename + '[0m\'')
      }
      return path
    }))

    // Output in the current directory:
    .pipe(gulp.dest('./'))

    .on('end', function () {
      if (done) {
        done()
      }
    })

    .pipe(count('Processing complete! ## files processed.'))
}

module.exports = gulpEquations
