import ApolloClient from 'apollo-boost';
import redux from './ducks/redux'
export default new ApolloClient({
  uri: `${redux.serverUrl}/graphql`
});