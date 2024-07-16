FROM node:20.14-slim

WORKDIR /app

ENV PORT=8080

COPY . .

RUN npm install
RUN npm run build
RUN rm -rf src

EXPOSE 8080

CMD ["npm", "run", "start"]