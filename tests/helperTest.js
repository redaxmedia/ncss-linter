const expect = require('chai').expect;
const ncss = require('../');
const helper = ncss.helper;

describe('helper', () =>
{
	it('walk the path', done =>
	{
		helper
			.walkPath('./tests/provider/helper/*.html')
			.then(contentArray =>
			{
				contentArray.forEach(contentValue =>
				{
					expect(contentValue.path).to.equal('./tests/provider/helper/' + contentValue.content + '.html');
				});
				done();
			})
			.catch(() => done('error'));
	});
});
