#pull node image
FROM node:18-alpine
#set working directory
WORKDIR /app
#copy package.json and package-lock.json
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
RUN npm install -g @babel/cli @babel/core
#copy all files
COPY . .
#generate prisma client
RUN npx prisma generate
#build babel
RUN npm run build-babel
#expose port
EXPOSE 5000
CMD ["npm", "run", "production"]