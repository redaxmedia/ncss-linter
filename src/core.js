require('string.prototype.startswith');

var phantom = require('phantom'),
	reporter = require('./reporter'),
	ruleset = require('./ruleset'),
	option = require('./option');

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
		.invokeMethod('evaluate', function(selector) {
			var element = document.querySelectorAll(selector),
				elementArray = [];

			/* process element */

			Object.keys(element).forEach(function (elementValue)
			{
				elementArray.push(
				{
					tagName: element[elementValue].tagName ? element[elementValue].tagName.toLowerCase() : null,
					classArray: element[elementValue].className && element[elementValue].className.length ? element[elementValue].className.toLowerCase().split(' ') : []
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
	var rulesetTotal = Object.keys(rulesetArray).length,
		elementTotal = elementArray.length,
		elementCounter = 0,
		invalidCounter = 0;

	/* process element */

	elementArray.forEach(function (elementValue)
	{
		/* process class */

		if (elementValue.classArray.length)
		{
			elementValue.classArray.forEach(function (classValue)
			{
				invalidCounter = 0;

				/* process ruleset */

				Object.keys(rulesetArray).forEach(function (rulesetValue, rulesetIndex)
				{
					if (classValue.startsWith(rulesetValue))
					{
						elementValue.validTag = rulesetArray[rulesetIndex] ? rulesetArray[rulesetIndex].indexOf(elementValue.tagName) > -1 : true;
					}
					else
					{
						elementValue.validClass = ++invalidCounter < rulesetTotal;
					}
				});
			});

			/* collect and print */

			if (!elementValue.validClass)
			{
				reporter.fail(
				{
					type: 'class',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (!elementValue.validTag)
			{
				reporter.fail(
				{
					type: 'tag',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else
			{
				reporter.pass();
			}
		}

		/* else skip element */

		else
		{
			reporter.skip();
		}
		reporter.end(++elementCounter, elementTotal);
	});
}

/**
 * open page
 *
 * @since 1.0.0
 *
 * @param page object
 * @param instance object
 */

function openPage(page, instance)
{
	page
		.open(option.get('file') || option.get('url'))
		.then(function (status)
		{
			if (status)
			{
				getElement(page, option.get('selector'))
					.then(function (elementArray)
					{
						validateElement(elementArray, ruleset.get(option.get('namespace')));
						reporter.result(option.get('threshold'));
						reporter.summary();
						instance.exit();
					});
			}
			else
			{
				instance.exit();
			}
		});
}

/**
 * parse html
 *
 * @since 1.0.0
 *
 * @param page object
 * @param instance object
 */

function parseHTML(page, instance)
{
	page
		.property('content', option.get('html'))
		.then(function ()
		{
			getElement(page, option.get('selector'))
				.then(function (elementArray)
				{
					validateElement(elementArray, ruleset.get(option.get('namespace')));
					reporter.result(option.get('threshold'));
					reporter.summary();
					instance.exit();
				});
		});
}

/**
 * init
 *
 * @since 1.0.0
 *
 * @param optionArray array
 */

function init(optionArray)
{
	var instance;

	option.init(optionArray);
	reporter.header();
	phantom
		.create()
		.then(function (currentInstance)
		{
			instance = currentInstance;
			return instance.createPage();
		})
		.then(function (page)
		{
			if (option.get('html'))
			{
				parseHTML(page, instance);
			}
			else if (option.get('file') || option.get('url'))
			{
				openPage(page, instance);
			}
			else
			{
				instance.exit();
			}
		});
}

module.exports =
{
	init: init
};