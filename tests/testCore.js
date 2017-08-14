const expect = require('chai').expect;
const ncss = require('../');
const core = ncss.core;
const reporter = ncss.reporter;
const ruleset = ncss.ruleset;
const option = ncss.option;

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
