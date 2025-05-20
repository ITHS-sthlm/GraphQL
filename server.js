// Importerar nödvändiga paket
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Skapar ett exempel på en databas i minnet, en array med användare
let users = [
  { id: '1', name: 'Anna', email: 'anna@test.se' },
  { id: '2', name: 'Björn', email: 'bjorn@test.se' }
];

// Definierar GraphQL-schemat
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User] # Hämtar alla användare
    user(id: ID!): User # Hämtar en användare med specifikt ID
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String!, email: String): User
    deleteUser(id: ID!): Boolean
  }
`;

// Resolvers – funktioner för att hämta eller modifiera data
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id)
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const newUser = {
        id: String(users.length + 1),
        name,
        email
      };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, name, email }) => {
      const user = users.find(u => u.id === id);
      if (!user) return null;
      user.name = name;
      if (email) user.email = email;
      return user;
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    }
  }
};

// Startar servern
async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Servern är igång på http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();
