const fs = require('fs');

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
		configArray = JSON.parse(fs.readFileSync(optionArray.config));
	}
	if (fs.existsSync(initArray.config))
	{
		configArray = JSON.parse(fs.readFileSync(initArray.config));
	}
	optionArray =
	{
		...optionArray,
		...configArray,
		...initArray
	};
}

module.exports =
{
	get,
	init
};