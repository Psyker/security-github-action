const createBody = require('./create-body');
const github = require('@actions/github');
const core = require('@actions/core');
const exec = require('@actions/exec');

const token = core.getInput('AUTH_TOKEN');
const octokit = new github.GitHub(token);

function createList (vulnerabilities) {
    return Object.keys(vulnerabilities).map(key => `* ${key}: ${vulnerabilities[key]}`).join('\n')
}

module.exports = async ({vulnerabilities, numVulnerabilities }) => {
    await exec.exec('git', ['add', '.']);
    await exec.exec('git', ['checkout', '-b', 'security-js-fix']);
    await exec.exec('git', ['commit', '-m', `Fix ${numVulnerabilities} npm vulnerabilities\n${createList(vulnerabilities)}`]);
    const {data} = await octokit.pulls.create({
        owner: 'Psyker',
        repo: 'security-github-action',
        base: 'master',
        head: 'security-js-fix',
        title: `Automatic audit of npm vulnerabilities (${numVulnerabilities} fixed)`,
        body: createBody(vulnerabilities, numVulnerabilities),
    })

    console.log(data)

    // const newBranch = `audit-fixer-${tools.context.sha.slice(0, 7)}`
    //
    // try {
    //     await tools.github.git.createRef(tools.context.repo({
    //         ref: 'refs/heads/' + newBranch,
    //         sha: tools.context.sha
    //     }))
    // } catch (err) {
    //     // Throw unless the ref already exists
    //     if (err.code !== 422) throw err
    // }
    //
    // const tree = await tools.github.git.getTree(tools.context.repo({ tree_sha: tools.context.sha }))
    // const newPackageLockContents = tools.getFile('package-lock.json', 'base64')
    //
    // await tools.github.repos.createOrUpdateFile(tools.context.repo({
    //     path: 'package-lock.json',
    //     sha: tree.data.tree.find(item => item.path === 'package-lock.json' && item.type === 'blob').sha,
    //     message: `Fix ${numVulnerabilities} npm vulnerabilities\n${createList(vulnerabilities)}`,
    //     content: newPackageLockContents,
    //     branch: newBranch
    // }))
    //
    // return tools.github.pullRequests.create(tools.context.repo({
    //     title: `Automatic audit of npm vulnerabilities (${numVulnerabilities} fixed)`,
    //     base: 'master',
    //     head: newBranch,
    //     body: createBody(vulnerabilities, numVulnerabilities)
    // }))
};