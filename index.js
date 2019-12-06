const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();

app.use(express.json()); // For parsing application/json

const { PORT, GITHUB_WEBHOOK_SECRET, ROUTE, EXEC_COMMAND } = process.env;

app.post(ROUTE, (req, res) => {
    const checksum = req.get('x-hub-signature');
    const eventType = req.get('x-github-event');
    const secret = GITHUB_WEBHOOK_SECRET;
    const { body } = req;
    if (eventType === 'push') {
        const { ref } = body;
        const branch = ref.split('/')[2];
        if (branch === 'master') {
            const isVerified = verifySignature(body, secret, checksum);
            deploy(isVerified);
        }
    } else if (eventType === 'pull_request') {
        const { action, base } = body;
        const { ref: branch } = base;
        if (action === 'closed' && branch === 'master') {
            const isVerified = verifySignature(body, secret, checksum);
            deploy(isVerified);
        }
    }
    res.status(200);
    res.send('success');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

function verifySignature(body, secret, checksum) {
    const bodyData = Buffer.from(JSON.stringify(body));
    const hmac = crypto.createHmac('sha1', secret);
    const digest = 'sha1=' + hmac.update(bodyData).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(checksum));
}

function deploy(isVerified) {
    if (isVerified) {
        exec(EXEC_COMMAND, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        })
    } else {
        console.log('Unauthorized request');
    }
}