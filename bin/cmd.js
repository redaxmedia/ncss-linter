#!/usr/bin/env node

const command = require('commander');
const core = require('../src/core');
const reporter = require('../src/reporter');
const ruleset = require('../src/ruleset');
const option = require('../src/option');
const packageArray = require('../package.json');

let REPORTER;
let CORE;

command
	.version(packageArray.version)
	.option('-H, --html <html>')
	.option('-F, --file <file>')
	.option('-U, --url <url>')
	.option('-N, --namespace <namespace>')
	.option('-D, --divider <divider>')
	.option('-S, --selector <selector>')
	.option('-T, --threshold <threshold>')
	.option('-L, --loglevel <loglevel>')
	.option('-Y, --haltonerror')
	.option('-Z, --haltonwarn')
	.parse(process.argv);

if (command.html || command.file || command.url)
{
	option.init(
	{
		html: command.html,
		file: command.file,
		url: command.url,
		namespace: command.namespace,
		divider: command.divider,
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