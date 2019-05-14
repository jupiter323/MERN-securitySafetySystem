require('dotenv').config()
const rootReducer = {
  serverUrl: process.env.REACT_APP_ENV === 'development' ? `http://localhost:${process.env.REACT_APP_PORT_SERVER}` : process.env.REACT_APP_ROUTE_SERVER,
  adaptorServerUrl: process.env.REACT_APP_ENV === 'development' ? `http://localhost:${process.env.REACT_APP_PORT_SERVER_ADAPTOR}` : process.env.REACT_APP_ROUTE_SERVER_ADAPTOR,
  socketUrl: process.env.REACT_APP_ENV === 'development' ? `ws://localhost:${process.env.REACT_APP_PORT_SOCKET}` : process.env.REACT_APP_ROUTE_SOCKET
}
export default rootReducer
