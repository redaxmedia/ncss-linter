const fs = require('fs');
const option = require('utility-redaxmedia').option(__dirname + '/../option.json');

let configArray = {};

/**
 * init with config
 *
 * @since 1.0.0
 *
 * @param initArray array
 */

option.initWithConfig = initArray =>
{
	if (fs.existsSync(option.get('config')))
	{
		configArray = JSON.parse(fs.readFileSync(option.get('config')));
	}
	if (fs.existsSync(initArray.config))
	{
		configArray = JSON.parse(fs.readFileSync(initArray.config));
	}
	option.init(
	{
		...configArray,
		...initArray
	});
};

module.exports = option;