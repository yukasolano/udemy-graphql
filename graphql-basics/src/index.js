import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

// Resolvers (function for each operation)
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        },
        name() {
            return "Yuka"
        },
        location() {
            return "São Paulo"
        },
        bio() {
            return "Programmer learning GraphQL"
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up! Open in the browser: localhost:4000');
})