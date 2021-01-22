const puppeteer = require('puppeteer');
const { Page } = puppeteer;

let reporter;
let validator;
let helper;
let option;

/**
 * get the element
 *
 * @since 4.0.0
 *
 * @param {Page} page
 *
 * @return {Promise}
 */

function _getElement(page)
{
	const selector = option.get('selector');

	return page.$$eval(selector, element => element.map(elementValue =>
	{
		const element =
		{
			tagName: elementValue.tagName.toLowerCase(),
			attrArray: Object.values(elementValue.attributes).map(value => value.name.toLowerCase()).filter(value => value),
			classArray: elementValue.classList.value.toLowerCase().split(' ').filter(value => value)
		};

		return element;
	}));
}

/**
 * process the element
 *
 * @since 1.4.0
 *
 * @param {Array} elementArray
 *
 * @return {void}
 */

function _processElement(elementArray)
{
	elementArray.map((elementValue, elementIndex) =>
	{
		if (elementValue.attrArray.length || elementValue.classArray.length)
		{
			const validateArray = validator.getValidateArray(elementValue);

			/* report as needed */

			if (validateArray.invalidAttribute.status)
			{
				reporter.warn(
				{
					type: 'invalid-attribute',
					selector: elementValue.tagName + '[' + elementValue.attrArray.join('][') + ']',
					context: validateArray.invalidAttribute.contextArray.join('/')
				});
			}
			else if (validateArray.invalidNamespace.status)
			{
				reporter.fail(
				{
					type: 'invalid-namespace',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (validateArray.invalidVariation.status)
			{
				reporter.fail(
				{
					type: 'invalid-variation',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.'),
					context: validateArray.invalidVariation.contextArray.join('/')
				});
			}
			else if (validateArray.invalidTag.status)
			{
				reporter.fail(
				{
					type: 'invalid-tag',
					selector: elementValue.tagName + '.' + elementValue.classArray.join('.')
				});
			}
			else if (validateArray.invalidClass.status)
			{
				reporter.fail(
				{
					type: 'invalid-class',
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
 * @param {string} url
 * @param {Page} page
 * @param {object} defer
 *
 * @return {void}
 */

function _setUrl(url, page, defer)
{
	page.goto(url)
		.then(() => _processPage(page, defer))
		.catch(error => defer.reject(error));
}

/**
 * set the content
 *
 * @since 4.0.0
 *
 * @param {string} content
 * @param {Page} page
 * @param {object} defer
 *
 * @return {void}
 */

function _setContent(content, page, defer)
{
	page.setContent(content)
		.then(() => _processPage(page, defer))
		.catch(error => defer.reject(error));
}

/**
 * process the page
 *
 * @since 1.3.0
 *
 * @param {Page} page
 * @param {object} defer
 *
 * @return {void}
 */

function _processPage(page, defer)
{
	_getElement(page)
		.then(elementArray =>
		{
			_processElement(elementArray);
			reporter.summary();
			reporter.result();
			defer.resolve();
		})
		.catch(error => defer.reject(error));
}

/**
 * init
 *
 * @since 4.0.0
 *
 * @return {Promise}
 */

async function init()
{
	const browser = await puppeteer
		.launch(
		{
			ignoreHTTPSErrors: true,
			args:
			[
				'--no-sandbox'
			]
		})
		.catch(() => process.exit(1));
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
				.then(walkArray =>
				{
					_setContent(walkArray.map(walkValue => walkValue.content), page, defer);
				})
				.catch(error => defer.reject(error));
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
 * @param {object} injectorObject
 *
 * @return {object}
 */

function construct(injectorObject)
{
	const exports =
	{
		init
	};

	/* handle injector */

	if (injectorObject.reporter && injectorObject.validator && injectorObject.reporter && injectorObject.option)
	{
		reporter = injectorObject.reporter;
		validator = injectorObject.validator;
		helper = injectorObject.helper;
		option = injectorObject.option;
	}
	return exports;
}

module.exports = construct;
