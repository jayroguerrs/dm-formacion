FROM node:20.10.0 AS runtime
WORKDIR /app

COPY package.json .
RUN rm -rf node_modules package-lock.json

RUN npm install
COPY . .
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs