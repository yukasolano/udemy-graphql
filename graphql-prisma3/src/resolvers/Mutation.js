import uuidv4 from 'uuid/v4'


const Mutation = {
    async createUser(parent, args, { prisma}, info) {
        await emailTaken(prisma, args.data.email)
        return await prisma.user.create({
            data: {
                ...args.data
            },
        })
    },
    async deleteUser(parent, args, { prisma }, info) {
        await findUser(prisma, args.id)
        return await prisma.user.delete({
            where: {
                id: args.id
            }
        })
    },
    async updateUser(parent, { id, data}, { prisma }, info) {
        await findUser(prisma, id)

        if (typeof data.email === 'string') {
            await emailTaken(prisma, data.email)
        }

        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                ...data
            },
        })
    },
    async createPost(parent, args, { prisma, pubsub }, info) {
        await findUser(prisma, args.data.author)

        const post = await prisma.post.create({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            },
            include: {
                author: true
            }
        })

        if (post.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post
    },
    async deletePost(parent, args, { prisma, pubsub }, info) {
        return await prisma.post.delete({
            where: {
                id: args.id
            }
        })
    },
    async updatePost(parent, args, { prisma, pubsub }, info) {

        return await prisma.post.update({
            where: {
                id: args.id
            },
            data: {
                ...args.data
            },
        })
    },
    async createComment(parent, args, { prisma, pubsub }, info) {
        const user = await findUser(prisma, args.data.author)

        const postPublished = await prisma.post.findFirst({
            where: {
                id: args.data.post,
                published: true
            }
        })

        if (!postPublished) {
            throw new Error('Post not published.')
        }

        const comment = await prisma.comment.create({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            },
            include: {
                author: true,
                post: true
            }
        })

        
        pubsub.publish(`comment ${ args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        

        return comment
    },
    async deleteComment(parent, args, { prisma, pubsub}, info) {
        return await prisma.comment.delete({
            where: {
                id: args.id
            }
        })
    },
    async updateComment(parent, args, {prisma, pubsub}, info) {
        return await prisma.comment.update({
            where: {
                id: args.id
            },
            data: {
                ...args.data
            },
        })
    },
}

export { Mutation as default }

async function findUser(prisma, id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    if (!user) {
        throw new Error('User not found')
    }
    return user
}

async function emailTaken(prisma, email) {
    const emailTaken = await prisma.user.findFirst({
        where: {
            email: email
        }
    })
    if (emailTaken) {
        throw new Error('Email taken.')
    }
}

async function findPost(prisma, id) {
    const post = await prisma.post.findUnique({
        where: {
            id: id
        }
    })

    if (!post) {
        throw new Error('Post not found')
    }
    return post
}
