#!/usr/bin/env node

const command = require('commander');
const phantom = require('phantom');
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
	.option('-S, --selector <selector>')
	.option('-T, --threshold <threshold>')
	.option('-L, --loglevel <loglevel>')
	.parse(process.argv);

if (command.html || command.file || command.url)
{
	option.init(
	{
		html: command.html,
		file: command.file,
		url: command.url,
		namespace: command.namespace,
		selector: command.selector,
		threshold: command.threshold,
		loglevel: command.loglevel
	});
	REPORTER = new reporter(
	{
		option: option
	});
	CORE = new core(
	{
		phantom: phantom,
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