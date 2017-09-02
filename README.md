# raspberry pi ci

## HOW TO
- Prepare each with raspbian lite, a text editor, and git
- After connecting each pi to the same network, make note of each machine's ip since it will be needed later
- Since images deployed internally in the swarm will be located in the registry container, each pi needs an /etc/hosts entry for the 'registry' hostname which resolves to the manager IP
  `{manager ip} registry`
- Install docker with apt-get on each pi
        `sudo apt-get install docker-engine`
- The registry internal to the swarm will need to be manually trusted. On each pi, update the file /etc/docker/daemon.json to have the following:
        `{ "insecure-registries":["registry:5000"] }`
  The docker daemon will need to be restarted after this update. On each pi, restart the daemon with:
        `sudo service docker restart`
- Pull git repo on the manager
        `git clone https://github.com/wschloss/pi-ci.git`
- Now, you can rebuild the images yourself and push to your dockerhub, or use them from my dockerhub

  (Optional) To build and push yourself, run the following with your dockerhub username in place of mine
        
        `docker login`

        Visualizer
        `docker build -t wcschlosser/visualizer-rpi:0.1.0 -f docker-swarm-visualizer/Dockerfile.arm ./docker-swarm-visualizer/ && docker push wcschlosser/visualizer-rpi:0.1.0`

        Gogs
        `docker build -t wcschlosser/gogs-rpi:0.1.0 -f gogs_image_build/Dockerfile.arm ./gogs_image_build/ && docker push wcschlosser/gogs-rpi:0.1.0`

        Registry
        `docker build -t wcschlosser/registry-rpi:0.1.0 -f registry_image_build/Dockerfile.arm ./registry_image_build/ && docker push wcschlosser/registry-rpi:0.1.0`

        Jenkins
        `docker build -t wcschlosser/jenkins-rpi:0.1.0 -f jenkins_image_build/Dockerfile.arm ./jenkins_image_build/ && docker push wcschlosser/jenkins-rpi:0.1.0`

        nginx
        `docker build -t wcschlosser/nginx-rpi:0.1.0 -f nginx_image_build/Dockerfile.arm ./nginx_image_build/ && docker push wcschlosser/nginx-rpi:0.1.0`

        Basic node service (this step is unnecessary since this image will reside in the swarm registry for the deployment demo)
        `docker build -t wcschlosser/basic-node-service:0.1.0 -f basic-node-service/Dockerfile.arm ./basic-node-service && docker push wcschlosser/basic-node-service:0.1.0`

- Initialize the swarm on the manager
        `docker swarm init`
- Execute the specified join token command on each worker pi. To recover the token, or get a token for joining as another manager run one of the following:
        `docker swarm join-token worker` OR `docker swarm join-token manager`
  Note that the volume mounts in this demo setup only account for a single manager node
- Next, create the multi host overlay network to deploy containers into by running the following on the manager:
        `docker network create --driver overlay pi-swarm`
- Create the directories on the manager for data that should persist if the swarm dies:
        `sudo mkdir -p /gogs-volume/database/ /gogs-volume/logs/ /gogs-volume/repositories/ /registry-volume/docker-store/ /jenkins-volume/jenkins_home/`
- Now we can deploy the platform image stack by executing the following on the manager:
        `docker stack deploy -c stack_files/platform.yaml platform`
  Note that Jenkins startup for the initial deployment will take a while on the pi due to war file extraction (expect upwards of 45 minutes)
- Register and setup a 'basic-node-service' repo on the exposed swarm gogs service by browsing to the manager ip on port 3000
- On the manager, copy the basic-node-service to a new location and initialize git
        `mkdir -p ~/gogs/basic-node-service/ && cp -r ~/pi-ci/basic-node-service/* ~/gogs/basic-node-service/ && cd ~/gogs/basic-node-service/ && git init && git add * && git commit -m "Initial commit"`
- Push this git repo to the gogs repo you created earlier now
- Once Jenkins is ready on manager:8000, install the 'Gogs', 'Pipeline: Multibranch with defaults', 'Pipeline: Stage Step', 'Pipeline: Basic Steps', and 'Pipeline: Nodes and Processes' plugins and restart Jenkins
- After Jenkins is back, create a new multibranch pipeline job for 'basic-node-service'. Add a git branch source pointing to the gogs service within the swarm (http://gogs:3000/wcschlosser/basic-node-service.git) and add your gogs creds
- The master branch Jenkinsfile will be found after the Jenkins multibranch pipeline scan finished. Kick off the build to build and deploy the app image to the swarm
- You can view the app on any swarm host IP on port 9096, or deploy the sample nginx controller to provide routing to the app and visualizer:
        `docker stack deploy -c stack_files/nginx.yaml nginx`
  nginx will be on any swarm host IP on port 80
- In the gogs repo, add a webhook to jenkins (payload url http://jenkins:8080/gogs-webhook/?job=master) in order to auto kick off the build when a source control event occurs. Updates pushed to the gogs repo will now automatically build and rolling deploy to the swarm
