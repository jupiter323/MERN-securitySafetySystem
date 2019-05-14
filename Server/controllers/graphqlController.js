const graphqlHTTP = require('express-graphql'),
    schema = require('./../graphqlschema/deckZoneSenor')

exports.getGraphQl = graphqlHTTP({
    schema,
    graphiql: true,
})