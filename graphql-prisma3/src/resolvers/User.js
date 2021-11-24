const User = {
    async posts(parent, args, { prisma }, info) {

        return await prisma.post.findMany({
            where: {
               author: {
                   is: {
                       id: parent.id 
                    }
                }
            }
        })
    },
   async  comments(parent, args, { prisma }, info) {
        return await prisma.comment.findMany({
            where: {
               author: {
                   is: {
                       id: parent.id 
                    }
                }
            }
        })
    }
}

export { User as default }