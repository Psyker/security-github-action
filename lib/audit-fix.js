const packageContent = require('../package');
const fs = require('fs');
const exec = require('@actions/exec');


module.exports = async (advisories) => {
    let {resolutions} = packageContent;
    let updatedPackageCount = 0;

    Object.entries(advisories).map(advisory => {
        // let advisoryId = advisory[0];
        const {module_name, patched_versions} = advisory[1];
        if (typeof resolutions !== undefined && resolutions[module_name]) {
            if (resolutions[module_name] === patched_versions) {
                console.log(`The package '${module_name}' is already up to date`);
            } else {
                console.log(`Replacing vulnerable version of '${module_name}' by the new one`);
                resolutions[module_name] = patched_versions;
                updatedPackageCount++
            }
        } else {
            resolutions = {...resolutions, ...{[module_name]: patched_versions}};
        }

    });

    if (updatedPackageCount > 0) {
        fs.writeFile('./package.json', JSON.stringify(packageContent, null, 4), err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        });
    }

    const args = ['audit', 'fix', '--force', '--json'];
    const result = await exec.exec(
        'npm',
        args,
        {ignoreReturnCode: true}
    );

    if (result.exitCode && result.exitCode !== 0) {
        console.log('AHAHAHAH');
        const error = result.stderr;
        throw new Error(error)
    }

    return result
};