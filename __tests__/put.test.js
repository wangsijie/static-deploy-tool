const put = require('../put');

test('file does not exists', async () => {
    await expect(put({
        aliyun: {
            ak: process.env.OSS_AK,
            sk: process.env.OSS_SK,
            region: process.env.OSS_REGION,
            bucket: process.env.OSS_BUCKET,
            endpoint: process.env.OSS_ENDPOINT,
        },
        local: '__tests__/files/does-not-exists.txt',
        remote: 'static-deploy-tool-test/a.txt',
    })).rejects.toThrow(`local file doesn't exists: __tests__/files/does-not-exists.txt`)
})

test('put __tests__/files/a.txt static-deploy-tool-test/a.txt', (done) => {
    put({
        aliyun: {
            ak: process.env.OSS_AK,
            sk: process.env.OSS_SK,
            region: process.env.OSS_REGION,
            bucket: process.env.OSS_BUCKET,
            endpoint: process.env.OSS_ENDPOINT,
        },
        local: '__tests__/files/a.txt',
        remote: 'static-deploy-tool-test/a.txt',
    }).then(result => {
        expect(result.name).toBe('static-deploy-tool-test/a.txt');
        done();
    })
})
