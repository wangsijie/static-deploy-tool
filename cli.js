#!/usr/bin/env node
const program = require('commander');
const sync = require('./sync');
const put = require('./put');
const copy = require('./copy');

program
    .version('0.4.2')
    .option('-k, --ak [ak]', 'Access Key Id')
    .option('-s, --sk [sk]', 'Secret Access Key')
    .option('-r, --region [region]', 'Region', 'oss-cn-shanghai')
    .option('-b, --bucket [bucket]', 'Bucket')
    .option('-e, --endpoint [endpoint]', 'Optional, will override region setting')

program
    .command('sync <local> <remote>')
    .action(async (local, remote) => {
        try {
            await sync({
                local,
                remote,
                aliyun: checkParams(),
            })
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    })

program
    .command('put <local> <remote>')
    .action(async (local, remote) => {
        try {
            await put({
                local,
                remote,
                aliyun: checkParams(),
            })
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })

program
    .command('copy <source> <dest>')
    .action(async (source, dest) => {
        try {
            await copy({
                source,
                dest,
                aliyun: checkParams(),
            })
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })

program.parse(process.argv);

function checkParams() {
    const { ak, sk, region, bucket, endpoint } = program;
    if (!ak) {
        console.error('AK is missing');
        process.exit(1)
    }
    if (!sk) {
        console.error('SK is missing');
        process.exit(1)
    }
    if (!bucket) {
        console.error('Bucket is missing');
        process.exit(1)
    }
    return { ak, sk, region, bucket, endpoint };
}
