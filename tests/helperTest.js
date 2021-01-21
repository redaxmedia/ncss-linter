const expect = require('chai').expect;
const ncss = require('../');
const helper = ncss.helper;

describe('helper', () =>
{
	it('walk the path', done =>
	{
		helper
			.walkPath('./tests/provider/helper/*.html')
			.then(walkArray =>
			{
				walkArray.map(walkArray =>
				{
					expect(walkArray.path).to.equal('./tests/provider/helper/' + walkArray.content + '.html');
				});
				done();
			})
			.catch(() => done('error'));
	});
});
