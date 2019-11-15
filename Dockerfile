FROM node:12.2.0-alpine

WORKDIR /app
EXPOSE 3000

COPY package.json package.json
RUN npm install --silent

COPY . .

CMD ["npm", "start"]
