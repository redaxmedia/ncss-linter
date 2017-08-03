require('colors');

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
		warn: [],
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
	_log(packageArray.name + ' ' + packageArray.version + ' ' + wordingArray.by + ' ' + packageArray.author.name + wordingArray.point + '\n');
	_logInfo('\n')
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
	_logInfo('.');
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
	if (failArray.type === 'invalid-namespace')
	{
		_logInfo('N');
	}
	if (failArray.type === 'invalid-class')
	{
		_logInfo('C');
	}
	if (failArray.type === 'invalid-tag')
	{
		_logInfo('T');
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
	_logInfo('.');
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
			_logInfo(' ');
		}
		_logInfo(' ' + counter + ' / ' + total + ' (' + Math.ceil(counter / total * 100) + '%)\n');
	}
	if (counter === total)
	{
		_logInfo('\n');
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
	if (reportArray.error.length === 0 && reportArray.warn.length === 0 && reportArray.info.length === 3)
	{
		_log('\n' + wordingArray.something_wrong.toUpperCase().yellow + wordingArray.exclamation_mark.yellow + '\n');
	}
	else if (reportArray.error.length > threshold)
	{
		_log('\n' + wordingArray.failed.toUpperCase().red + wordingArray.exclamation_mark.red + ' (' + reportArray.error.length + ' ' + wordingArray.errors_found + ')\n');
	}
	else
	{
		_log('\n' + wordingArray.passed.toUpperCase().green + wordingArray.exclamation_mark.green + '\n');
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
		_logError('\n');
		reportArray.error.forEach(function (reportValue)
		{
			if (reportValue.type === 'invalid-namespace')
			{
				_logError(wordingArray.error.red + wordingArray.colon + ' ' + wordingArray.invalid_namespace);
			}
			if (reportValue.type === 'invalid-class')
			{
				_logError(wordingArray.error.red + wordingArray.colon + ' ' + wordingArray.invalid_class);
			}
			if (reportValue.type === 'invalid-tag')
			{
				_logError(wordingArray.error.red + wordingArray.colon + ' ' + wordingArray.invalid_tag);
			}
			if (reportValue.selector)
			{
				_logError(' ' + wordingArray.divider + ' ' + reportValue.selector + '\n');
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
	const loglevel = option.get('loglevel');

	if (loglevel !== 'silent')
	{
		process.stdout.write(message);
	}
}

/**
 * log error
 *
 * @since 1.0.0
 *
 * @param message string
 */

function _logError(message)
{
	const loglevel = option.get('loglevel');
	const haltonerror = option.get('haltonerror');

	if (loglevel === 'error' || loglevel === 'warn' || loglevel === 'info' || loglevel === 'debug')
	{
		if (haltonerror)
		{
			process.exit(1);
		}
		process.stderr.write(message);
	}
}

/**
 * log info
 *
 * @since 1.0.0
 *
 * @param message string
 */

function _logInfo(message)
{
	const loglevel = option.get('loglevel');

	if (loglevel === 'info' || loglevel === 'debug')
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