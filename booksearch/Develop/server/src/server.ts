import express from 'express';
import path from 'node:path';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './Schemas';
import db from './config/connection.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

await server.start();
server.applyMiddleware({ app: app as express.Application });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});