# The Modern GraphQL Bootcamp (with Node.js and Apollo)

Link to the course: https://www.udemy.com/course/graphql-bootcamp


## GraphQL Basics

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
  createUser(
    data: {
      name: "Nona",
      email: "nona@email.com"
    }) {
    id
    name
  }
}
```


Connection with database
Create an account on Heroku
Create a new app (udemy-graphql-yuka-server)
Go to Overview -> Installed add-ons -> Configure Add-ons
Search for Heroku Postgres
Create a new one
Go to setting -> View Credentials to see the credentials to connect with the database

Use these settings for connect to this server by pgadmin
Open docker

--------------------------------
Install prisma : npm install -g prisma@1.12.0
Check prismma version: prisma -v
Start a project using prisma: prisma init prisma

Start prisma
1. Open folder: cd prisma
  2. Start your Prisma server: docker-compose up -d
  3. Deploy your Prisma service: prisma deploy
  4. Read more about Prisma server:
     http://bit.ly/prisma-server-overview

Open in browser localhost: 4466

------------------------------------------------
Following https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres
prisma version 3.4.2

1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver or mongodb (Preview).
3. Run prisma db pull to turn your database schema into a Prisma schema. (prisma db push for the opposite)
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.