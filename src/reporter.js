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
	if (failArray.type === 'invalid-namespace' || failArray.type === 'invalid-class' || failArray.type === 'invalid-variation' || failArray.type === 'invalid-tag')
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
 */

function result()
{
	const thresholdError = option.get('thresholdError');
	const thresholdWarn = option.get('thresholdWarn');
	const haltOnError = option.get('haltOnError');
	const haltOnWarn = option.get('haltOnWarn');
	const logLevel = _getLogLevel();

	if (reportArray.error.length === 0 && reportArray.warn.length === 0 && reportArray.info.length === 3)
	{
		_log('\n' + colors.yellow(wordingArray.something_wrong.toUpperCase() + wordingArray.exclamation_mark) + '\n');
	}
	else if (reportArray.error.length > thresholdError && logLevel > 0)
	{
		_log('\n' + colors.red(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark) + ' (' + reportArray.error.length + ' ' + wordingArray.errors_found + ')\n');
		if (haltOnError)
		{
			process.exit(1);
		}
	}
	else if (reportArray.warn.length > thresholdWarn && logLevel > 1)
	{
		_log('\n' + colors.yellow(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark) + ' (' + reportArray.warn.length + ' ' + wordingArray.warnings_found + ')\n');
		if (haltOnWarn)
		{
			process.exit(1);
		}
	}
	else
	{
		_log('\n' + colors.green(wordingArray.passed.toUpperCase() + wordingArray.exclamation_mark));
		if (reportArray.error.length && logLevel > 0)
		{
			_log(' (' + reportArray.error.length + ' ' + wordingArray.errors_found + ')');
		}
		else if (reportArray.warn.length && logLevel > 1)
		{
			_log(' (' + reportArray.warn.length + ' ' + wordingArray.warnings_found + ')');
		}
		_log('\n');
	}
}

/**
 * summary
 *
 * @since 1.0.0
 */

function summary()
{
	const thresholdError = option.get('thresholdError');
	const thresholdWarn = option.get('thresholdWarn');

	if (reportArray.error.length > thresholdError)
	{
		_logError('\n');
		reportArray.error.forEach(reportValue =>
		{
			if (reportValue.type === 'invalid-namespace')
			{
				_logError(colors.red(wordingArray.error) + wordingArray.colon + ' ' + wordingArray.invalid_namespace);
			}
			if (reportValue.type === 'invalid-class')
			{
				_logError(colors.red(wordingArray.error) + wordingArray.colon + ' ' + wordingArray.invalid_class);
			}
			if (reportValue.type === 'invalid-variation')
			{
				_logError(colors.red(wordingArray.error) + wordingArray.colon + ' ' + wordingArray.invalid_variation);
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
	if (reportArray.warn.length > thresholdWarn)
	{
		_logWarn('\n');
		reportArray.warn.forEach(reportValue =>
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
	const logLevel = _getLogLevel();

	if (logLevel !== 0)
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
	const logLevel = _getLogLevel();

	if (logLevel > 0)
	{
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
	const logLevel = _getLogLevel();

	if (logLevel > 1)
	{
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
	const logLevel = _getLogLevel();

	if (logLevel > 2)
	{
		process.stdout.write(message);
	}
}

/**
 * get the logLevel
 *
 * @since 1.4.0
 *
 * @return number
 */

function _getLogLevel()
{
	const logLevel = option.get('logLevel');

	if (logLevel === 'debug')
	{
		return 4;
	}
	if (logLevel === 'info')
	{
		return 3;
	}
	if (logLevel === 'warn')
	{
		return 2;
	}
	if (logLevel === 'error')
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
 * @param injector object
 *
 * @return object
 */

function construct(injector)
{
	const exports =
	{
		getReport,
		clearReport,
		header,
		pass,
		warn,
		fail,
		skip,
		end,
		result,
		summary
	};

	/* clear */

	clearReport();

	/* handle injector */

	if (injector.option)
	{
		option = injector.option;
	}
	return exports;
}

module.exports = construct;