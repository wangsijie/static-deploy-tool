const getClient = require('./oss');

module.exports = async ({ aliyun, source, dest }) => {
    console.log('copying ' + dest + ' from ' + source);
    const client = getClient(aliyun);
    await client.copy(dest, source);
}
