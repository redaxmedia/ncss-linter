const glob = require('glob');
const fs = require('fs');

/**
 * walk the path
 *
 * @since 1.3.0
 *
 * @param path string
 *
 * @return Promise
 */

function walkPath(path)
{
	let content;
	let counter = 0;

	return new Promise((resolve, reject) =>
	{
		glob(path, (error, pathArray) =>
		{
			if (pathArray.length)
			{
				pathArray.forEach(fileValue =>
				{
					fs.readFile(fileValue, 'utf-8', (fileError, fileContent) =>
					{
						content += fileContent;
						if (++counter === pathArray.length)
						{
							resolve(content);
						}
					});
				});
			}
			else
			{
				reject();
			}
		});
	});
}

module.exports =
{
	walkPath
};