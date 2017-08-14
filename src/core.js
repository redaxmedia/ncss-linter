const phantom = require('phantom');
const glob = require('glob');
const fs = require('fs');

let reporter;
let ruleset;
let option;

/**
 * get the element
 *
 * @since 1.0.0
 *
 * @param page object
 * @param selector string
 *
 * @return promise
 */

function _getElement(page, selector)
{
	return page
		.invokeMethod('evaluate', function(selector)
		{
			const element = document.querySelectorAll(selector);
			const elementArray = [];

			/* process element */

			Object.keys(element).forEach(function (elementValue)
			{
				elementArray.push(
				{
					tagName: element[elementValue].tagName ? element[elementValue].tagName.toLowerCase() : null,
					classArray: element[elementValue].className && element[elementValue].className.length ? element[elementValue].className.toLowerCase().match(/\S+/g) : []
				});
			});
			return elementArray;
		}, selector);
}

/**
 * process the element
 *
 * @since 1.4.0
 *
 * @param elementArray array
 */

function _processElement(elementArray)
{
	elementArray.forEach((elementValue, elementIndex) =>
	{
		if (elementValue.classArray.length)
		{
			const validateArray = _validateElement(elementValue);

			/* report as needed */

			if (!validateArray.character)
			{
				reporter.warn(
				{
					type: 'invalid-character',
					selector: elementValue.tagName
				});
			}
			else if (!validateArray.namespace)
			{
				reporter.fail(
				{
					type: 'invalid-namespace',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (!validateArray.class)
			{
				reporter.fail(
				{
					type: 'invalid-class',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (!validateArray.tag)
			{
				reporter.fail(
				{
					type: 'invalid-tag',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else
			{
				reporter.pass(
				{
					type: 'pass',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
		}

		/* else skip element */

		else
		{
			reporter.skip(
			{
				type: 'skip',
				selector: elementValue.tagName
			});
		}
		reporter.end(elementIndex + 1, elementArray.length);
	});
}

/**
 * validate the element
 *
 * @since 1.4.0
 *
 * @param elementValue array
 *
 * @return array
 */

function _validateElement(elementValue)
{
	const rulesetArray = ruleset.get();
	const namespace = option.get('namespace');
	const namespaceArray = namespace ? namespace.split(',') : [];
	const separator = option.get('separator');

	let validateArray = [];

	/* process class */

	elementValue.classArray.forEach(classValue =>
	{
		const fragmentArray = classValue.split(separator);

		/* process ruleset */

		Object.keys(rulesetArray).forEach(rulesetValue =>
		{
			validateArray.character = !classValue.match(/[^\w-_]/g);
			validateArray.namespace = namespace ? namespaceArray.indexOf(fragmentArray[0]) > -1 : true;
			if (!namespace && fragmentArray[0] === rulesetValue || namespace && fragmentArray[1] === rulesetValue)
			{
				validateArray.class = true;
				validateArray.tag = rulesetArray[rulesetValue] ? rulesetArray[rulesetValue].indexOf(elementValue.tagName) > -1 : true;
			}
		});
	});
	return validateArray;
}

/**
 * read the path
 *
 * @since 1.3.0
 *
 * @param path string
 *
 * @return promise object
 */

function _readPath(path)
{
	let content;
	let readCounter = 0;

	return new Promise(resolve =>
	{
		glob(path, (error, pathArray) =>
		{
			pathArray.forEach(fileValue =>
			{
				fs.readFile(fileValue, 'utf-8', (fileError, fileContent) =>
				{
					content += fileContent;
					if (++readCounter === pathArray.length)
					{
						resolve(content);
					}
				});
			});
		});
	});
}

/**
 * open the page
 *
 * @since 1.0.0
 *
 * @param url string
 * @param page object
 * @param defer object
 */

function _openPage(url, page, defer)
{
	page
		.open(url)
		.then(status =>
		{
			if (status)
			{
				_processPage(page, defer);
			}
			else
			{
				defer.reject();
			}
		});
}

/**
 * parse the html
 *
 * @since 1.0.0
 *
 * @param content string
 * @param page object
 * @param defer object
 */

function _parseHTML(content, page, defer)
{
	page
		.property('content', content)
		.then(() =>
		{
			_processPage(page, defer);
		});
}

/**
 * process the page
 *
 * @since 1.3.0
 *
 * @param page object
 * @param defer object
 */

function _processPage(page, defer)
{
	const selector = option.get('selector');
	const threshold = option.get('threshold');

	_getElement(page, selector)
		.then(elementArray =>
		{
			_processElement(elementArray);
			reporter.result(threshold);
			reporter.summary(threshold);
			defer.resolve();
		});
}

/**
 * init
 *
 * @since 1.0.0
 *
 * @return promise
 */

function init()
{
	let instance;
	let defer;

	return new Promise((resolve, reject) =>
	{
		defer =
		{
			resolve: resolve,
			reject: reject
		};
		phantom
			.create(
			[
				'--load-images=no'
			],
			{
				logLevel: option.get('loglevel')
			})
			.then(currentInstance =>
			{
				instance = currentInstance;
				return instance.createPage();
			})
			.then(page =>
			{
				reporter.header();
				if (option.get('html'))
				{
					_parseHTML(option.get('html'), page, defer);
				}
				else if (option.get('path'))
				{
					_readPath(option.get('path'))
						.then(content =>
						{
							_parseHTML(content, page, defer);
						})
						.catch(() =>
						{
							defer.reject();
						});
				}
				else if (option.get('url'))
				{
					_openPage(option.get('url'), page, defer);
				}
				else
				{
					defer.reject();
				}
			});
	})
	.then(() =>
	{
		instance.exit();
	})
	.catch(() =>
	{
		instance.exit();
	});
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
		init: init
	};

	/* inject dependency */

	if (dependency.reporter && dependency.ruleset && dependency.option)
	{
		reporter = dependency.reporter;
		ruleset = dependency.ruleset;
		option = dependency.option;
	}
	return exports;
}

module.exports = construct;