require('string.prototype.startswith');

var phantom = require('phantom'),
	optioner = require('./optioner'),
	provider = require('./provider'),
	reporter = require('./reporter');

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
 * @param providerArray array
 */

function validateElement(elementArray, providerArray)
{
	var providerTotal = Object.keys(providerArray).length,
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

				/* process provider */

				Object.keys(providerArray).forEach(function (providerValue, providerIndex)
				{
					if (classValue.startsWith(providerValue))
					{
						elementValue.validTag = providerArray[providerIndex] ? providerArray[providerIndex].indexOf(elementValue.tagName) > -1 : true;
					}
					else
					{
						elementValue.validClass = ++invalidCounter < providerTotal;
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
		.open(optioner.get('file') || optioner.get('url'))
		.then(function (status)
		{
			if (status)
			{
				getElement(page, optioner.get('selector'))
					.then(function (elementArray)
					{
						validateElement(elementArray, provider.get(optioner.get('namespace')));
						reporter.result(optioner.get('threshold'));
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
		.property('content', optioner.get('html'))
		.then(function ()
		{
			getElement(page, optioner.get('selector'))
				.then(function (elementArray)
				{
					validateElement(elementArray, provider.get(optioner.get('namespace')));
					reporter.result(optioner.get('threshold'));
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

	optioner.init(optionArray);
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
			if (optioner.get('html'))
			{
				parseHTML(page, instance);
			}
			else if (optioner.get('file') || optioner.get('url'))
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