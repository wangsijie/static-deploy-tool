const fs = require('fs');
const path = require('path');
const getClient = require('./oss');

module.exports = async ({ aliyun, local, remote }) => {
    const client = getClient(aliyun);
    if (!fs.existsSync(local)) {
        throw new Error('local file doesn\'t exists: ' + local);
    }
    async function asyncProgress(p) {
        const progress = Math.floor(p * 100);
        console.log(`Uploading: ${local} (${progress}%)`);
    }
    await client.multipartUpload(remote, local, {
      progress: asyncProgress
    });
}
