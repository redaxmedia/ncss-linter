#!/usr/bin/env node

var command = require('commander'),
	ncss = require('../src/core'),
	packageArray = require('../package.json');

command
	.version(packageArray.version)
	.option('-H, --html <html>')
	.option('-F, --file <file>')
	.option('-U, --url <url>')
	.option('-N, --namespace <namespace>')
	.option('-S, --selector <selector>')
	.option('-T, --threshold <threshold>')
	.parse(process.argv);

if (command.html || command.file || command.url)
{
	ncss.init(
	{
		html: command.html,
		file: command.file,
		url: command.url,
		namespace: command.namespace,
		selector: command.selector,
		threshold: command.threshold
	});
}
else
{
	process.exit(1);
}