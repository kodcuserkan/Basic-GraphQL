require('dotenv').config();
const express = require("express");
const mongoose =  require("mongoose");
const { graphqlHTTP } = require('express-graphql');
const schema = require("./schema/schema");

const app = express();

const connection_string = process.env.MONGODB_STRING;

mongoose.connect(connection_string,{ useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.once('open', () => {
  console.log("MongoDB bağlantı başarılı!");
});

const PORT = process.env.PORT || 1453;


app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log("Your application runs on port: ", PORT);
});
