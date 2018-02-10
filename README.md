NCSS Linter
===========

> Linter for [NCSS](https://ncss.io).

[![Build Status](https://img.shields.io/travis/redaxmedia/ncss-linter.svg)](https://travis-ci.org/redaxmedia/ncss-linter)
[![NPM Version](https://img.shields.io/npm/v/ncss-linter.svg)](https://npmjs.com/package/ncss-linter)
[![License](https://img.shields.io/npm/l/ncss-linter.svg)](https://npmjs.com/package/ncss-linter)


Preview
-------

![Terminal Session](https://cdn.rawgit.com/redaxmedia/media/master/ncss-linter/terminal-session.svg)


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
-C, --config <config>
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

| Name           | Type    | Default     | Mandatory |
|----------------|---------|-------------|-----------|
| config         | string  | .ncsslintrc | optional  |
| html           | string  | null        | required  |
| path           | string  | null        | required  |
| url            | string  | null        | required  |
| namespace      | string  | null        | optional  |
| separator      | string  | -           | optional  |
| selector       | string  | *           | optional  |
| logLevel       | string  | warn        | optional  |
| thresholdError | number  | 0           | optional  |
| thresholdWarn  | number  | 0           | optional  |
| haltOnError    | boolean | false       | optional  |
| haltOnWarn     | boolean | false       | optional  |


Examples
--------

Validate using a configuration file:

```
bin/ncss-linter --config=.ncsslintrc
```

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


Loggers
-------

| Name    | Level | Value |
|---------|-------|-------|
| Silent  | 0     | null  |
| Error   | 1     | error |
| Warning | 2     | warn  |
| Info    | 3     | info  |
| Debug   | 4     | debug |
