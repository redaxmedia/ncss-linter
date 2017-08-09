#!/usr/bin/env node

const command = require('commander');
const ncss = require('../');
const core = ncss.core;
const reporter = ncss.reporter;
const ruleset = ncss.ruleset;
const option = ncss.option;
const packageArray = require('../package.json');

let REPORTER;
let CORE;

command
	.version(packageArray.version)
	.option('-H, --html <html>')
	.option('-P, --path <path>')
	.option('-U, --url <url>')
	.option('-N, --namespace <namespace>')
	.option('-E, --separator <separator>')
	.option('-S, --selector <selector>')
	.option('-T, --threshold <threshold>')
	.option('-L, --loglevel <loglevel>')
	.option('-Y, --haltonerror')
	.option('-Z, --haltonwarn')
	.parse(process.argv);

if (command.html || command.path || command.url)
{
	option.init(
	{
		html: command.html,
		path: command.path,
		url: command.url,
		namespace: command.namespace,
		separator: command.separator,
		selector: command.selector,
		threshold: command.threshold,
		loglevel: command.loglevel,
		haltonerror: command.haltonerror,
		haltonwarn: command.haltonwarn
	});
	REPORTER = new reporter(
	{
		option: option
	});
	CORE = new core(
	{
		reporter: REPORTER,
		ruleset: ruleset,
		option: option
	});
	CORE.init();
}
else
{
	process.exit(1);
}