const expect = require('chai').expect;
const events = require('events');
const ncss = require('../');
const core = ncss.core;
const reporter = ncss.reporter;
const ruleset = ncss.ruleset;
const option = ncss.option;
const providerArray =
[
	{
		describe: 'skip empty classes',
		data: require('./provider/skip_empty_classes.json')
	},
	{
		describe: 'valid namespaces',
		data: require('./provider/valid_namespaces.json')
	},
	{
		describe: 'valid components',
		data: require('./provider/valid_components.json')
	},
	{
		describe: 'valid structural classes',
		data: require('./provider/valid_structural_classes.json')
	},
	{
		describe: 'valid type classes',
		data: require('./provider/valid_type_classes.json')
	},
	{
		describe: 'valid functional classes',
		data: require('./provider/valid_functional_classes.json')
	},
	{
		describe: 'valid exceptions',
		data: require('./provider/valid_exceptions.json')
	},
	{
		describe: 'invalid characters',
		data: require('./provider/invalid_characters.json')
	},
	{
		describe: 'invalid namespaces',
		data: require('./provider/invalid_namespaces.json')
	},
	{
		describe: 'invalid general classes',
		data: require('./provider/invalid_general_classes.json')
	},
	{
		describe: 'invalid structural classes',
		data: require('./provider/invalid_structural_classes.json')
	},
	{
		describe: 'invalid component classes',
		data: require('./provider/invalid_component_classes.json')
	},
	{
		describe: 'invalid type classes',
		data: require('./provider/invalid_type_classes.json')
	},
	{
		describe: 'invalid functional classes',
		data: require('./provider/invalid_functional_classes.json')
	},
	{
		describe: 'invalid exceptions',
		data: require('./provider/invalid_exceptions.json')
	},
	{
		describe: 'invalid tags',
		data: require('./provider/invalid_tags.json')
	}
];

let REPORTER;
let CORE;

/**
 * test
 *
 * @since 1.3.0
 *
 * @param optionArray object
 * @param reportArray object
 */

function test(optionArray, reportArray)
{
	events.EventEmitter.defaultMaxListeners++;
	it(optionArray.html, done =>
	{
		option.init(optionArray);
		REPORTER = new reporter(
		{
			option
		});
		CORE = new core(
		{
			reporter: REPORTER,
			ruleset,
			option
		});
		CORE
			.init()
			.then(() =>
			{
				expect(REPORTER.getReport()).to.deep.equal(reportArray);
				done();
			});
	})
	.timeout(1000);
}

describe('core', () =>
{
	providerArray.forEach(providerValue =>
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
