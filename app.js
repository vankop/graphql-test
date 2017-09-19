var express = require('express');
var graphqlHTTP = require('express-graphql');
var {schema} = require('./schema');
var config = require('./config.json');
var app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(config.port, function () {
    console.log('Listening on port ' + config.port);
});
