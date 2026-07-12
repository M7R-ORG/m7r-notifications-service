#!/bin/bash

set -e

if [ -z "$1" ]; then
  imageName="samarkinivan/notifications-service"
else
  imageName="$1"
fi

cd ../

npm run format
npm run lint
npm run build

# build image from Dockerfile
docker buildx build -t $imageName .

# push to DockerHub
docker push $imageName

# cache clear
docker buildx prune -af
