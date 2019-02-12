#!/usr/bin/env bash
## minikube should be running before this
## with
# minikube start --insecure-registry localhost:5000

## put docker in the mood to talk to minikube
eval $(minikube docker-env)

## start registry in minikube
docker run -d -p 5000:5000 --restart=always --name registry   -v /data/docker-registry:/var/lib/registry registry:2

## build all images
docker-compose build

docker push localhost:5000/typescript-nginx
docker push localhost:5000/python-nginx
docker push localhost:5000/python-uwsgi

## load environment vars for psotgres into a configMap for later use in pods
kubectl apply -f configMaps/postgres-postgres-database-conf.yaml

## start python-uwsgi in k8s
kubectl create -f python-uwsgi/python-uwsgi_deployment.yml
## expose pods as service to k8s
kubectl create -f python-uwsgi/python-uwsgi_service.yml