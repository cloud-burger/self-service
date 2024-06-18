FROM node:lts
WORKDIR /app

# COPY package.json ./
# COPY yarn.lock ./
# COPY .yarnrc ./

# RUN yarn install --ignore-scripts --prefer-offline && yarn cache clean
# COPY --chown=node . .
# COPY ./node_modules ./node_modules

EXPOSE 80
CMD ["node", "self-service.js"]