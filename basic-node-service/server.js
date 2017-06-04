const app = require('express')();
const uuid = require('uuid/v4');

const containerUuid = uuid();

app.get('/*', (req, res) => {
   res.send(`Hello from container ${ containerUuid } <br> View the swarm <a href="/swarm/view/">here</a>`);
});

app.listen(8080, () => { console.log('Server initialized'); });
