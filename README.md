[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MVUO33FO)
# Term Project

Add design docs in *images/*

## Instructions to setup and run project
Clearly explain the steps required to install and configure necessary packages,
for both the server and the client, and the sequence of steps required to get
your application running.


Welcome to Phreddit!

Phreddit is a platform inspired by the actual Reddit. It lets users to create posts, communities, and comments for open conversations. Guests and registered user have different permissions. The application includes a home page where users can view posts and a navigation bar that helps them access features like login, logout, search posts profile, and creating posts.

Before starting make sure Node.js(v16 or later) and mongoDB are installed. We use React.js along with CSS for the frontend. The Express web server should run on Node and should connect to a backend database. The server should run on localhost:8000 and the reach app should run on localhost:3000. For MongoDB, the server-side script should connect to mongodb://127.0.0.1:27017/phreddit. Use mongod and mongosh in the terminals before starting the server and client.


Open two terminals one for server and one for client. To start the server we use nodemon server.js and to start the client we use npm start.



In the sections below, list and describe each contribution briefly.

## Team Member 1 Contribution

## Team Member 2 Contribution
1) New Post Page: Registered User can create posts with titles, content, and flair.
2) New Community Page: Registered User can create communities with unique names and descriptions.
3) New Comment Page: Registered User can add comments and reply to other comments.
4) UML- Designed Unified Modeling Language (UML) diagrams to illustrate the structure and workflow of the application, including component interaction, and data flow covering client, server, and database
5) Testing: Verified that deleting a post removes all its comments from the database. Confirmed the server is listening on port 8000. Ensured the "Create Post" button is disabled for guests and enabled for registered users.
