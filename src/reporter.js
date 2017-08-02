const wordingArray = require('../wording.json');
const packageArray = require('../package.json');

let reportArray = {};
let option;

/**
 * get the report
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
 * clear the report
 *
 * @since 1.0.0
 */

function clearReport()
{
	reportArray =
	{
		info: [],
		warning: [],
		error: []
	};
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
 *
 * @param passArray array
 */

function pass(passArray)
{
	_log('.');
	if (passArray.type && passArray.selector)
	{
		reportArray.info.push(
		{
			type: passArray.type,
			selector: passArray.selector
		});
	}
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
	if (failArray.type === 'invalid-class')
	{
		_log('C');
	}
	if (failArray.type === 'invalid-tag')
	{
		_log('T');
	}
	if (failArray.type && failArray.selector)
	{
		reportArray.error.push(
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
 *
 * @param skipArray array
 */

function skip(skipArray)
{
	_log('.');
	if (skipArray.type && skipArray.selector)
	{
		reportArray.info.push(
		{
			type: skipArray.type,
			selector: skipArray.selector
		});
	}
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

	if (reportArray.error.length > threshold)
	{
		_log(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark + ' (' + reportArray.error.length + ' ' + wordingArray.errors_found + ')\n');
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
	if (reportArray.error.length)
	{
		_log('\n' + wordingArray.summary.toUpperCase() + wordingArray.colon + '\n');
		reportArray.error.forEach(function (reportValue)
		{
			if (reportValue.type === 'invalid-class')
			{
				_log(wordingArray.invalid_class);
			}
			if (reportValue.type === 'invalid-tag')
			{
				_log(wordingArray.invalid_tag);
			}
			if (reportValue.selector)
			{
				_log(' ' + wordingArray.divider + ' ' + reportValue.selector + '\n');
			}
		});
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

/**
 * construct
 *
 * @since 1.0.0
 *
 * @param dependency object
 *
 * @return object
 */

function construct(dependency)
{
	const exports =
	{
		getReport: getReport,
		header: header,
		pass: pass,
		fail: fail,
		skip: skip,
		end: end,
		result: result,
		summary: summary
	};

	clearReport();

	/* inject dependency */

	if (dependency.option)
	{
		option = dependency.option;
	}
	return exports;
}

module.exports = construct;