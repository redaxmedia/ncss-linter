var config = require('../config.json');

/**
 * get
 *
 * @since 1.0.0
 *
 * @param namespace string
 *
 * @return array
 */

function get(namespace)
{
	return typeof namespace === 'string' ? create(namespace) : config.providerArray;
}

/**
 * create
 *
 * @since 1.0.0
 *
 * @param namespace string
 *
 * @return array
 */

function create(namespace)
{
	var namespaceArray = namespace.split(','),
		providerArray = [],
		providerKey;

	/* process namespace */

	namespaceArray.forEach(function (namespaceValue)
	{
		Object.keys(config.providerArray).forEach(function (providerValue, providerIndex)
		{
			providerKey = namespaceValue + providerValue;
			providerArray[providerKey] = config.providerArray[providerIndex];
		});
	});
	return providerArray;
}

module.exports =
{
	get: get
};