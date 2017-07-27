var extend = require('extend'),
	configArray = require('../config.json'),
	optionArray = configArray.optionArray;

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
	optionArray = extend({}, optionArray, initArray);
}

module.exports =
{
	get: get,
	init: init
};