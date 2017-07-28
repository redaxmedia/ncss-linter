var rulesetArray = require('../ruleset.json');

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
	return typeof namespace === 'string' ? create(namespace) : rulesetArray;
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
		createArray = [],
		createKey;

	/* process namespace */

	namespaceArray.forEach(function (namespaceValue)
	{
		Object.keys(rulesetArray).forEach(function (createValue, createIndex)
		{
			createKey = namespaceValue + createValue;
			createArray[createKey] = rulesetArray[createIndex];
		});
	});
	return createArray;
}

module.exports =
{
	get: get
};