#!/usr/bin/env node
const program = require('commander');
const app = require('./app');

program
    .version('0.2.0')
    .option('-k, --ak [ak]', 'Access Key Id')
    .option('-s, --sk [sk]', 'Secret Access Key')
    .option('-r, --region [region]', 'Region', 'oss-cn-shanghai')
    .option('-b, --bucket [bucket]', 'Bucket')
    .option('-e, --endpoint [endpoint]', 'Optional, will override region setting')

program
    .command('sync <local> <remote>')
    .action(async (local, remote) => {
        try {
            await app({
                local,
                remote,
                aliyun: checkParams(),
            })
        } catch (e) {
            console.error(e);
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
