var phantom,
	reporter,
	ruleset,
	option;

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
					type: 'invalid class',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (!elementValue.validTag)
			{
				reporter.fail(
				{
					type: 'invalid tag',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else
			{
				reporter.pass(
				{
					type: 'valid',
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
		.then(function ()
		{
			getElement(page, option.get('selector'))
				.then(function (elementArray)
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
 * inject
 *
 * @since 1.0.0
 *
 * @param dependency object
 */

function inject(dependency)
{
	if (dependency.phantom && dependency.reporter && dependency.ruleset && dependency.option)
	{
		phantom = dependency.phantom;
		reporter = dependency.reporter;
		ruleset = dependency.ruleset;
		option = dependency.option;
	}
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
	var instance,
		defer;

	return new Promise(function (resolve, reject)
	{
		defer =
		{
			resolve: resolve,
			reject: reject
		};
		phantom
			.create()
			.then(function (currentInstance)
			{
				instance = currentInstance;
				return instance.createPage();
			})
			.then(function (page)
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

module.exports = function (dependency)
{
	var exports =
	{
		init: init,
		inject: inject
	};

	inject(dependency);
	return exports;
};