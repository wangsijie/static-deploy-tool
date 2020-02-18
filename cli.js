#!/usr/bin/env node
const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const md5FileCb = require('md5-file');

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
    const hashes = await getHashes(local);
    for (const file of list) {
        const hash = await md5File(file);
        const remotePath = file.replace(local, remote);
        const remoteFile = hashes.find(o => o.name === remotePath);
        if (remoteFile && remoteFile.hash === hash.toUpperCase()) {
            console.log('skip: ' + file);
            continue;
        }
        console.log('uploading: ' + file);
        await client.put(remotePath, file);
    }
}

async function getHashes(prefix) {
    let hashes = [];
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

const app = async (sk, local, remote) => {
    client = new OSS({
        region: 'oss-cn-shanghai',
        accessKeyId: 'LTAI4FnTFbxjSADTg1YK4xYg',
        accessKeySecret: sk,
        bucket: 'wangsijie-static',
    });
    walk(local);
    upload(local, remote);
}

const sk = process.argv[2];
const local = process.argv[3];
const remote = process.argv[4];
if (!sk) {
    throw new Error('sk needed');
}
if (!local) {
    throw new Error('local needed');
}
if (!remote) {
    throw new Error('remote needed');
}
app(sk, local, remote);
