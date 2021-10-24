import { GraphQLServer } from 'graphql-yoga';

// Scalar types: String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int!]!
        me: User!
        post: Post
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers (function for each operation)
const resolvers = {
    Query: {
        greeting(parent, args, context, info) {
            if(args.name) {
                return `Hello, ${args.name}`
            }
            return 'Hello'
        },
        add(parent, args, context, info) {
            if(args.numbers.length === 0) {
                return 0
            }

            return  args.numbers.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            })
        },
        grades(parent, args, context, info) {
            return [3, 5, 7]
        },
        me() {
            return {
                id: 'abc123',
                name: 'Lu',
                email: 'lu@example.com',
                age: 30
            }
        },
        post() {
            return {
                id: '001',
                title: 'Post 1',
                body: '',
                published: false
            }
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