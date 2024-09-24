FROM node:20.14-slim

RUN mkdir -p /app /docker-entrypoint-initdb.d
RUN chown node /app /docker-entrypoint-initdb.d

WORKDIR /app

USER node

COPY --chown=node:node . .
RUN mv ./migrations/init.sql /docker-entrypoint-initdb.d
RUN npm install
RUN npm run build
RUN rm -rf src

CMD ["npm", "run", "start"]