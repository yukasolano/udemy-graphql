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
        const user = await findUser(prisma, args.data.author)

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
        await findPost(prisma, args.id)
        const post =  await prisma.post.delete({
            where: {
                id: args.id
            }
        })

        // const postIndex = db.posts.findIndex((post) => post.id === args.id)

        // if (postIndex === -1) {
        //     throw new Error('Post not found')
        // }

        // const [post] = db.posts.splice(postIndex, 1)

        // db.comments = db.comments.filter((comment) => comment.post !== args.id)

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }
        return post
    },
    updatePost(parent, {
        id,
        data
    }, {
        db,
        pubsub
    }, info) {
        const post = db.posts.find((post) => post.id === id)
        const originalPost = {
            ...post
        }

        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
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
    deleteComment(parent, args, {
        db,
        pubsub
    }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found')
        }

        const [comment] = db.comments.splice(commentIndex, 1)
        pubsub.publish(`comment ${ comment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        })
        return comment
    },
    updateComment(parent, {
        id,
        data
    }, {
        db,
        pubsub
    }, info) {
        const comment = db.comments.find((comment) => comment.id === id)
        if (!comment) {
            throw new Error('Comment not found')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text
        }

        pubsub.publish(`comment ${ comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })
        return comment
    },
}

export {
    Mutation as
    default
}

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