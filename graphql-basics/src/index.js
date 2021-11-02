import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4'

// Scalar types: String, Boolean, Int, Float, ID

// Demo user data
let users = [{
    id: '1',
    name: 'Yuka',
    email: 'yuka@example.com',
    age: 30
}, {
    id: '2',
    name: 'Luiz',
    email: 'luiz@example.com',
}, {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
    age: 27
}]

let posts = [{
    id: '11',
    title: 'Post 1',
    body: '',
    published: false,
    author: '1'
}, {
    id: '12',
    title: 'Post 2',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    published: true,
    author: '1'
}, {
    id: '13',
    title: 'Post 3',
    body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
    published: true,
    author: '2'
}]

let comments = [{
    id: '21',
    text: 'This worked well for me. Thanks!',
    author: '2',
    post: '11'
}, {
    id: '22',
    text: 'Glad you enjoyed it.',
    author: '1',
    post: '11'
}, {
    id: '23',
    text: 'This did no work.',
    author: '3',
    post: '12'
}, {
    id: '24',
    text: 'Nevermind. I got it to work.',
    author: '3',
    post: '12'
},{
    id: '25',
    text: 'Last post good',
    author: '1',
    post: '13'
},{
    id: '26',
    text: 'good',
    author: '3',
    post: '13'
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers (function for each operation)
const resolvers = {
    Query: {
        users(parent, args, context, info) {
            if(!args.query) {
                return users
            }
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            }) 
        },
        posts(parent, args, context, info) {
            if(!args.query) {
                return posts
            }
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) 
                    || post.body.toLowerCase().includes(args.query.toLowerCase())
            }) 
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
        },
        comments() {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, context, info) {
            const emailTaken = users.some((user) => {
                return user.email === args.data.email
            })

            if (emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            users.push(user)
            return user
        },
        deleteUser(parent, args, context, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if(userIndex === -1) {
                throw new Error('User not found')
            }

            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id

                if(match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)
            return deletedUsers[0]
        },
        createPost(parent, args, context, info) {
            const userExist = users.some((user) => {
                return user.id === args.data.author
            })

            if (!userExist) {
                throw new Error('User not found.')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }
            posts.push(post)
            return post
        },
        deletePost(parent, args, context, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)

            if(postIndex === -1) {
                throw new Error('Post not found')
            }

            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]
        },
        createComment(parent, args, context, info) {
            const userExist = users.some((user) => user.id === args.data.author)

            if (!userExist) {
                throw new Error('User not found.')
            }

            const postPublished = posts.some((post) => post.id === args.data.post && post.published)

            if (!postPublished) {
                throw new Error('Post not published.')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }
            comments.push(comment)
            return comment
        },
        deleteComment(parent, args, context, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id)

            if(commentIndex === -1) {
                throw new Error('Comment not found')
            }

            const deletedComments = comments.splice(commentIndex, 1)
            return deletedComments[0]
        }
    },
    Post: {
        author(parent, args, context, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, context, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, args, context, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, context, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, context, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, context, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
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