FROM node:16-alpine as builder
WORKDIR /app
COPY /*.json ./
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 5000
CMD ["npm", "run", "start:prod"]
