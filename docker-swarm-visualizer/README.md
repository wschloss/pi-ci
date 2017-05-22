*credit for this visualizer goes to* [docker-swarm-visualizer](https://github.com/dockersamples/docker-swarm-visualizer)

![Sample image of  nodes with data](./nodes.png)

# Docker Swarm Visualizer
*** note ***
_This only works with Docker Swarm Mode in Docker Engine 1.12.0 and later. It does not work with the separate Docker Swarm project_

This project was originally created by [Francisco Miranda](https://github.com/maroshii) for the 2015 DockerCon EU keynote. It was adapted to be used for the 2016 DockerCon US keynote showcasing [Docker swarm mode](https://docs.docker.com/engine/swarm/). Since then the community has generously contributed many updates. Thanks to all the contributors, and a special thanks to [@DovAmir](https://github.com/DovAmir) and [@alexellis](https://github.com/alexellis) for their big contributions.

Demo container that displays Docker services running on a Docker Swarm in a diagram.

This works only with [Docker swarm mode](https://docs.docker.com/engine/swarm/) which was introduced in Docker 1.12. These instructions presume you are running on the master node and you already have a Swarm running.

Each node in the swarm will show all tasks running on it. When a service goes down it'll be removed. When a node goes down it won't, instead the circle at the top will turn red to indicate it went down. Tasks will be removed.
Occasionally the Remote API will return incomplete data, for instance the node can be missing a name. The next time info for that node is pulled, the name will update.

To run:

```
$ docker run -it -d -p 8080:8080 -v /var/run/docker.sock:/var/run/docker.sock dockersamples/visualizer
```

If port 8080 is already in use on your host, you can specify e.g. `-p [YOURPORT]:8080` instead. Example:

```
$ docker run -it -d -p 5000:8080 -v /var/run/docker.sock:/var/run/docker.sock dockersamples/visualizer
```

To run in a docker swarm:

```
$ docker service create \
  --name=viz \
  --publish=8080:8080/tcp \
  --constraint=node.role==manager \
  --mount=type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock \
  dockersamples/visualizer
```

## Running on ARM

[@alexellisuk](https://twitter.com/alexellisuk) has pushed an image to the Docker Hub as `alexellis2/visualizer-arm:latest` it will run the code on an ARMv6 or ARMv7 device such as the Raspberry Pi.

If you would like to build the image from source run the following command:

```
$ docker build -f Dockerfile.arm -t visualizer-arm:latest .
```

## Running on Windows

[@StefanScherer](https://github.com/StefanScherer) has pushed an image to the
Docker Hub as `stefanscherer/visualizer-windows:latest` it will run the code
in a Windows nanoserver container.

If you would like to build the image from source run the following command:

```
$ docker build -f Dockerfile.windows -t visualizer-windows:latest .
```

On Windows you cannot use `-v` to bind mount the named pipe into the container.
Your Docker engine has to listen to a TCP port, eg. 2375 and you have to
set the `DOCKER_HOST` environment variable running the container.

```
$ip=(Get-NetIPAddress -AddressFamily IPv4 `
   | Where-Object -FilterScript { $_.InterfaceAlias -Eq "vEthernet (HNS Internal NIC)" } `
   ).IPAddress

docker run -d -p 8080:8080 -e DOCKER_HOST=${ip}:2375 --name=visualizer stefanscherer/visualizer-windows
```

### Connect to a TLS secured Docker engine

To work with a TLS secured Docker engine on Windows, set the environment variable `DOCKER_TLS_VERIFY` and
bind mount the TLS certificates into the container.
 
```
$ip=(Get-NetIPAddress -AddressFamily IPv4 `
   | Where-Object -FilterScript { $_.InterfaceAlias -Eq "vEthernet (HNS Internal NIC)" } `
   ).IPAddress

docker run -d -p 8080:8080 -e DOCKER_HOST=${ip}:2376 -e DOCKER_TLS_VERIFY=1 -v "$env:USERPROFILE\.docker:C:\Users\ContainerAdministrator\.docker" --name=visualizer stefanscherer/visualizer-windows
```

TODO:
* Take out or fix how dist works
* Comment much more extensively
* Create tests and make them work better
* Make CSS more elastic. Currently optimized for 3 nodes on a big screen
