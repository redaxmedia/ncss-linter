const puppeteer = require('puppeteer');

let reporter;
let validator;
let helper;
let option;

/**
 * get the element
 *
 * @since 4.0.0
 *
 * @param page object
 * @param selector string
 *
 * @return Promise
 */

async function _getElement(page, selector)
{
	return await page.$$eval(selector, element => element.map(elementValue =>
	{
		const element =
		{
			tagName: elementValue.tagName.toLowerCase(),
			classArray: elementValue.className.toLowerCase().split(' ').filter(value => value)
		};

		return element;
	}));
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
			const validateArray = validator.getValidateArray(elementValue);

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
			else if (!validateArray.variation)
			{
				reporter.fail(
				{
					type: 'invalid-variation',
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
 * set the url
 *
 * @since 4.0.0
 *
 * @param url string
 * @param page object
 * @param defer object
 */

function _setUrl(url, page, defer)
{
	page.goto(url)
		.then(() => _processPage(page, defer))
		.catch(() => defer.reject());
}

/**
 * set the content
 *
 * @since 4.0.0
 *
 * @param content string
 * @param page object
 * @param defer object
 */

function _setContent(content, page, defer)
{
	page.setContent(content)
		.then(() => _processPage(page, defer))
		.catch(() => defer.reject());
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
	const thresholdError = option.get('thresholdError');
	const thresholdWarn = option.get('thresholdWarn');

	_getElement(page, selector)
		.then(elementArray =>
		{
			_processElement(elementArray);
			reporter.result(thresholdError, thresholdWarn);
			reporter.summary(thresholdError, thresholdWarn);
			defer.resolve();
		})
		.catch(() => defer.reject());
}

/**
 * init
 *
 * @since 4.0.0
 *
 * @return Promise
 */

async function init()
{
	const browser = await puppeteer.launch(
	{
		ignoreHTTPSErrors: true,
		args:
		[
			'--no-sandbox'
		]
	});
	const page = await browser.newPage();
	let defer;

	return new Promise((resolve, reject) =>
	{
		defer =
		{
			resolve,
			reject
		};
		if (option.get('html'))
		{
			reporter.header();
			_setContent(option.get('html'), page, defer);
		}
		else if (option.get('path'))
		{
			reporter.header();
			helper.walkPath(option.get('path'))
				.then(contentArray =>
				{
					_setContent(contentArray.map(item => item.content), page, defer);
				})
				.catch(() => defer.reject());
		}
		else if (option.get('url'))
		{
			reporter.header();
			_setUrl(option.get('url'), page, defer);
		}
		else
		{
			defer.reject();
		}
	})
	.then(async () => await browser.close())
	.catch(async () => await browser.close());
}

/**
 * construct
 *
 * @since 1.0.0
 *
 * @param injector object
 *
 * @return object
 */

function construct(injector)
{
	const exports =
	{
		init
	};

	/* handle injector */

	if (injector.reporter && injector.validator && injector.reporter && injector.option)
	{
		reporter = injector.reporter;
		validator = injector.validator;
		helper = injector.helper;
		option = injector.option;
	}
	return exports;
}

module.exports = construct;