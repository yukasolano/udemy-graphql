const Post =  {
    // async author(parent, args, { prisma }, info) {
    //     return await prisma.user.findUnique({
    //         where: {
    //             id:  parent.author.id
    //         }
    //     })
    // },
    async comments(parent, args, { prisma }, info) {
        // return db.comments.filter((comment) => {
        //     return comment.post === parent.id
        // })
        return await prisma.comment.findMany({
            where: {
               post: {
                   is: {
                       id: parent.id 
                    }
                }
            }
        })
    }
}

export { Post as default }