const exec = require('@actions/exec');

module.exports = async () => {
    let result = '';
    let error = '';

    const options = {
        ignoreReturnCode: true,
    };
    options.listeners = {
        stdout: (data) => {
            result += data.toString();
        },
        stderr: (data) => {
            error += data.toString();
        },
    };

    await exec.exec(
        'npm',
        ['audit', '--json'],
        options
    );

    try {
        // Try to parse the result as actual JSON
        const json = JSON.parse(result);
        const vulns = json.metadata.vulnerabilities;
        const advisories = json.advisories;

        // Get the total count of vulnerabilities
        const keys = Object.keys(vulns);
        const numVulnerabilities = keys.reduce((p, c) => { p += vulns[c]; return p }, 0);
        return { vulnerabilities: vulns, numVulnerabilities, advisories }
    } catch (err) {
        throw err
    }
};