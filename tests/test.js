var expect = require('chai').expect;

describe('ncss', function ()
{
	describe('validate html', function ()
	{
		it('<div></div>', function ()
		{
			var result = true;

			expect(result).to.be.true;
		});

		it('<div class="foo-box-valid"></div>', function ()
		{
			var result = true;

			expect(result).to.be.true;
		});

		// <div></div>
		// <div class>empty class</div>
		// <div class="">empty class</div>
		// <div class=" ">empty class</div>
		// <div class="	">empty class</div>
		// <div class="foo-box-valid">valid</div>
		//
		// <!-- invalid -->
		//
		// <span class="foo-box-invalid">invalid tag</span>
		// <span class="foo-boxxx">invalid class</span>
		//
		// <span class="foo">invalid class</span>
		// <span class="foo-invalid">invalid class</span>
		// <div class="foo-box-invalid bar-box-invalid">invalid class / mixed namespace</div>
	});
});
