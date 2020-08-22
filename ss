#!/bin/bash
./rs

docker network create -d overlay aseeker
echo "made net"

docker stack deploy -c Docker-compose.yml aseeker
