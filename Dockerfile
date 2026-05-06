FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Comando para Vite en lugar de npm start
CMD ["npm", "run", "dev", "--", "--host"]