const expect = require('chai').expect;
const events = require('events');
const ncss = require('../');
const core = ncss.core;
const reporter = ncss.reporter;
const validator = ncss.validator;
const helper = ncss.helper;
const ruleset = ncss.ruleset;
const option = ncss.option;
const providerArray =
[
	{
		describe: 'skip empty classes',
		data: require('./provider/core/skip_empty_classes.json')
	},
	{
		describe: 'valid namespaces',
		data: require('./provider/core/valid_namespaces.json')
	},
	{
		describe: 'valid components',
		data: require('./provider/core/valid_components.json')
	},
	{
		describe: 'valid structural classes',
		data: require('./provider/core/valid_structural_classes.json')
	},
	{
		describe: 'valid type classes',
		data: require('./provider/core/valid_type_classes.json')
	},
	{
		describe: 'valid functional classes',
		data: require('./provider/core/valid_functional_classes.json')
	},
	{
		describe: 'valid exceptions',
		data: require('./provider/core/valid_exceptions.json')
	},
	{
		describe: 'invalid characters',
		data: require('./provider/core/invalid_characters.json')
	},
	{
		describe: 'invalid namespaces',
		data: require('./provider/core/invalid_namespaces.json')
	},
	{
		describe: 'invalid general classes',
		data: require('./provider/core/invalid_general_classes.json')
	},
	{
		describe: 'invalid structural classes',
		data: require('./provider/core/invalid_structural_classes.json')
	},
	{
		describe: 'invalid component classes',
		data: require('./provider/core/invalid_component_classes.json')
	},
	{
		describe: 'invalid type classes',
		data: require('./provider/core/invalid_type_classes.json')
	},
	{
		describe: 'invalid functional classes',
		data: require('./provider/core/invalid_functional_classes.json')
	},
	{
		describe: 'invalid exceptions',
		data: require('./provider/core/invalid_exceptions.json')
	},
	{
		describe: 'invalid tags',
		data: require('./provider/core/invalid_tags.json')
	}
];

let REPORTER;
let VALIDATOR;
let CORE;

/**
 * test
 *
 * @since 1.3.0
 *
 * @param {object} optionObject
 * @param {object} reportObject
 *
 * @return {void}
 */

function test(optionObject, reportObject)
{
	events.EventEmitter.defaultMaxListeners++;
	it(optionObject.html, done =>
	{
		option.init(optionObject);
		REPORTER = new reporter(
		{
			option
		});
		VALIDATOR = new validator(
		{
			ruleset,
			option
		});
		CORE = new core(
		{
			reporter: REPORTER,
			validator: VALIDATOR,
			helper,
			option
		});
		CORE
			.init()
			.then(() =>
			{
				expect(REPORTER.getReport()).to.deep.equal(reportObject);
				done();
			})
			.catch(() => done('error'));
	})
	.timeout(1000);
}

describe('core', () =>
{
	providerArray.map(providerValue =>
	{
		describe(providerValue.describe, () =>
		{
			providerValue.data.forEach(dataValue =>
			{
				test(dataValue.optionArray, dataValue.reportArray);
			});
		});
	});
});
