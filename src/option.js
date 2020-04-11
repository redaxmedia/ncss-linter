const fs = require('fs');
const option = require('utility-redaxmedia').option(__dirname + '/../option.json');

let configObject = {};

/**
 * init with config
 *
 * @since 1.0.0
 *
 * @param {object} initObject
 *
 * @return {void}
 */

option.initWithConfig = initObject =>
{
	if (fs.existsSync(option.get('config')))
	{
		configObject = JSON.parse(fs.readFileSync(option.get('config')));
	}
	if (fs.existsSync(initObject.config))
	{
		configObject = JSON.parse(fs.readFileSync(initObject.config));
	}
	option.init(
	{
		...configObject,
		...initObject
	});
};

module.exports = option;