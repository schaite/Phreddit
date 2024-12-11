const request = require('supertest');
const app = require('./server'); // Path to your server.js
const mongoose = require('mongoose'); // Import mongoose

jest.setTimeout(10000); // Extend timeout to 10 seconds

describe('Express Server', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(8000, () => {
      console.log('Test server running on port 8000');
      done();
    });
  });

  afterAll(async () => {
    // Ensure the database connection is closed
    await mongoose.connection.close();
    // Ensure the server is stopped
    await new Promise((resolve) => server.close(resolve));
    console.log('Test server stopped');
  });

  test('should respond on port 8000', async () => {
    const response = await request(server).get('/'); // Test the root route
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello Phreddit!'); // Ensure correct response
  });
});
