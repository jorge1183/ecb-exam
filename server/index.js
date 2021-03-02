const express = require('express');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;


// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../exam/build')));

  app.use(express.json())

  // Answer API requests.
  app.get('/api/cars', function (req, res) {
    let json = '';
    fs.readdirSync('./server/data/').forEach(file => {
      const data = fs.readFileSync('./server/data/' + file  , 'utf8')
      json += (json.length == 0 ? '[' : ',' ) + data;
    });
    json += ']';

    res.set('Content-Type', 'application/json');
    res.send(json);
  });

  app.post('/api/cars', function (req, res) {
    const car = `{
      "person":"${req.body.person || ''}",
      "description":"${req.body.description || ''}",
      "make":"${req.body.make || ''}",
      "model":"${req.body.model || ''}",
      "estimatedate":"${req.body.estimatedate || ''}",
      "id":${req.body.id || ''},
      "image":"${req.body.image || ''}",
      "km":"${req.body.km || ''}",
      "inMaintenance":${req.body.inMaintenance || false}
    }`;
    //Save file to storage
    fs.writeFile(`./server/data/${req.query.id}.json`, car, err => {
      if (err) {
        console.error(err)
        return
      }
    });

    res.end();
  });

  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../exam/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}