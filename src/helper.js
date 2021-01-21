const glob = require('glob');
const fs = require('fs');

/**
 * walk the path
 *
 * @since 1.3.0
 *
 * @param {string} path
 *
 * @return {Promise}
 */

function walkPath(path)
{
	let walkArray = [];
	let counter = 0;

	return new Promise((resolve, reject) =>
	{
		glob(path, (error, pathArray) =>
		{
			if (pathArray.length)
			{
				pathArray.map(pathValue =>
				{
					fs.readFile(pathValue, 'utf-8', (fileError, fileContent) =>
					{
						walkArray.push(
						{
							path: pathValue,
							content: fileContent
						});
						if (++counter === pathArray.length)
						{
							resolve(walkArray);
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
