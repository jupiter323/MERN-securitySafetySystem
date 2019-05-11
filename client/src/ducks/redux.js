const rootReducer = {
  serverUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:9001' : 'http://192.168.1.102:9001',
  adaptorServerUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:9003' : 'http://192.168.1.102:9003',
  socketUrl: 'ws://192.168.1.102:1234',
}

export default rootReducer
