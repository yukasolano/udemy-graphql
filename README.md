# The Modern GraphQL Bootcamp (with Node.js and Apollo)

Link to the course: https://www.udemy.com/course/graphql-bootcamp


## GraphQL Basiscs

### Getting start
```
cd graphql-basics 
npm install
npm run start
```

Open in the browser: http://localhost:4000/
```
{
  posts {
    id
    title 
    author {
      name
    }
    comments {
      text 
      author {
        name
      }
    }
  }
}
```
```
mutation {
  createUser(name: "Nona", email: "nona@email.com") {
    id
    name
  }
}
```
