const OSS = require('ali-oss');

module.exports = (aliyun) => {
    const params = {
        region: aliyun.region,
        accessKeyId: aliyun.ak,
        accessKeySecret: aliyun.sk,
        bucket: aliyun.bucket,
    };
    if (aliyun.endpoint) {
        params.endpoint = aliyun.endpoint;
    }
    return new OSS(params);
};
