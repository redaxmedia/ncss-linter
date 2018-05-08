const fs = require('fs');
const extend = require('extend');

let optionArray = require('../option.json');
let configArray = {};

/**
 * get
 *
 * @since 1.0.0
 *
 * @param name string
 *
 * @return string
 */

function get(name)
{
	return optionArray[name];
}

/**
 * init
 *
 * @since 1.0.0
 *
 * @param initArray array
 */

function init(initArray)
{
	if (fs.existsSync(optionArray.config))
	{
		configArray = JSON.parse(fs.readFileSync(optionArray.config, 'utf-8'));
	}
	if (fs.existsSync(initArray.config))
	{
		configArray = JSON.parse(fs.readFileSync(initArray.config, 'utf-8'));
	}
	optionArray = extend(optionArray, configArray, initArray);
}

module.exports =
{
	get,
	init
};