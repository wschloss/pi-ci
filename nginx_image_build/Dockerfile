FROM resin/rpi-raspbian

# Install nginx and clean default sites
RUN apt-get -y update && \
    apt-get install -y nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    rm /etc/nginx/sites-available/* && \
    rm /etc/nginx/sites-enabled/*

COPY ./swarm.conf /etc/nginx/sites-available/swarm.conf

RUN ln -s /etc/nginx/sites-available/swarm.conf /etc/nginx/sites-enabled/swarm.conf

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
