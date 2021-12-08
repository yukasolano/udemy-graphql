const Query = {
    async users(parent, args, { prisma }, info) {

        if(!args.query) {
            return await prisma.user.findMany({include: { posts: true, comments: true }})
        }
        return await prisma.user.findMany({
            where: {
                name: {
                    contains: args.query
                }
            },
            include: { posts: true, comments: true }
        })
    },
    async posts(parent, args, { prisma }, info) {

        if(!args.query) {
            return await prisma.post.findMany({include: { author: true, comments: true}})
        }
        return await prisma.post.findMany({
            include: { author: true, comments: true },
            where: {
                title: {
                    contains: args.query
                }
            }
        })
    },
    async comments(parent, args, { prisma }, info) {
        return await prisma.comment.findMany({include: { author: true, post: true}})
    }
}

export { Query as default }