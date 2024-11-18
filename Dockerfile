FROM node:20
WORKDIR /app
COPY .output ./
CMD ["node", "server/index.mjs"]