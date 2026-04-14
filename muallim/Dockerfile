# Build stage for API and Angular projects
FROM node:24-alpine AS build
WORKDIR /build

COPY api/package*.json api/
COPY admin-ui/package*.json admin-ui/
COPY web-ui/package*.json web-ui/

RUN cd api && npm ci
RUN cd admin-ui && npm ci
RUN cd web-ui && npm ci

COPY api api
COPY admin-ui admin-ui
COPY web-ui web-ui

RUN cd admin-ui && npm run build
RUN cd web-ui && npm run build
RUN cd api && npm run build

# Runtime stage
FROM node:24-alpine AS runtime
WORKDIR /app

COPY api/package*.json ./
RUN npm ci --omit=dev

COPY --from=build /build/api/dist ./dist
COPY --from=build /build/admin-ui/dist/admin-ui/browser ./public/admin-ui
COPY --from=build /build/web-ui/dist/web-ui/browser ./public/web-ui

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "dist/main.js"]
