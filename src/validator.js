let ruleset;
let option;

/**
 * get the validate array
 *
 * @since 4.0.9
 *
 * @param {object} elementValue
 *
 * @return {Array}
 */

function getValidateArray(elementValue)
{
	const rulesetArray = ruleset.get();
	const namespace = option.get('namespace') ? _maskSeparator(option.get('namespace')) : null;
	const namespaceArray = namespace ? namespace.split(',') : [];

	let validateArray = [];

	/* process class */

	elementValue.classArray.forEach(classValue =>
	{
		const fragmentArray = _getFragmentArray(classValue);

		/* validate character */

		validateArray.character = classValue.match(/[\w-_]/g);

		/* validate namespace */

		validateArray.namespace = namespaceArray.length ? namespaceArray.includes(fragmentArray.namespace) : true;

		/* validate variation */

		validateArray.variation = !Object.keys(rulesetArray.functional).some(value => fragmentArray.variationArray.includes(value));
		validateArray.variation &= !Object.keys(rulesetArray.exception).some(value => fragmentArray.variationArray.includes(value));
		if (rulesetArray.structural[fragmentArray.root])
		{
			validateArray.variation &= !Object.keys(rulesetArray.structural).some(value => fragmentArray.variationArray.includes(value));
		}
		if (!rulesetArray.exception[fragmentArray.root])
		{
			validateArray.variation &= !Object.keys(rulesetArray.component).some(value => fragmentArray.variationArray.includes(value));
			if (!rulesetArray.functional[fragmentArray.root])
			{
				validateArray.variation &= !Object.keys(rulesetArray.type).some(value => fragmentArray.variationArray.includes(value));
			}
		}

		/* process ruleset */

		Object.keys(rulesetArray).forEach(rulesetValue =>
		{
			Object.keys(rulesetArray[rulesetValue]).forEach(childrenValue =>
			{
				/* validate class and tag */

				if (fragmentArray.root === childrenValue)
				{
					validateArray.class = true;
					validateArray.tag = true;
					if (rulesetArray[rulesetValue][childrenValue] !== '*')
					{
						validateArray.tag = rulesetArray[rulesetValue][childrenValue].includes(elementValue.tagName);
					}
				}
			});
		});
	});
	return validateArray;
}

/**
 * get the fragment array
 *
 * @since 4.0.0
 *
 * @param {string} classValue
 *
 * @return {object}
 */

function _getFragmentArray(classValue)
{
	const separator = option.get('separator');
	const namespace = option.get('namespace');
	const namespaceArray = namespace ? namespace.split(',') : [];

	/* process namespace */

	namespaceArray.forEach(namespaceValue =>
	{
		classValue = classValue.replace(namespaceValue, _maskSeparator(namespaceValue));
	});

	/* split into fragment */

	const splitArray = classValue.split(separator);
	const fragmentObject =
	{
		namespace: namespace ? splitArray[0] : null,
		root: namespace ? splitArray[1] : splitArray[0],
		variationArray: splitArray.slice(namespace ? 2 : 1)
	};

	return fragmentObject;
}

/**
 * mask the separator
 *
 * @since 4.0.0
 *
 * @param {string} value
 *
 * @return {string}
 */

function _maskSeparator(value)
{
	const separator = option.get('separator');
	const pattern = new RegExp(separator, 'g');

	return value.replace(pattern, '@@@');
}

/**
 * construct
 *
 * @since 4.0.0
 *
 * @param {object} injectorObject
 *
 * @return {object}
 */

function construct(injectorObject)
{
	const exports =
	{
		getValidateArray
	};

	/* handle injector */

	if (injectorObject.ruleset && injectorObject.option)
	{
		ruleset = injectorObject.ruleset;
		option = injectorObject.option;
	}
	return exports;
}

module.exports = construct;
