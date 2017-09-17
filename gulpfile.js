(function () {
  'use strict';
  var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    del = require('del'),
    open = require('gulp-open'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    header = require('gulp-header'),
    concat = require('gulp-concat')

  var paths = {
    root: './',
    dist: {
      root: 'dist/',
      style: 'dist/css/',
      script: 'dist/js/'
    },
    source: {
      root: 'src/',
      style: 'src/sass/*.scss',
      script: ['src/js/lib/*.js', 'src/js/*.js']
    },
    html: './index.html',
    playground: {
      root: './'
    }
  },
    LZFile = {
      filename: 'lzfile',
      jQueryFiles: [
        paths.source.root + 'js/LZFile.js'
      ],
      pkg: require('./package.json'),
      banner: [
        '/**',
        ' * LZFile <%= pkg.version %>',
        ' * <%= pkg.description %>',
        ' * ',
        ' * <%= pkg.homepage %>',
        ' * ',
        ' * Copyright <%= date.year %>, <%= pkg.author %>',
        ' * ',
        ' * Licensed under <%= pkg.license %>',
        ' * ',
        ' * Released on: <%= date.month %> <%= date.day %>, <%= date.year %>',
        ' */',
        ''].join('\n'),
      date: {
        year: new Date().getFullYear(),
        month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
        day: new Date().getDate()
      }
    }

  var _style = function () {
    return gulp.src(paths.source.style)
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(gulp.dest(paths.dist.style))
  }

  var _html = function () {
    return gulp.src(paths.html)
  }

  var _script = function () {
    return gulp.src(paths.source.script)
  }

  gulp.task('clean', function () {
    return del(paths.dist.root + '**', { force: true })
  })

  gulp.task('connect', function () {
    return connect.server({
      root: [paths.root],
      livereload: true,
      port: '3000'
    })
  })

  gulp.task('watch:style', function () {
    return _style().pipe(connect.reload())
  })

  gulp.task('watch:html', function () {
    return _html().pipe(connect.reload())
  })

  gulp.task('watch:script', function () {
    gulp.src(LZFile.jQueryFiles)
      .pipe(concat(LZFile.filename + '.zepto.js'))
      .pipe(header(LZFile.banner, { pkg: LZFile.pkg, date: LZFile.date }))
      .pipe(gulp.dest(paths.dist.script))
      .pipe(connect.reload())
  })

  gulp.task('build:style', function () {
    del.sync(paths.dist.style)
    return _style()
  })

  gulp.task('build:html', function () {
    return _html()
  })

  gulp.task('build:script', function () {
    del.sync(paths.dist.script)
    gulp.src(LZFile.jQueryFiles)
      .pipe(concat(LZFile.filename + '.zepto.js'))
      .pipe(header(LZFile.banner, { pkg: LZFile.pkg, date: LZFile.date }))
      .pipe(gulp.dest(paths.dist.script))
    gulp.src(paths.source.root + 'js/lib/zepto.js')
      .pipe(gulp.dest(paths.dist.script))
    gulp.src(paths.source.root + 'js/lib/exif.js')
      .pipe(gulp.dest(paths.dist.script))
  })

  gulp.task('dist:script', function () {
    gulp.src(paths.dist.script + LZFile.filename + '.zepto.js')
      .pipe(concat(LZFile.filename + '.zepto.js'))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(header(LZFile.banner, { pkg: LZFile.pkg, date: LZFile.date }))
      .pipe(rename(function (path) {
        path.basename = LZFile.filename + '.zepto.min'
      }))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(paths.dist.script))
  })

  gulp.task('compile', ['build:html', 'build:script', 'build:style'], function (cb) {
    cb && cb()
  })

  gulp.task('open', function () {
    return gulp.src(paths.playground.root + 'index.html').pipe(open({ uri: 'http://localhost:3000/' + paths.playground.root + 'index.html' }))
  })

  gulp.task('watch', ['compile'], function () {
    gulp.watch([paths.html], ['watch:html'])
    gulp.watch([paths.source.script], ['watch:script'])
    gulp.watch([paths.source.style], ['watch:style'])
  })

  gulp.task('dev', ['watch', 'connect', 'open'])

  gulp.task('build', ['dist:script'])

})()