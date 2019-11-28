const runAudit = require('./lib/audit');
const runAuditFix = require('./lib/audit-fix');
const createPR = require('./lib/create-pr');

runAudit()
    .then(async ({ vulnerabilities, numVulnerabilities, advisories }) => {
        if (numVulnerabilities === 0) {
            console.log('No vulnerabilities found!');
            return
        }

        const fixResult = await runAuditFix(advisories);
        console.log(fixResult);

        return createPR({
            vulnerabilities,
            numVulnerabilities,
        })
    })
    .catch(err => {
        console.error(err);
        process.exit(1)
    });