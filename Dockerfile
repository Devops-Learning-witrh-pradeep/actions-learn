## Artifact-only Dockerfile
## This Dockerfile expects the build pipeline to create a folder named `docker-artifact/` that contains
## the server files (server.js), `dist/`, and production `node_modules`.
## The Docker build should run with `docker-artifact` available in the build context (CI downloads artifact into workspace).

FROM node:18-alpine
WORKDIR /usr/src/app

# Copy produced artifact into the image (pre-built in CI). When the build uses `docker-artifact` context,
# this will copy all files from the artifact into the image root
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
