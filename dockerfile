FROM node:22-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port for web server
EXPOSE 8080
# Expose the port for API server
EXPOSE 2000

CMD [ "node", "app.js" ]