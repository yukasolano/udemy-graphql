import { GraphQLServer, PubSub} from 'graphql-yoga';
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription';
import { PrismaClient } from '.prisma/client'


const prisma = new PrismaClient()
const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
    },
    context: {
        db,
        pubsub,
        prisma
    }
})

server.start(() => {
    console.log('The server is up! Open in the browser: localhost:4000');
})

