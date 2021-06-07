const sync = require('../sync');

test('sync __tests__/files static-deploy-tool-test/sync', (done) => {
    sync({
        aliyun: {
            ak: process.env.OSS_AK,
            sk: process.env.OSS_SK,
            region: process.env.OSS_REGION,
            bucket: process.env.OSS_BUCKET,
            endpoint: process.env.OSS_ENDPOINT,
        },
        local: '__tests__/files',
        remote: 'static-deploy-tool-test/sync',
    }).then(result => {
        expect(result.localFiles[result.localFiles.length - 1]).toEqual('__tests__/files/index.html');
        done();
    })
})
