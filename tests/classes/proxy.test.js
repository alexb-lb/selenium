const fs = require('fs');

const assert = require('expect');
const request = require('supertest');
const checkProxy = require('check-proxy').check;

const Proxy = require('./../../classes/Proxy');
// const {users, populateUsers} = require('./seed/seed.js');

// const responseMock = require('./mocks/responseMock');
//
// beforeEach(populateUsers);

describe('Proxy.get()', async () => {
  it('should return proxy name and proxy port', async () => {
    const proxy = await Proxy.get();
    assert(proxy.name).toBe('1.1.1.1');
    assert(proxy.port).toBe('8000');
  })
});

describe('POST /api/v1.0/login', () => {
  it('should login user and return user info object with token', async () => {
    const res = await request(app)
      .post('/api/v1.0/login')
      .send({email: users[0].local.email, password: users[0].local.password});

    assert(res.statusCode).toBe(200);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body.success).toBe(true);
    assert(res.body.user._id).toBe(users[0]._id.toString());
    assert(res.body.user.name).toBe(users[0].name);
    assert(typeof res.body.user.token).toBe('string');
  });

  it('should reject if user not found', async () => {
    const res = await request(app)
      .post('/api/v1.0/login')
      .send({email: 'unknown@unknown.com', password: '1234567890'});

    assert(res.statusCode).toBe(404);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body).toEqual({success: false, message: 'User not found', errorInElement: false});
  });

  it('should reject if password is invalid', async () => {
    const res = await request(app)
      .post('/api/v1.0/login')
      .send({email: users[0].local.email, password: users[0].local.password + '1'});

    assert(res.statusCode).toBe(400);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body).toEqual({success: false, message: 'Incorrect password', errorInElement: 'password'});
  });
});

describe('POST /api/v1.0/register', () => {
  it('should return validation errors if request invalid', async () => {
    const res = await request(app)
      .post('/api/v1.0/register')
      .send({email: 'trulala', password: '123456', name: 'Lolobot'});

    assert(res.statusCode).toBe(400);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body).toEqual({
      success: false,
      message: 'Please provide a correct email address.',
      errorInElement: 'email'
    });
  });

  it('should not create a user if email in use', async () => {
    const res = await request(app)
      .post('/api/v1.0/register')
      .send({email: users[0].local.email, name: users[0].name, password: users[0].local.password});

    assert(res.statusCode).toBe(409);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body).toEqual({
      success: false,
      message: 'This email is already taken',
      errorInElement: 'email'
    });
  });

  it('should link together local register with account registered via social network if email the same', async () => {
    const res = await request(app)
      .post('/api/v1.0/register')
      .send({email: users[2].local.email, password: users[2].local.password, name: users[2].name});

    assert(res.statusCode).toBe(200);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body.success).toBe(true);
    assert(res.body.user._id).toBe(users[1]._id.toString());
    assert(res.body.user.name).toBe(users[1].name);
    assert(typeof res.body.user.token).toBe('string');

    const updatedUser = await User.findOne({_id: users[1]._id});
    assert(updatedUser.local.email).toBe(users[2].local.email);
    assert(updatedUser.local.password.length).toBeGreaterThan(1);
  });

  it('should register user and return user info object with token', async () => {
    const res = await request(app)
      .post('/api/v1.0/register')
      .send({email: users[3].local.email, password: users[3].local.password, name: users[3].name});

    assert(res.statusCode).toBe(200);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body.success).toBe(true);
    assert(res.body.user._id).toEqual(assert.any(String));
    assert(res.body.user.name).toBe(users[3].name);
    assert(typeof res.body.user.token).toBe('string');
  });
});

describe('POST /api/v1.0/auth', () => {
  it('should check token and return user info object with token', async () => {
    const validToken = genToken(users[0]);

    const res = await request(app)
      .post('/api/v1.0/auth')
      .set('Authorization', validToken);

    assert(res.statusCode).toBe(200);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body.success).toBe(true);
    assert(res.body.user._id).toBe(users[0]._id.toString());
    assert(res.body.user.name).toBe(users[0].name);
    assert(typeof res.body.user.token).toBe('string');
  });

  it('should check invalid token and return error object', async () => {
    const res = await request(app)
      .post('/api/v1.0/auth')
      .set('Authorization', 'qqqqqqqq');

    assert(res.statusCode).toBe(401);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body).toEqual({success: false, message: 'Could not authenticate. Please contact site administration', errorInElement: false});
  });
});

describe('Auth.socialLogin (POST /api/v1.0/auth/facebook) method tests', () => {
  it('should login user if social network id exists and return user info object', async () => {
    const authenticatedUser = {
      provider: 'facebook',
      token: users[1].facebook.token,
      id: users[1].facebook.id,
      email: users[1].facebook.email,
      name: users[1].name,
      avatar: users[1].name
    };

    const res = await AuthController.socialLogin(responseMock, authenticatedUser);

    assert(res.statusCode).toBe(200);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body.success).toBe(true);
    assert(res.body.user._id).toBe(users[1]._id.toString());
    assert(res.body.user.name).toBe(users[1].name);
    assert(typeof res.body.user.token).toBe('string');
  });

  it('should link together social account with already registered local if email the same', async () => {
    const res = await AuthController.socialLogin(responseMock, users[5]);

    assert(res.statusCode).toBe(200);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body.success).toBe(true);
    assert(res.body.user._id).toBe(users[0]._id.toString());
    assert(res.body.user.name).toBe(users[0].name);
    assert(typeof res.body.user.token).toBe('string');

    const updatedUser = await User.findOne({_id: users[0]._id});
    assert(updatedUser.facebook.email).toBe(users[5].email);
    assert(updatedUser.facebook.id).toBe(users[5].id);
  });

  it('should register new user and return user object', async () => {
    const res = await AuthController.socialLogin(responseMock, users[4]);

    assert(res.statusCode).toBe(200);
    assert(res.headers['content-type']).toEqual(assert.stringContaining('json'));
    assert(res.body.success).toBe(true);
    assert(res.body.user._id).toEqual(assert.any(String));
    assert(res.body.user.name).toBe(users[4].name);
    assert(typeof res.body.user.token).toBe('string');
  });
});