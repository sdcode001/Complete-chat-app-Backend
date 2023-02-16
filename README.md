## A complete chat app backend made using next.js, socket.io, next.auth, mongoDB

It is a complete backend of web chat app made using Next.js, Socket.io, Next.Auth, MongoDB. 
This backend has all the user authentication Apis like- SignIn, SignUp, register-user, all these Apis are protected by Next.Auth and jwt token and password is encrypted before user data being stored into MongoDb.
this backend has all the chatting Apis like- one-to-one chat, group chat, create group, add member, delete member etc. The messaging Api is handled by Socket.IO for realtime web socket communication.
All the data through Apis being stored into MongoDB database and all the Api routes are protected using Next.Auth.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
