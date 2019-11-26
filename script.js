const Octokit = require("@octokit/rest");
const fs = require('fs');

const octokit = new Octokit({
    'auth': 'secret',
    'userAgent': 'security-js script'
});
fs.readFile('./test.json', (err, data) => {
    if (err) {
        console.log(err)
    }
    console.log(data)
});

fs.unlink('./test.json', (err) => {
    if (err) throw err;
    console.log('test.json was deleted');
});