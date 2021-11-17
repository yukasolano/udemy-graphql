import { GraphQLServer, PubSub} from 'graphql-yoga';
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription';
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'


import { PrismaClient } from '.prisma/client'
const prisma = new PrismaClient()

// const prisma = createPrisma();

// function createPrisma() {
//     console.log('create')
//   if (process.env.NODE_ENV === "production") {
//     return new PrismaClient({ log: ["warn", "error"] });
//   }

//   // Ensure that previous prisma instance is disconnected.
//   if ("prisma" in globalThis && "$disconnect" in globalThis["prisma"]) {
//     void globalThis["prisma"].$disconnect();
//   }

//   globalThis["prisma"] = new PrismaClient({
//     log: ["info", "query", "warn", "error"],
//   });

//   return globalThis["prisma"];
// }

// const prisma = createPrisma()

//  async function createNewUser()  {

//     const newUser = await prisma.user.create({
//         data: {
//           name: 'Alice',
//           email: 'alice@prisma.io',
//         },
//       })
//     const users = await prisma.user.findMany()
//     console.log(users);
//  }

  
//  createNewUser();

  

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
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

