const colors = require('colors');
const wordingArray = require('../wording.json');
const packageArray = require('../package.json');

let option;
let reportArray = {};

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
		error: [],
		warn: [],
		info: []
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
 * warn
 *
 * @since 1.0.0
 *
 * @param warnArray array
 */

function warn(warnArray)
{
	if (warnArray.type === 'invalid-character')
	{
		_logInfo('W');
	}
	if (warnArray.type && warnArray.selector)
	{
		reportArray.warn.push(
		{
			type: warnArray.type,
			selector: warnArray.selector
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
	if (failArray.type === 'invalid-namespace' || failArray.type === 'invalid-class' || failArray.type === 'invalid-tag')
	{
		_logInfo('E');
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
	const loglevel = _getLoglevel();

	if (reportArray.error.length === 0 && reportArray.warn.length === 0 && reportArray.info.length === 3)
	{
		_log('\n' + colors.yellow(wordingArray.something_wrong.toUpperCase() + wordingArray.exclamation_mark) + '\n');
	}
	else if (reportArray.error.length > threshold && loglevel > 0)
	{
		_log('\n' + colors.red(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark) + ' (' + reportArray.error.length + ' ' + wordingArray.errors_found + ')\n');
	}
	else if (reportArray.warn.length > threshold && loglevel > 1)
	{
		_log('\n' + colors.yellow(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark) + ' (' + reportArray.warn.length + ' ' + wordingArray.warnings_found + ')\n');
	}
	else
	{
		_log('\n' + colors.green(wordingArray.passed.toUpperCase() + wordingArray.exclamation_mark) + '\n');
	}
}

/**
 * summary
 *
 * @since 1.0.0
 *
 * @param threshold number
 */

function summary(threshold)
{
	if (reportArray.error.length > threshold)
	{
		_logError('\n');
		reportArray.error.forEach(function (reportValue)
		{
			if (reportValue.type === 'invalid-namespace')
			{
				_logError(colors.red(wordingArray.error) + wordingArray.colon + ' ' + wordingArray.invalid_namespace);
			}
			if (reportValue.type === 'invalid-class')
			{
				_logError(colors.red(wordingArray.error) + wordingArray.colon + ' ' + wordingArray.invalid_class);
			}
			if (reportValue.type === 'invalid-tag')
			{
				_logError(colors.red(wordingArray.error) + wordingArray.colon + ' ' + wordingArray.invalid_tag);
			}
			if (reportValue.selector)
			{
				_logError(' ' + wordingArray.divider + ' ' + reportValue.selector + '\n');
			}
		});
	}
	if (reportArray.warn.length > threshold)
	{
		_logWarn('\n');
		reportArray.warn.forEach(function (reportValue)
		{
			if (reportValue.type === 'invalid-character')
			{
				_logWarn(colors.yellow(wordingArray.warning) + wordingArray.colon + ' ' + wordingArray.invalid_character);
			}
			if (reportValue.selector)
			{
				_logWarn(' ' + wordingArray.divider + ' ' + reportValue.selector + '\n');
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
	const loglevel = _getLoglevel();

	if (loglevel !== 0)
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
	const loglevel = _getLoglevel();
	const haltonerror = option.get('haltonerror');

	if (loglevel > 0)
	{
		if (haltonerror)
		{
			process.exit(1);
		}
		process.stderr.write(message);
	}
}

/**
 * log warn
 *
 * @since 1.0.0
 *
 * @param message string
 */

function _logWarn(message)
{
	const loglevel = _getLoglevel();
	const haltonwarn = option.get('haltonwarn');

	if (loglevel > 1)
	{
		if (haltonwarn)
		{
			process.exit(1);
		}
		process.stdout.write(message);
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
	const loglevel = _getLoglevel();

	if (loglevel > 2)
	{
		process.stdout.write(message);
	}
}

/**
 * get the loglevel
 *
 * @since 1.4.0
 *
 * @return number
 */

function _getLoglevel()
{
	const loglevel = option.get('loglevel');

	if (loglevel === 'debug')
	{
		return 4;
	}
	if (loglevel === 'info')
	{
		return 3;
	}
	if (loglevel === 'warn')
	{
		return 2;
	}
	if (loglevel === 'error')
	{
		return 1;
	}
	return 0;
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
		clearReport: clearReport(),
		header: header,
		pass: pass,
		warn: warn,
		fail: fail,
		skip: skip,
		end: end,
		result: result,
		summary: summary
	};

	/* clear */

	clearReport();

	/* inject dependency */

	if (dependency.option)
	{
		option = dependency.option;
	}
	return exports;
}

module.exports = construct;