#!/usr/bin/env node

var command = require('commander'),
	phantom = require('phantom'),
	core = require('../src/core'),
	reporter = require('../src/reporter'),
	ruleset = require('../src/ruleset'),
	option = require('../src/option'),
	packageArray = require('../package.json'),
	ncss;

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
	ncss = new core(
	{
		phantom: phantom,
		reporter: new reporter(
		{
			option: option
		}),
		ruleset: ruleset,
		option: option
	});
	ncss.init();
}
else
{
	process.exit(1);
}