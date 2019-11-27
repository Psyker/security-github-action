const { Toolkit } = require('actions-toolkit');
const runAudit = require('./lib/audit');
const runAuditFix = require('./lib/audit-fix');
const createPR = require('./lib/create-pr');

const tools = new Toolkit();

runAudit(tools)
    .then(async ({ vulnerabilities, numVulnerabilities, advisories }) => {
        if (numVulnerabilities === 0) {
            console.log('No vulnerabilities found!');
            return
        }

        const fixResult = await runAuditFix(tools, advisories);
        console.log(fixResult);

        return createPR({
            vulnerabilities,
            numVulnerabilities,
            tools
        })
    })
    .catch(err => {
        console.error(err);
        process.exit(1)
    });