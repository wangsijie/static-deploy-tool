const fs = require('fs');
const path = require('path');
const md5FileCb = require('md5-file');
const getClient = require('./oss');
const resolveObject = require('./resolve-object');

let client;

const md5File = dir => new Promise((resolve, reject) => {
    md5FileCb(dir, (err, hash) => {
        if (err) {
            return reject(err);
        }
        resolve(hash);
    })
});

const list = [];
function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fileDir = path.join(dir, file);
        const stats = fs.statSync(fileDir);
        if (stats.isDirectory()) {
            walk(fileDir);
        } else {
            list.push(fileDir);
        }
    })
}

async function upload(local, remote) {
    for (const file of list) {
        const hash = await md5File(file);
        const remotePath = resolveObject(file.replace(local, remote));
        const remoteFile = hashes.find(o => o.name === remotePath);
        if (remoteFile && remoteFile.hash === hash.toUpperCase()) {
            console.log('skip: ' + file);
            continue;
        }
        console.log('uploading: ' + file);
        const job = async (retry) => {
            try {
                await client.put(remotePath, file);
            } catch (e) {
                if (retry) {
                    console.log('retrying: ' + file);
                    await job(retry - 1);
                } else {
                    console.log('error: ' + file);
                }
            }
        }
        await job(5);
    }
}

async function clean(local, remote) {
    const reg = new RegExp(`^${local}`);
    const localList = list.map(url => url.replace(reg, remote));
    for (const file of hashes) {
        if (!localList.includes(file.name)) {
            console.log('deleting: ' + file.name);
            await client.delete(file.name);
        }
    }
}

let hashes = [];
async function getHashes(prefix) {
    let marker;
    do {
        const result = await client.list({
            prefix: prefix + '/',
            marker,
        });
        if (!result.objects) {
            return [];
        }
        marker = result.nextMarker;
        hashes = [...hashes, ...result.objects.map(o => ({
            name: o.name,
            hash: o.etag.replace(/"/g, ''),
        }))];
    } while (marker);
    return hashes;
}

const app = async ({ aliyun, local, remote }) => {
    client = getClient(aliyun);
    walk(local);
    await getHashes(remote);
    await upload(local, remote);
    await clean(local, remote);
}

module.exports = app;
