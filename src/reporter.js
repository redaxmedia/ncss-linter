var wordingArray = require('../wording.json'),
	packageArray = require('../package.json'),
	reportArray = [],
	option;

/**
 * get report
 *
 * @since 1.0.0
 *
 * return array
 */

function getReport()
{
	return reportArray;
}

/**
 * header
 *
 * @since 1.0.0
 */

function header()
{
	_log(packageArray.name + ' ' + packageArray.version + ' ' + wordingArray.by + ' ' + packageArray.author.name + wordingArray.point + '\n\n');
}

/**
 * pass
 *
 * @since 1.0.0
 */

function pass()
{
	_log('.');
}

/**
 * fail
 *
 * @since 1.0.0
 *
 * @param failArray array
 */

function fail(failArray)
{
	if (failArray.type === 'class')
	{
		_log('C');
	}
	if (failArray.type === 'tag')
	{
		_log('T');
	}
	if (failArray.type && failArray.selector)
	{
		reportArray.push(
		{
			type: failArray.type,
			selector: failArray.selector
		});
	}
}

/**
 * skip
 *
 * @since 1.0.0
 */

function skip()
{
	_log('.');
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
			_log(' ');
		}
		_log(' ' + counter + ' / ' + total + ' (' + Math.ceil(counter / total * 100) + '%)\n');
	}
}

/**
 * result
 *
 * @since 1.0.0
 *
 * @param threshold number
 */

function result(threshold)
{
	_log('\n\n');

	/* result message */

	if (reportArray.length > threshold)
	{
		_log(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark + ' (' + reportArray.length + ' ' + wordingArray.issues_found + ')\n');
	}
	else
	{
		_log(wordingArray.passed.toUpperCase() + wordingArray.exclamation_mark + '\n');
	}
}

/**
 * summary
 *
 * @since 1.0.0
 */

function summary()
{
	if (reportArray.length)
	{
		_log('\n' + wordingArray.summary.toUpperCase() + wordingArray.colon + '\n');
		reportArray.forEach(function (reportValue)
		{
			if (reportValue.type === 'class')
			{
				_log(wordingArray.invalid_class + wordingArray.colon + ' ');
			}
			if (reportValue.type === 'tag')
			{
				_log(wordingArray.invalid_tag + wordingArray.colon + ' ');
			}
			_log(reportValue.selector + '\n');
		});
		process.exit(1);
	}
}

/**
 * inject
 *
 * @since 1.0.0
 *
 * @param dependency object
 */

function inject(dependency)
{
	if (dependency.option)
	{
		option = dependency.option;
	}
}

/**
 * log
 *
 * @since 1.0.0
 *
 * @param message string
 */

function _log(message)
{
	if (option.get('loglevel') !== 'silent')
	{
		process.stdout.write(message);
	}
}

module.exports = function (dependency)
{
	var exports =
	{
		getReport: getReport,
		header: header,
		pass: pass,
		fail: fail,
		skip: skip,
		end: end,
		result: result,
		summary: summary,
		inject: inject
	};

	inject(dependency);
	return exports;
};