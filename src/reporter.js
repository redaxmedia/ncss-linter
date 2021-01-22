const os = require('os');
const colors = require('colors');
const wordingObject = require('../wording.json');
const packageObject = require('../package.json');

let option;
let reportObject = {};

/**
 * get the report
 *
 * @since 1.0.0
 *
 * @return {object}
 */

function getReport()
{
	return reportObject;
}

/**
 * clear the report
 *
 * @since 1.0.0
 *
 * @return {void}
 */

function clearReport()
{
	reportObject =
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
 *
 * @return {void}
 */

function header()
{
	_log(packageObject.name + ' ' + packageObject.version + ' ' + wordingObject.by + ' ' + packageObject.author.name + wordingObject.point + os.EOL);
	_logInfo(os.EOL);
}

/**
 * pass
 *
 * @since 1.0.0
 *
 * @param {object} passObject
 *
 * @return {void}
 */

function pass(passObject)
{
	_logInfo('.');
	reportObject.info.push(
	{
		type: passObject.type,
		selector: passObject.selector
	});
}

/**
 * warn
 *
 * @since 1.0.0
 *
 * @param {object} warnObject
 *
 * @return {void}
 */

function warn(warnObject)
{
	if (warnObject.type === 'invalid-attribute')
	{
		_logInfo('W');
	}
	reportObject.warn.push(
	{
		type: warnObject.type,
		selector: warnObject.selector,
		context: warnObject.context
	});
}

/**
 * fail
 *
 * @since 1.0.0
 *
 * @param {object} failObject
 *
 * @return {void}
 */

function fail(failObject)
{
	if (failObject.type === 'invalid-namespace' || failObject.type === 'invalid-class' || failObject.type === 'invalid-variation' || failObject.type === 'invalid-tag')
	{
		_logInfo('E');
	}
	if (failObject.context)
	{
		reportObject.error.push(
		{
			type: failObject.type,
			selector: failObject.selector,
			context: failObject.context
		});
	}
	else
	{
		reportObject.error.push(
		{
			type: failObject.type,
			selector: failObject.selector
		});
	}
}

/**
 * skip
 *
 * @since 1.0.0
 *
 * @param {object} skipObject
 *
 * @return {void}
 */

function skip(skipObject)
{
	_logInfo('.');
	reportObject.info.push(
	{
		type: skipObject.type,
		selector: skipObject.selector
	});
}

/**
 * end
 *
 * @since 1.0.0
 *
 * @param {number} counter
 * @param {number} total
 *
 * @return {void}
 */

function end(counter, total)
{
	if (counter % 60 === 0)
	{
		if (counter === 60)
		{
			_logInfo(' ');
		}
		_logInfo(' ' + counter + ' / ' + total + ' (' + Math.ceil(counter / total * 100) + '%)' + os.EOL);
	}
	if (counter === total)
	{
		_logInfo(os.EOL);
	}
}

/**
 * result
 *
 * @since 1.0.0
 *
 * @return {void}
 */

function result()
{
	const thresholdError = option.get('thresholdError');
	const thresholdWarn = option.get('thresholdWarn');
	const haltOnError = option.get('haltOnError');
	const haltOnWarn = option.get('haltOnWarn');
	const logLevel = _getLogLevel();

	if (reportObject.error.length === 0 && reportObject.warn.length === 0 && reportObject.info.length === 3)
	{
		_log(os.EOL + colors.yellow(wordingObject.something_wrong.toUpperCase() + wordingObject.exclamation_mark) + os.EOL);
	}
	else if (reportObject.error.length > thresholdError && logLevel > 0)
	{
		_log(os.EOL + colors.red(wordingObject.failed.toUpperCase() + wordingObject.exclamation_mark) + ' (' + reportObject.error.length + ' ' + wordingObject.errors_found + ')' + os.EOL);
		if (haltOnError)
		{
			process.exit(1);
		}
	}
	else if (reportObject.warn.length > thresholdWarn && logLevel > 1)
	{
		_log(os.EOL + colors.yellow(wordingObject.failed.toUpperCase() + wordingObject.exclamation_mark) + ' (' + reportObject.warn.length + ' ' + wordingObject.warnings_found + ')' + os.EOL);
		if (haltOnWarn)
		{
			process.exit(1);
		}
	}
	else
	{
		_log(os.EOL + colors.green(wordingObject.passed.toUpperCase() + wordingObject.exclamation_mark));
		if (reportObject.error.length && logLevel > 0)
		{
			_log(' (' + reportObject.error.length + ' ' + wordingObject.errors_found + ')');
		}
		else if (reportObject.warn.length && logLevel > 1)
		{
			_log(' (' + reportObject.warn.length + ' ' + wordingObject.warnings_found + ')');
		}
		_log(os.EOL);
	}
}

/**
 * summary
 *
 * @since 1.0.0
 *
 * @return {void}
 */

function summary()
{
	const thresholdError = option.get('thresholdError');
	const thresholdWarn = option.get('thresholdWarn');

	if (reportObject.error.length > thresholdError)
	{
		_logError(os.EOL);
		reportObject.error.map(reportValue =>
		{
			_logError(colors.red(wordingObject.cross + ' ' + reportValue.selector).padEnd(65, ' '));
			if (reportValue.type === 'invalid-namespace')
			{
				_logError(' '.repeat(5) + wordingObject.invalid_namespace.padEnd(30, ' '));
			}
			if (reportValue.type === 'invalid-class')
			{
				_logError(' '.repeat(5) + wordingObject.invalid_class.padEnd(30, ' '));
			}
			if (reportValue.type === 'invalid-variation')
			{
				_logError(' '.repeat(5) + wordingObject.invalid_variation.padEnd(30, ' '));
			}
			if (reportValue.type === 'invalid-tag')
			{
				_logError(' '.repeat(5) + wordingObject.invalid_tag.padEnd(30, ' '));
			}
			_logError(' '.repeat(5) + colors.gray(reportValue.type));
			if (reportValue.context)
			{
				_logError(colors.gray(' ['  + reportValue.context + ']'));
			}
			_logError(os.EOL);
		});
	}
	if (reportObject.warn.length > thresholdWarn)
	{
		_logWarn(os.EOL);
		reportObject.warn.map(reportValue =>
		{
			_logWarn(colors.yellow(wordingObject.cross + ' ' + reportValue.selector).padEnd(65, ' '));
			if (reportValue.type === 'invalid-attribute')
			{
				_logWarn(' '.repeat(5) + wordingObject.invalid_attribute.padEnd(30, ' '));
			}
			_logWarn(' '.repeat(5) + colors.gray(reportValue.type));
			if (reportValue.context)
			{
				_logWarn(colors.gray(' ['  + reportValue.context + ']'));
			}
			_logWarn(os.EOL);
		});
	}
}

/**
 * log
 *
 * @since 1.0.0
 *
 * @param {string} message
 *
 * @return {void}
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
 * @param {string} message
 *
 * @return {void}
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
 * @param {string} message
 *
 * @return {void}
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
 * @param {string} message
 *
 * @return {void}
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
 * get the log level
 *
 * @since 1.4.0
 *
 * @return {number}
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
 * @param {object} injectorObject
 *
 * @return {object}
 */

function construct(injectorObject)
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

	if (injectorObject.option)
	{
		option = injectorObject.option;
	}
	return exports;
}

module.exports = construct;
