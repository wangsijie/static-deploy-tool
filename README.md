# static-deploy-tool

静态文件部署工具，一条命令自动部署文件夹或大文件到阿里云OSS

## 安装

全局安装

```
npm i -g static-deploy-tool
```

也可以直接使用npx，无需安装

## 常用命令

### 同步文件夹到远程

```bash
sync <local> <remote>
```

同步本地build文件夹到远程Bucket: my-bucket下的production/home文件夹

```bash
static-deploy-tool sync build production/home -k LTAI4Fnxxxxx -s 1wWQo9JQpSxxxx -b my-bucket
```

该命令会首先逐个上传本地文件到远程目录，并根据md5比对跳过已有文件。之后**删除**远程存在但本地没有的文件。

### 上传大文件到远程

```bash
put <local> <remote>
```

使用分片上传的方式，将本地build/code.tar.gz文件上传到远程

```bash
static-deploy-tool put build/code.tar.gz production/code.tar.gz -k LTAI4Fnxxxxx -s 1wWQo9JQpSxxxx -b my-bucket
```

将会展示上传进度百分比，并且对于错误的分片自动重试

### 复制远程文件

```bash
copy <source> <dest>
```

复制远程文件`platform/sandbox/latest.tar.gz`到`platform/production/latest.tar.gz`

```bash
static-deploy-tool copy platform/sandbox/latest.tar.gz platform/production/latest.tar.gz -k LTAI4Fnxxxxx -s 1wWQo9JQpSxxxx -b my-bucket
```

## 配置

```bash
$ node cli --help
Options:
  -V, --version              output the version number
  -k, --ak [ak]              Access Key Id
  -s, --sk [sk]              Secret Access Key
  -r, --region [region]      Region
  -b, --bucket [bucket]      Bucket
  -e, --endpoint [endpoint]  Optional, will override region setting
  -h, --help                 output usage information
```

### 环境变量

除了用参数，也可以用环境变量

```
OSS_AK 等同于 --ak
OSS_SK 等同于 --sk
OSS_REGION 等同于 --region
OSS_BUCKET 等同于 --bucket
OSS_ENDPOINT 等同于 --endpoint
```

### 阿里云内网加速

指定endpoint参数为内网地址

```bash
static-deploy-tool sync build production/home -k LTAI4Fnxxxxx -s 1wWQo9JQpSxxxx -b my-bucket -e oss-cn-shanghai-internal.aliyuncs.com
```

### 全球加速

用于GitHub Actions等国外服务传文件回国内有奇效，指定endpoint为oss-accelerate.aliyuncs.com

**需要开通这个Bucket的全球加速功能**

```bash
static-deploy-tool sync build production/home -k LTAI4Fnxxxxx -s 1wWQo9JQpSxxxx -b my-bucket -e oss-accelerate.aliyuncs.com
```
