const http = require('http');
const controller = require('./controller');
const { getRequestBody } = require('./utils');

const server = http.createServer(async (req, res) => {
  const route = req.url;
  const method = req.method;

  // GET /projects
  if (route === '/projects' && method === 'GET') {
    try {
      const projects = await controller.getAllProjects();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(projects));
    } catch (e) {
      console.error('GET /projects', '-->', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'INTERNAL SERVER ERROR' }));
    }
  }

  // GET /projects/:id
  else if (route.match(/\/projects\/([0-9]+)/) && method === 'GET') {
    try {
      const id = route.split('/')[2];
      const project = await controller.getProject(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(project));
    } catch (e) {
      console.error('GET /projects/:id', '-->', e);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'BAD REQUEST' }));
    }
  }

  // POST /projects
  else if (route === '/projects' && method === 'POST') {
    try {
      const body = await getRequestBody(req);
      const result = await controller.createProject(JSON.parse(body));
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      console.error('POST /projects', '-->', e);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'BAD REQUEST' }));
    }
  }

  // PUT /projects/:id
  else if (route.match(/\/projects\/([0-9]+)/) && method === 'PUT') {
    try {
      const id = route.split('/')[2];
      const body = await getRequestBody(req);
      const result = await controller.updateProject(id, JSON.parse(body));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      console.error('PUT /projects/:id', '-->', e);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'BAD REQUEST' }));
    }
  }

  // DELETE /projects/:id
  else if (route.match(/\/projects\/([0-9]+)/) && method === 'DELETE') {
    try {
      const id = route.split('/')[2];
      const result = await controller.deleteProject(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      console.error('DELETE /projects/:id', '-->', e);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'BAD REQUEST' }));
    }
  }

  // 404
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'NOT FOUND' }));
  }
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log('Server is up on port:', port);
});
