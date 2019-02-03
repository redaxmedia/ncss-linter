let ruleset;
let option;

/**
 * get the validate array
 *
 * @since 4.0.9
 *
 * @param elementFragment array
 *
 * @return array
 */

function getValidateArray(elementFragment)
{
	const rulesetArray = ruleset.get();
	const separator = option.get('separator');
	const separatorRegex = new RegExp(separator, 'g');
	const namespace = option.get('namespace') ? option.get('namespace').replace(separatorRegex, '@@@') : null;
	const namespaceArray = namespace ? namespace.split(',') : [];

	let validateArray = [];

	/* process class */

	elementFragment.classArray.forEach(classValue =>
	{
		const splitArray = _getSplitArray(classValue);
		const fragmentArray =
		{
			namespace: namespace ? splitArray[0] : null,
			root: namespace ? splitArray[1] : splitArray[0],
			variation: namespace ? splitArray[2] : splitArray[1]
		};

		/* validate character */

		validateArray.character = classValue.match(/[\w-_]/g);

		/* validate namespace */

		validateArray.namespace = true;
		if (namespaceArray.length)
		{
			validateArray.namespace = namespaceArray.indexOf(fragmentArray.namespace) > -1;
		}

		/* validate variation */

		validateArray.variation = Object.keys(rulesetArray.functional).indexOf(fragmentArray.variation) === -1 && Object.keys(rulesetArray.exception).indexOf(fragmentArray.variation) === -1;
		if (rulesetArray.structural[fragmentArray.root])
		{
			validateArray.variation &= Object.keys(rulesetArray.structural).indexOf(fragmentArray.variation) === -1;
		}
		if (!rulesetArray.exception[fragmentArray.root])
		{
			validateArray.variation &= Object.keys(rulesetArray.component).indexOf(fragmentArray.variation) === -1;
			if (!rulesetArray.functional[fragmentArray.root])
			{
				validateArray.variation &= Object.keys(rulesetArray.type).indexOf(fragmentArray.variation) === -1;
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
						validateArray.tag = rulesetArray[rulesetValue][childrenValue].indexOf(elementFragment.tagName) > -1;
					}
				}
			});
		});
	});
	return validateArray;
}

/**
 * get the split array
 *
 * @since 4.0.0
 *
 * @param classValue string
 *
 * @return array
 */

function _getSplitArray(classValue)
{
	const separator = option.get('separator');
	const namespace = option.get('namespace');
	const namespaceArray = namespace ? namespace.split(',') : [];

	/* process namespace */

	namespaceArray.forEach(namespaceValue =>
	{
		classValue = classValue.replace(namespaceValue, namespaceValue.replace(separator, '@@@'));
	});
	return classValue.split(separator);
}

/**
 * construct
 *
 * @since 4.0.0
 *
 * @param injector object
 *
 * @return object
 */

function construct(injector)
{
	const exports =
	{
		getValidateArray
	};

	/* handle injector */

	if (injector.ruleset && injector.option)
	{
		ruleset = injector.ruleset;
		option = injector.option;
	}
	return exports;
}

module.exports = construct;