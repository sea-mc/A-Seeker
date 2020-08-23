#!/bin/bash
docker stack rm aseeker
docker swarm leave -f

docker swarm init
