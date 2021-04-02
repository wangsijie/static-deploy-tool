const fs = require('fs');
const getClient = require('./oss');
const resolveObject = require('./resolve-object');

module.exports = async ({ aliyun, local, remote }) => {
    const client = getClient(aliyun);
    if (!fs.existsSync(local)) {
        throw new Error('local file doesn\'t exists: ' + local);
    }
    let checkpoint;
    let tryTime = 10;
    async function asyncProgress(p, cpt) {
        checkpoint = cpt;
        const progress = Math.floor(p * 100);
        console.log(`Uploading: ${local} (${progress}%)`);
    }
    const upload = async () => {
        try {
            return await client.multipartUpload(resolveObject(remote), local, {
                checkpoint,
                progress: asyncProgress
            });
        } catch (e) {
            tryTime--;
            if (tryTime && !process.env.DISABLE_RETRY) {
                console.log(`Retrying: ${local}`);
                await new Promise(r => setTimeout(r, 1000))
                await upload();
            } else {
                throw e;
            }
        }
    }
    return await upload();
}
