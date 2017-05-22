FROM joherma1/rpi-jenkins:latest

# Upgrade os from wheezy -> jessie
# Trust the internal registry
RUN apt-get update -y \
	&& sed -i 's/wheezy/jessie/' /etc/apt/sources.list \
	&& apt-get update -y \
	&& apt-get upgrade -y \
	&& apt-get dist-upgrade -y \
	&& apt-get install -y \
	     apt-transport-https \
	     ca-certificates \
	     curl \
	     python-software-properties \
	&& echo 'deb [arch=armhf] https://apt.dockerproject.org/repo raspbian-jessie main' > /etc/apt/sources.list.d/docker.list \
	&& curl -fsSL https://apt.dockerproject.org/gpg | apt-key add - \
	&& apt-get update -y \
	&& apt-get install -y docker-engine \
	&& mkdir -p /etc/docker \
	&& echo '{ "insecure-registries":["registry:5000"] }' > /etc/docker/daemon.json
