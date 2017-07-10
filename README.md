NCSS Linter
===========

> Linter for NCSS.

[![Build Status](https://img.shields.io/travis/redaxmedia/ncss-linter.svg)](https://travis-ci.org/redaxmedia/ncss-linter)
[![Dependency Status](https://gemnasium.com/badges/github.com/redaxmedia/ncss-linter.svg)](https://gemnasium.com/github.com/redaxmedia/ncss-linter)
[![GitHub Stats](https://img.shields.io/badge/github-stats-ff5500.svg)](http://githubstats.com/redaxmedia/ncss-linter)


Installation
============

```
npm install ncss-linter
```


Usage
=====

Validate a local `HTML` file:

```
FILE=ncss.html NAMESPACE=foo- node_modules/phantomjs/bin/phantomjs index.js
```

Validate a website:

```
URL=https://ncss.io NAMESPACE=rs- node_modules/phantomjs/bin/phantomjs index.js
```