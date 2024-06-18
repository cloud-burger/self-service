FROM node:20.14-slim
WORKDIR /app

# COPY package.json ./
# RUN yarn install --ignore-scripts --prefer-offline && yarn cache clean
# COPY --chown=node . .
# COPY ./node_modules ./node_modules

EXPOSE 80
CMD ["node", "self-service.js"]