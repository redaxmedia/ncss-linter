var wordingArray = require('../wording.json'),
	packageArray = wordingArray._package,
	issueArray = [];

/**
 * header
 *
 * @since 1.0.0
 */

function header()
{
	process.stdout.write(packageArray.name + ' ' + packageArray.version + ' ' + wordingArray.by + ' ' + packageArray.author + wordingArray.point + '\n\n');
}

/**
 * pass
 *
 * @since 1.0.0
 */

function pass()
{
	process.stdout.write('.');
}

/**
 * fail
 *
 * @since 1.0.0
 *
 * @param options array
 */

function fail(options)
{
	if (options.type === 'class')
	{
		process.stdout.write('C');
	}
	if (options.type === 'tag')
	{
		process.stdout.write('T');
	}
	issueArray.push(
	{
		type: options.type,
		selector: options.selector
	});
}

/**
 * skip
 *
 * @since 1.0.0
 */

function skip()
{
	process.stdout.write('.');
}

/**
 * end
 *
 * @since 1.0.0
 *
 * @param counter number
 * @param total number
 */

function end(counter, total)
{
	if (counter % 60 === 0)
	{
		if (counter === 60)
		{
			process.stdout.write(' ');
		}
		process.stdout.write(' ' + counter + ' / ' + total + ' (' + Math.ceil(counter / total * 100) + '%)\n');
	}
}

function result(threshold)
{
	process.stdout.write('\n\n');

	/* result message */

	if (issueArray.length > threshold)
	{
		process.stdout.write(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark + ' (' + issueArray.length + ' ' + wordingArray.issues_found + ')\n');
	}
	else
	{
		process.stdout.write(wordingArray.passed.toUpperCase() + wordingArray.exclamation_mark + '\n');
	}
}

/**
 * summary
 *
 * @since 1.0.0
 */

function summary()
{
	if (issueArray.length)
	{
		process.stdout.write('\n' + wordingArray.summary.toUpperCase() + wordingArray.colon + '\n');
		issueArray.forEach(function (issueValue)
		{
			if (issueValue.type === 'class')
			{
				process.stdout.write(wordingArray.invalid_class + wordingArray.colon + ' ');
			}
			if (issueValue.type === 'tag')
			{
				process.stdout.write(wordingArray.invalid_tag + wordingArray.colon + ' ');
			}
			process.stdout.write(issueValue.selector + '\n');
		});
	}
}

module.exports =
{
	header: header,
	pass: pass,
	fail: fail,
	skip: skip,
	end: end,
	result: result,
	summary: summary
};