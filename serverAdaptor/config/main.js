module.exports = {

  // Secret key for JWT signing and encryption
  secret: 'super secret passphrase',

    // Setting port for server
  port: 9003,

  // necessary in order to run tests in parallel of the main app
  test_port: 9004,
  test_db: 'mern-starter-test',
  test_env: 'test'
};
