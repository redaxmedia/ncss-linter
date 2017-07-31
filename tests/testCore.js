var phantom = require('phantom'),
	core = require('../src/core'),
	reporter = require('../src/reporter'),
	ruleset = require('../src/ruleset'),
	option = require('../src/option'),
	CORE,
	REPORTER;

describe('core', function ()
{
	describe('validate html', function ()
	{
		var coreArray = require('./provider/core.json');

		coreArray.forEach(function (coreValue)
		{
			it(coreValue.optionArray.html, function (done)
			{
				option.init(coreValue.optionArray);
				REPORTER = new reporter(
				{
					option: option
				});
				CORE = new core(
				{
					phantom: phantom,
					reporter: REPORTER,
					ruleset: ruleset,
					option: option
				});
				CORE
					.init()
					.then(function ()
					{
						if (REPORTER.getReport() === coreValue.reportArray)
						{
							done();
						}
					});
			});
		});
	});
});
