const app = require('express')();
const bodyParser = require('body-parser');

const { updateClientIp } = require('./components/clientbackend/ssh');
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`listening on port ${port}!`));

app.post('/updateClient/', async (request, response) => {
  const { env, clientLocation } = request.body;
  const statusObject = await updateClientIp({
    env,
    clientLocation
  });

  response.setHeader('Content-Type', 'application/json');
  const res = JSON.stringify(statusObject);

  if (statusObject.status === 'success') response.end(res);
  else response.status(500).send(res);
});
