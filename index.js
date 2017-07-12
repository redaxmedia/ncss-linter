require('string.prototype.startswith');

var page = require('webpage').create(),
	system = require('system'),
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
		HTML: system.env.HTML || null,
		FILE: system.env.FILE || null,
		URL: system.env.URL || null,
		NAMESPACE: system.env.NAMESPACE || null,
		SELECTOR: system.env.SELECTOR || '*',
		THRESHOLD: system.env.THRESHOLD || 0
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
 * @param selector string
 *
 * @return array
 */

function getElement(selector)
{
	return page.evaluate(function (selector)
	{
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
				system.stdout.write('C');
			}
			else if (!elementValue.validTag)
			{
				issueArray.push(
				{
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.'),
					message: wordingArray.invalid_tag
				});
				system.stdout.write('T');
			}
			else
			{
				system.stdout.write('.');
			}
		}

		/* else skip element */

		else
		{
			system.stdout.write('.');
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

	system.stdout.writeLine(packageArray.name + ' ' + packageArray.version + ' ' + wordingArray.by + ' ' + packageArray.author + wordingArray.point);
	system.stdout.writeLine(null);
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
			system.stdout.write(' ');
		}
		system.stdout.write(' ' + elementCounter + ' / ' + elementTotal + ' (' + Math.ceil(elementCounter / elementTotal * 100) + '%)');
		system.stdout.writeLine(null);
	}
}

/**
 * print footer
 *
 * @since 1.0.0
 */

function printFooter()
{
	system.stdout.writeLine(null);
	system.stdout.writeLine(null);

	/* result message */

	if (issueArray.length > env.THRESHOLD)
	{
		system.stdout.writeLine(wordingArray.failed.toUpperCase() + wordingArray.exclamation_mark + ' (' + issueArray.length + ' ' + wordingArray.issues_found + ')');
	}
	else
	{
		system.stdout.writeLine(wordingArray.passed.toUpperCase() + wordingArray.exclamation_mark);
	}

	/* process issue */

	if (issueArray.length)
	{
		system.stdout.writeLine(null);
		issueArray.forEach(function (issueValue)
		{
			system.stdout.writeLine(issueValue.selector + ' (' + issueValue.message + ')');
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
	printHeader();

	/* html string */

	if (env.HTML)
	{
		page.content = env.HTML;
		validateElement(getElement(env.SELECTOR), createProvider(env.NAMESPACE));
		printFooter();
		phantom.exit(1);
	}

	/* local file or remote website */

	if (env.FILE || env.URL)
	{
		page.open(env.FILE || env.URL, function (status)
		{
			if (status)
			{
				validateElement(getElement(env.SELECTOR), createProvider(env.NAMESPACE));
				printFooter();
			}
			phantom.exit();
		});
	}
}

init();