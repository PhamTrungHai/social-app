#pull node image
FROM node:18-alpine AS build

#set working directory
WORKDIR /app
#copy package.json and package-lock.json
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
#copy all files
COPY . .
#build babel
RUN npm run build
# RUN mv /app/dist /usr/share/nginx/html

FROM nginx:1.24.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
