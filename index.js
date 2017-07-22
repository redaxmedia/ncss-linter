require('string.prototype.startswith');

var phantom = require('phantom'),
	fs = require('fs'),
	configArray = require('./config.json'),
	wordingArray = require('./wording.json'),
	issueArray = [],
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
				issueArray.push(
				{
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.'),
					message: wordingArray.invalid_class
				});
				process.stdout.write('C');
			}
			else if (!elementValue.validTag)
			{
				issueArray.push(
				{
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.'),
					message: wordingArray.invalid_tag
				});
				process.stdout.write('T');
			}
			else
			{
				process.stdout.write('.');
			}
		}

		/* else skip element */

		else
		{
			process.stdout.write('.');
		}
		printProcessEnd(++elementCounter, elementTotal);
	});
}

/**
 * print header
 *
 * @since 1.0.0
 */

function printHeader()
{
	var packageArray = wordingArray._package;

	process.stdout.write(packageArray.name + ' ' + packageArray.version + ' ' + wordingArray.by + ' ' + packageArray.author + wordingArray.point + '\n');
	process.stdout.write('\n');
}

/**
 * print process end
 *
 * @since 1.0.0
 *
 * @param elementCounter number
 * @param elementTotal number
 */

function printProcessEnd(elementCounter, elementTotal)
{
	if (elementCounter % 60 === 0)
	{
		if (elementCounter === 60)
		{
			process.stdout.write(' ');
		}
		process.stdout.write(' ' + elementCounter + ' / ' + elementTotal + ' (' + Math.ceil(elementCounter / elementTotal * 100) + '%)');
		process.stdout.write('\n');
	}
}

/**
 * print footer
 *
 * @since 1.0.0
 */

function printFooter()
{
	process.stdout.write('\n');
	process.stdout.write('\n');

	/* result message */

	if (issueArray.length > env.THRESHOLD)
	{
		process.stdout.write(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark + ' (' + issueArray.length + ' ' + wordingArray.issues_found + ')\n');
	}
	else
	{
		process.stdout.write(wordingArray.passed.toUpperCase() + wordingArray.exclamation_mark + '\n');
	}

	/* process issue */

	if (issueArray.length)
	{
		process.stdout.write('\n');
		issueArray.forEach(function (issueValue)
		{
			process.stdout.write(issueValue.selector + ' (' + issueValue.message + ')\n');
		});
	}
}

/**
 * init
 *
 * @since 1.0.0
 */

function init()
{
	var currentInstance;

	printHeader();

	/* html string */

	if (env.HTML)
	{
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
								printFooter();
								currentInstance.exit();
							});
					});
			});
	}

	/* local file or remote website */

	if (fs.existsSync(env.FILE) || env.URL)
	{
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
									printFooter();
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

init();