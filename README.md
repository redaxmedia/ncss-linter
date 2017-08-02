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

```
bin/cmd [options]

-V, --version
-H, --html <html>
-F, --file <file>
-U, --url <url>
-N, --namespace <namespace>
-D, --divider <divider>
-S, --selector <selector>
-T, --threshold <threshold>
-L, --loglevel <loglevel>
-h, --help
```


Examples
========

Validate a `HTML` string:

```
bin/cmd.js --html='<div class="box></div>'
```

Validate a local file:

```
bin/cmd.js --file=ncss.html --namespace=foo
```

Validate a remote URL:

```
bin/cmd.js --url=https://redaxmedia.com --namespace=rs --loglevel=info
```
