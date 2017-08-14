const phantom = require('phantom');
const glob = require('glob');
const fs = require('fs');

let reporter;
let ruleset;
let option;

/**
 * get element
 *
 * @since 1.0.0
 *
 * @param page object
 * @param selector string
 *
 * @return promise
 */

function getElement(page, selector)
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
 * validate element
 *
 * @since 1.0.0
 *
 * @param elementArray array
 * @param rulesetArray array
 */

function validateElement(elementArray, rulesetArray)
{
	const rulesetTotal = Object.keys(rulesetArray).length;
	const elementTotal = elementArray.length;
	const namespace = option.get('namespace');
	const namespaceArray = namespace ? namespace.split(',') : [];
	const separator = option.get('separator');

	let fragmentArray = [];
	let elementCounter = 0;
	let invalidCounter = 0;

	/* process element */

	elementArray.forEach(elementValue =>
	{
		/* process class */

		if (elementValue.classArray.length)
		{
			elementValue.classArray.forEach(classValue =>
			{
				invalidCounter = 0;
				fragmentArray = classValue.split(separator);

				/* process ruleset */

				Object.keys(rulesetArray).forEach(rulesetValue =>
				{
					elementValue.validCharacter = !classValue.match(/[^\w-_]/g);
					elementValue.validNamespace = namespace ? namespaceArray.indexOf(fragmentArray[0]) > -1 : true;
					if (!namespace && fragmentArray[0] === rulesetValue || namespace && fragmentArray[1] === rulesetValue)
					{
						elementValue.validClass = ++invalidCounter < rulesetTotal;
						elementValue.validTag = rulesetArray[rulesetValue] ? rulesetArray[rulesetValue].indexOf(elementValue.tagName) > -1 : true;
					}
				});
			});

			/* collect and print */

			if (!elementValue.validCharacter)
			{
				reporter.warn(
				{
					type: 'invalid-character',
					selector: elementValue.tagName
				});
			}
			else if (!elementValue.validNamespace)
			{
				reporter.fail(
				{
					type: 'invalid-namespace',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (!elementValue.validClass)
			{
				reporter.fail(
				{
					type: 'invalid-class',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (!elementValue.validTag)
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
		reporter.end(++elementCounter, elementTotal);
	});
}

/**
 * read path
 *
 * @since 1.3.0
 *
 * @param path string
 *
 * @return promise object
 */

function readPath(path)
{
	let content;

	return new Promise(resolve =>
	{
		glob(path, (error, pathArray) =>
		{
			pathArray.forEach((fileValue, fileIndex) =>
			{
				fs.readFile(fileValue, 'utf-8', (fileError, fileContent) =>
				{
					content += fileContent;
					if (fileIndex === pathArray.length - 1)
					{
						resolve(content);
					}
				});
			});
		});
	});
}

/**
 * open page
 *
 * @since 1.0.0
 *
 * @param url string
 * @param page object
 * @param defer object
 */

function openPage(url, page, defer)
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
 * parse html
 *
 * @since 1.0.0
 *
 * @param content string
 * @param page object
 * @param defer object
 */

function parseHTML(content, page, defer)
{
	page
		.property('content', content)
		.then(() =>
		{
			_processPage(page, defer);
		});
}

/**
 * process page
 *
 * @since 1.3.0
 *
 * @param page object
 * @param defer object
 */

function _processPage(page, defer)
{
	const threshold = option.get('threshold');

	getElement(page, option.get('selector'))
		.then(elementArray => {
			validateElement(elementArray, ruleset.get(option.get('namespace')));
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
					parseHTML(option.get('html'), page, defer);
				}
				else if (option.get('path'))
				{
					readPath(option.get('path'))
						.then(content =>
						{
							parseHTML(content, page, defer);
						})
						.catch(() =>
						{
							defer.reject();
						});
				}
				else if (option.get('url'))
				{
					openPage(option.get('url'), page, defer);
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