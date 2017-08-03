const phantom = require('phantom');

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
	const divider = option.get('divider');

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
				fragmentArray = classValue.split(divider);

				/* process ruleset */

				Object.keys(rulesetArray).forEach((rulesetValue) =>
				{
					elementValue.validNamespace = namespace ? namespace === fragmentArray[0] : true;
					if (!namespace && fragmentArray[0] === rulesetValue || namespace && fragmentArray[1] === rulesetValue)
					{
						elementValue.validClass = ++invalidCounter < rulesetTotal;
						elementValue.validTag = rulesetArray[rulesetValue] ? rulesetArray[rulesetValue].indexOf(elementValue.tagName) > -1 : true
					}
				});
			});

			/* collect and print */

			if (!elementValue.validNamespace)
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
 * open page
 *
 * @since 1.0.0
 *
 * @param page object
 * @param instance object
 * @param defer object
 */

function openPage(page, instance, defer)
{
	page
		.open(option.get('file') || option.get('url'))
		.then(status =>
		{
			if (status)
			{
				getElement(page, option.get('selector'))
					.then(elementArray =>
					{
						validateElement(elementArray, ruleset.get(option.get('namespace')));
						reporter.result(option.get('threshold'));
						reporter.summary();
						instance.exit();
						defer.resolve();
					});
			}
			else
			{
				instance.exit();
				defer.reject();
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
 * @param defer object
 */

function parseHTML(page, instance, defer)
{
	page
		.property('content', option.get('html'))
		.then(() =>
		{
			getElement(page, option.get('selector'))
				.then(elementArray =>
				{
					validateElement(elementArray, ruleset.get(option.get('namespace')));
					reporter.result(option.get('threshold'));
					reporter.summary();
					instance.exit();
					defer.resolve();
				});
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
			.create([],
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
					parseHTML(page, instance, defer);
				}
				else if (option.get('file') || option.get('url'))
				{
					openPage(page, instance, defer);
				}
				else
				{
					instance.exit();
					defer.reject();
				}
			});
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