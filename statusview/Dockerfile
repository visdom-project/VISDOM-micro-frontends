# Build the application
FROM node:14 as build-stage
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
COPY package*.json /app/
RUN npm clean-install
COPY ./ /app/
RUN npm run build

# Create a production environment
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# Setup Nginx and serve the production application
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
