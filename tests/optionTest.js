const expect = require('chai').expect;
const ncss = require('../');
const option = ncss.option;

describe('option', () =>
{
	it('init', () =>
	{
		option.init(
		{
			config: 'tests/provider/option/.ncsslintrc',
			url: 'https://ncss.io'
		});
		expect(option.get('config')).to.equal('tests/provider/option/.ncsslintrc');
		expect(option.get('url')).to.equal('https://ncss.io');
		expect(option.get('namespace')).to.equal('bar');
		expect(option.get('separator')).to.equal('-');
	});
});
