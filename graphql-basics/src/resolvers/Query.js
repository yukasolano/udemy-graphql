const Query = {
    users(parent, args, { db }, info) {
        if(!args.query) {
            return db.users
        }
        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        }) 
    },
    posts(parent, args, { db }, info) {
        if(!args.query) {
            return db.posts
        }
        return db.posts.filter((post) => {
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
    comments(parent, args, { db }, info) {
        return db.comments
    }
}

export { Query as default }