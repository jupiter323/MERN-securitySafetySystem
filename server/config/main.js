module.exports = {

  // Secret key for JWT signing and encryption
  secret: 'super secret passphrase',

    // Setting port for server
  port: 9001,

  // necessary in order to run tests in parallel of the main app
  test_port: 9002,
  test_db: 'mern-starter-test',
  test_env: 'test'
};
