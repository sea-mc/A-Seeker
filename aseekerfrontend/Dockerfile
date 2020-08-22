# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install react-hook-form@5.7.2 -g --silent
RUN npm install hls
RUN npm install react-native-elements@^2.0.4 --silent
RUN npm install react-native-paper@^3.10.1 --silent
RUN npm install react-search-bar@^2.2.0 --silent
RUN npm ci --silent
RUN npm install plyr


COPY . ./
RUN npm run build
# production environment
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# new
COPY --from=build /nginx/ /etc/nginx/

COPY --from=build /nginx/ /

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
