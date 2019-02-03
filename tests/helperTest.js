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
				expect(contentArray[0].content).to.equal('1');
				expect(contentArray[1].content).to.equal('2');
				expect(contentArray[2].content).to.equal('3');
				expect(contentArray[0].path).to.equal('./tests/provider/helper/1.html');
				expect(contentArray[1].path).to.equal('./tests/provider/helper/2.html');
				expect(contentArray[2].path).to.equal('./tests/provider/helper/3.html');
				done();
			})
			.catch(() => null);
	})
	.timeout(1000);
});
