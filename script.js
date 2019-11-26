const Octokit = require("@octokit/rest");

const octokit = new Octokit({
    'auth': 'secret',
    'userAgent': 'security-js script'
});