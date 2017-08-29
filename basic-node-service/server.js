const app = require('express')();

const containerId = process.env.HOSTNAME;

app.get('/*', (req, res) => {
   res.send(`Hello from container ${ containerId } <br> View the swarm <a href="/swarm/view/">here</a>`);
});

app.listen(8080, () => { console.log('Server initialized'); });
