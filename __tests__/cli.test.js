const { exec } = require('child_process');
const { version } = require('../package.json');

const emptyEnvs = {
    OSS_AK: '',
    OSS_SK: '',
    OSS_BUCKET: '',
    OSS_ENDPOINT: '',
    OSS_REGION: '',
}

describe('cli params check', () => {
    test(`show version ${version}`, (done) => {
        exec('node cli.js --version', (error, stdout, stderr) => {
            expect(stdout.replace('\n', '')).toBe(version);
            done();
        })
    })
    test('show ak is missing', (done) => {
        exec('node cli.js put a b', { env: emptyEnvs }, (error, stdout, stderr) => {
            expect(stderr).toBe('AK is missing\n');
            done();
        });
    })
    test('show sk is missing', (done) => {
        exec('node cli.js put a b -k a', { env: emptyEnvs }, (error, stdout, stderr) => {
            expect(stderr).toBe('SK is missing\n');
            done();
        });
    })
    test('show bucket is missing', (done) => {
        exec('node cli.js put a b -k a -s b', { env: emptyEnvs }, (error, stdout, stderr) => {
            expect(stderr).toBe('Bucket is missing\n');
            done();
        });
    })
    test('show region or endpoint is missing', (done) => {
        exec('node cli.js put a b -k a -s b -b c', { env: emptyEnvs }, (error, stdout, stderr) => {
            expect(stderr).toBe('Region or endpoint is missing\n');
            done();
        });
    })
})