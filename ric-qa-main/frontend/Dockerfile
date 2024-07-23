FROM node:20 as build
WORKDIR /opt/ric-qa/frontend

COPY package.json ./
COPY package-lock.json ./
COPY . .

ARG BACKEND_URL
ENV VITE_APP_BACKEND_URL=${BACKEND_URL}

RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=build /opt/ric-qa/frontend/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3000
#start the nginx web server
CMD ["nginx", "-g", "daemon off;"]

