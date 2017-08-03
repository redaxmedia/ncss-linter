const expect = require('chai').expect;
const core = require('../src/core');
const reporter = require('../src/reporter');
const ruleset = require('../src/ruleset');
const option = require('../src/option');

let REPORTER;
let CORE;

describe('core', () =>
{
	describe('validate html', () =>
	{
		const coreArray = require('./provider/core.json');

		coreArray.forEach(coreValue =>
		{
			it(coreValue.optionArray.html, done =>
			{
				option.init(coreValue.optionArray);
				REPORTER = new reporter(
				{
					option: option
				});
				CORE = new core(
				{
					reporter: REPORTER,
					ruleset: ruleset,
					option: option
				});
				CORE
					.init()
					.then(() =>
					{
						expect(REPORTER.getReport()).to.deep.equal(coreValue.reportArray);
						done();
					});
			});
		});
	});
});
