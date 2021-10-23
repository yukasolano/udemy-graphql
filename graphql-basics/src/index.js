import { GraphQLServer } from 'graphql-yoga';

// Scalar types: String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
        title: String!
        price: Float!
        releaseYear: Int 
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers (function for each operation)
const resolvers = {
    Query: {
        id() {
            return 'abc12'
        },
        name() {
            return 'Yuka'
        },
        age() {
            return 27
        },
        employed() {
            return true
        },
        gpa() {
            return 3.7
        },
        title() {
            return 'Dinner table'
        },
        price() {
            return 400
        },
        releaseYear() {
            return 2010
        },
        rating() {
            return 8.0
        },
        inStock() {
            return true
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