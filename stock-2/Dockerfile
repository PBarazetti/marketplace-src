FROM node:18-alpine
 
WORKDIR /usr/src/app
 
COPY package*.json ./

COPY tsconfig.json ./


 
RUN npm install

COPY . .

COPY .env.prod /usr/src/app/.env

RUN npm run build
 
CMD ["node", "dist/main.js"]