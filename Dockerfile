FROM node:alpine
RUN npm i -g static-deploy-tool
ENTRYPOINT [ "static-deploy-tool" ]
