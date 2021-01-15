let option;

/**
 * get the validate array
 *
 * @since 6.1.0
 *
 * @param {object} elementValue
 *
 * @return {Array}
 */

function getValidateArray(elementValue)
{
	const ruleObject = option.get('rules');
	const namespace = option.get('namespace') ? _maskSeparator(option.get('namespace')) : null;
	const namespaceArray = namespace ? namespace.split(',').filter(value => value) : [];

	let validateObject = {};

	/* process attr */

	validateObject.attribute = !elementValue.attrArray.includes('style');
	if (elementValue.attrArray.includes('class'))
	{
		validateObject.attribute = elementValue.classArray.length;
	}
	else
	{
		validateObject.namespace = true;
		validateObject.class = true;
		validateObject.variation = 1;
		validateObject.tag = true;
	}

	/* process class */

	elementValue.classArray.forEach(classValue =>
	{
		const fragmentArray = _getFragmentArray(classValue);

		/* validate namespace */

		validateObject.namespace = !namespaceArray.length || namespaceArray.includes(fragmentArray.namespace);

		/* validate variation */

		validateObject.variation = !Object.keys(ruleObject.functional).some(value => fragmentArray.variationArray.includes(value));
		validateObject.variation &= !Object.keys(ruleObject.exception).some(value => fragmentArray.variationArray.includes(value));
		if (ruleObject.structural[fragmentArray.root])
		{
			validateObject.variation &= !Object.keys(ruleObject.structural).some(value => fragmentArray.variationArray.includes(value));
		}
		if (!ruleObject.exception[fragmentArray.root])
		{
			validateObject.variation &= !Object.keys(ruleObject.component).some(value => fragmentArray.variationArray.includes(value));
			if (!ruleObject.functional[fragmentArray.root])
			{
				validateObject.variation &= !Object.keys(ruleObject.type).some(value => fragmentArray.variationArray.includes(value));
			}
		}

		/* process ruleset */

		Object.keys(ruleObject).forEach(ruleValue =>
		{
			Object.keys(ruleObject[ruleValue]).forEach(childrenValue =>
			{
				/* validate class and tag */

				if (fragmentArray.root === childrenValue)
				{
					validateObject.class = true;
					validateObject.tag = true;
					if (ruleObject[ruleValue][childrenValue] !== '*')
					{
						validateObject.tag = ruleObject[ruleValue][childrenValue].includes(elementValue.tagName);
					}
				}
			});
		});
	});
	return validateObject;
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
	const namespaceArray = namespace ? namespace.split(',').filter(value => value) : [];

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

	if (injectorObject.option)
	{
		option = injectorObject.option;
	}
	return exports;
}

module.exports = construct;
