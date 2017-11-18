NCSS Linter
===========

> Linter for [NCSS](https://ncss.io).

[![Build Status](https://img.shields.io/travis/redaxmedia/ncss-linter.svg)](https://travis-ci.org/redaxmedia/ncss-linter)
[![Dependency Status](https://gemnasium.com/badges/github.com/redaxmedia/ncss-linter.svg)](https://gemnasium.com/github.com/redaxmedia/ncss-linter)
[![NPM Version](https://img.shields.io/npm/v/ncss-linter.svg)](https://www.npmjs.com/package/ncss-linter)
[![GitHub Stats](https://img.shields.io/badge/github-stats-ff5500.svg)](http://githubstats.com/redaxmedia/ncss-linter)


Installation
------------

```
npm install ncss-linter
```


Usage
-----

```
bin/ncss-linter [options]

-V, --version
-H, --html <html>
-P, --path <path>
-U, --url <url>
-N, --namespace <namespace>
-E, --separator <separator>
-S, --selector <selector>
-L, --log-level <log-level>
-V, --threshold-error <threshold-error>
-W, --threshold-warn <threshold-warn>
-Y, --halt-on-error   
-Z, --halt-on-warn
-h, --help
```


Options
-------

| Name           | Type    | Default | Mandatory |
|----------------|---------|---------|-----------|
| html           | string  | null    | required  |
| path           | string  | null    | required  |
| url            | string  | null    | required  |
| namespace      | string  | null    | optional  |
| separator      | string  | -       | optional  |
| selector       | string  | *       | optional  |
| logLevel       | string  | warn    | optional  |
| thresholdError | number  | 0       | optional  |
| thresholdWarn  | number  | 0       | optional  |
| haltOnError    | boolean | false   | optional  |
| haltOnWarn     | boolean | false   | optional  |


Examples
--------

Validate a `HTML` string:

```
bin/ncss-linter --html='<div class="box-content"></div>'
```

Validate a local path:

```
bin/ncss-linter --path=templates/**/*.html --namespace=foo
```

Validate a remote URL:

```
bin/ncss-linter --url=https://redaxmedia.com --namespace=rs --log-level=info
```
