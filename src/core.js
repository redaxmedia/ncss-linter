require('string.prototype.startswith');

var phantom = require('phantom'),
	fs = require('fs'),
	reporter = require('./reporter'),
	configArray = require('../config.json'),
	env = getEnv();

/**
 * get env
 *
 * @since 1.0.0
 *
 * @return array
 */

function getEnv()
{
	return env =
	{
		HTML: process.env.HTML || null,
		FILE: process.env.FILE || null,
		URL: process.env.URL || null,
		NAMESPACE: process.env.NAMESPACE || null,
		SELECTOR: process.env.SELECTOR || '*',
		THRESHOLD: process.env.THRESHOLD || 0
	};
}

/**
 * create provider
 *
 * @since 1.0.0
 *
 * @param namespace string
 *
 * @return array
 */

function createProvider(namespace)
{
	var namespaceArray = namespace.split(','),
		providerArray = [],
		providerKey;

	/* process namespace */

	namespaceArray.forEach(function (namespaceValue)
	{
		Object.keys(configArray).forEach(function (configValue, configIndex)
		{
			providerKey = namespaceValue + configValue;
			providerArray[providerKey] = configArray[configIndex];
		});
	});
	return providerArray;
}

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
 * init
 *
 * @since 1.0.0
 */

function init()
{
	reporter.header();

	/* html string */

	if (env.HTML)
	{
		var currentInstance;

		phantom
			.create()
			.then(function (instance)
			{
				currentInstance = instance;
				return instance.createPage();
			})
			.then(function (page)
			{
				page
					.property('content', env.HTML)
					.then(function ()
					{
						getElement(page, env.SELECTOR)
							.then(function (elementArray)
							{
								validateElement(elementArray, createProvider(env.NAMESPACE));
								reporter.result(env.THRESHOLD);
								reporter.summary();
								currentInstance.exit();
							});
					});
			});
	}

	/* local file or remote website */

	if (fs.existsSync(env.FILE) || env.URL)
	{
		var currentInstance;

		phantom
			.create()
			.then(function (instance)
			{
				currentInstance = instance;
				return instance.createPage();
			})
			.then(function (page)
			{
				page
					.open(env.FILE || env.URL)
					.then(function (status)
					{
						if (status)
						{
							getElement(page, env.SELECTOR)
								.then(function (elementArray)
								{
									validateElement(elementArray, createProvider(env.NAMESPACE));
									reporter.result(env.THRESHOLD);
									reporter.summary();
									currentInstance.exit();
								});
						}
						else
						{
							currentInstance.exit();
						}
					})
			});
	}
}

module.exports =
{
	init: init
};