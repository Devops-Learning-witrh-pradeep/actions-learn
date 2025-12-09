const http = require('http');
const app = require('../server');

describe('Server endpoints', () => {
  let server;
  beforeAll((done) => {
    server = app.listen(0, done);
  });
  afterAll((done) => { server.close(done); });

  test('/api/health returns status ok', (done) => {
    const port = server.address().port;
    http.get(`http://localhost:${port}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(data)).toEqual({ status: 'ok' });
        done();
      });
    });
  });

  test('/api/hello returns hello message', (done) => {
    const port = server.address().port;
    http.get(`http://localhost:${port}/api/hello`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(data)).toEqual({ message: 'Hello from Node server' });
        done();
      });
    });
  });
});
