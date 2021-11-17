// Demo user data
const users = [{
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

const posts = [{
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

const comments = [{
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



const db = {
    users,
    posts,
    comments
}

export { db as default }