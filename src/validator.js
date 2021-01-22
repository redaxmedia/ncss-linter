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

	const validateObject =
	{
		invalidAttribute:
		{
			status: false,
			contextArray: []
		},
		invalidNamespace:
		{
			status: false,
			contextArray: []
		},
		invalidClass:
		{
			status: false,
			contextArray: []
		},
		invalidVariation:
		{
			status: false,
			contextArray: []
		},
		invalidTag:
		{
			status: false,
			contextArray: []
		}
	};

	/* process attr */

	if (elementValue.attrArray.includes('style'))
	{
		validateObject.invalidAttribute.status = true;
		validateObject.invalidAttribute.contextArray.push('inline-style');
	}
	if (elementValue.attrArray.includes('class') && !elementValue.classArray.length)
	{
		validateObject.invalidAttribute.status = true;
		validateObject.invalidAttribute.contextArray.push('empty-class');
	}

	/* process class */

	elementValue.classArray.map(classValue =>
	{
		const fragmentArray = _getFragmentArray(classValue);

		/* validate namespace */

		if (namespaceArray.length && !namespaceArray.includes(fragmentArray.namespace))
		{
			validateObject.invalidNamespace.status = true;
		}

		/* validate variation */

		if (Object.keys(ruleObject.functional).some(value => fragmentArray.variationArray.includes(value)))
		{
			validateObject.invalidVariation.status = true;
			validateObject.invalidVariation.contextArray.push('functional');
		}
		if (Object.keys(ruleObject.exception).some(value => fragmentArray.variationArray.includes(value)))
		{
			validateObject.invalidVariation.status = true;
			validateObject.invalidVariation.contextArray.push('exception');
		}
		if (ruleObject.structural[fragmentArray.root] && Object.keys(ruleObject.structural).some(value => fragmentArray.variationArray.includes(value)))
		{
			validateObject.invalidVariation.status = true;
			validateObject.invalidVariation.contextArray.push('structural');
		}
		if (!ruleObject.exception[fragmentArray.root])
		{
			if (Object.keys(ruleObject.component).some(value => fragmentArray.variationArray.includes(value)))
			{
				validateObject.invalidVariation.status = true;
				validateObject.invalidVariation.contextArray.push('component');
			}
			if (!ruleObject.functional[fragmentArray.root] && Object.keys(ruleObject.type).some(value => fragmentArray.variationArray.includes(value)))
			{
				validateObject.invalidVariation.status = true;
				validateObject.invalidVariation.contextArray.push('type');
			}
		}

		/* process rules */

		validateObject.invalidClass.status = true;
		Object.keys(ruleObject).map(ruleValue =>
		{
			Object.keys(ruleObject[ruleValue]).map(childrenValue =>
			{
				/* validate class and tag */

				if (fragmentArray.root === childrenValue)
				{
					validateObject.invalidClass.status = false;
					if (!ruleObject[ruleValue][childrenValue].includes('*') && !ruleObject[ruleValue][childrenValue].includes(elementValue.tagName))
					{
						validateObject.invalidTag.status = true;
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

	namespaceArray.map(namespaceValue =>
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
