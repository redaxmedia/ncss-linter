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


Validate a `HTML` string:

```
HTML='<div class="foo-box></div>' NAMESPACE=foo- nodejs index.js
```

Validate a local file:

```
FILE=ncss.html NAMESPACE=foo- nodejs index.js
```

Validate a remote website:

```
URL=https://ncss.io NAMESPACE=rs- nodejs index.js
```
