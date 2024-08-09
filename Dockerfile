FROM node:20.14-slim

RUN mkdir -p /app \ 
    chown node /app

WORKDIR /app

USER node

COPY --chown=node:node . .

RUN npm install \
    npm run build \
    rm -rf src

CMD ["npm", "run", "start"]