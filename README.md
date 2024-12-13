[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MVUO33FO)

# Term Project: Phreddit

## Overview
Phreddit is a platform inspired by Reddit. It allows users to create posts, communities, and comments for open conversations. The platform differentiates between guests and registered users by offering different permissions. Key features include creating posts and communities, managing user profiles, searching posts, and more.

The application includes:
- A **Home Page** where users can view posts.
- A **Navigation Bar** for accessing features like login/logout, profile, community creation, post creation, and search.

---

## Instructions to Setup and Run the Project

Before starting, ensure the following:
- **Node.js** (v16 or later) is installed.
- **MongoDB** is installed and running.

### Steps:
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Start MongoDB:
   - Open a terminal and run:
     ```bash
     mongod
     ```
   - In a separate terminal, run:
     ```bash
     mongosh
     ```
     Ensure MongoDB is running and accessible at `mongodb://127.0.0.1:27017`.

3. Set up the server:
   - Navigate to the server directory:
     ```bash
     cd server
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the server:
     ```bash
     nodemon server.js
     ```
   - The server should now be running on `http://localhost:8000`.

4. Set up the client:
   - Open another terminal and navigate to the client directory:
     ```bash
     cd ../client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React client:
     ```bash
     npm start
     ```
   - The React app should now be running on `http://localhost:3000`.

---

## Features
### Core Functionality:
1. **User Management**:
   - Registration and Login (with email and display name validation).
   - User Profiles displaying user statistics (e.g., reputation).
   - Admin view for managing users, posts, and communities.

2. **Posts**:
   - Create, update, delete posts with titles, content, and flairs.
   - View detailed post pages with associated comments.

3. **Communities**:
   - Create, update, delete communities with unique names and descriptions.
   - View community details with member statistics.

4. **Comments**:
   - Add, update, delete comments and replies.
   - Nested comment threads for discussions.

5. **Search Functionality**:
   - Search posts and comments using keywords.

6. **Admin Features**:
   - Manage all users, communities, posts, and comments.
   - Act as a specific user to manage their data.

---

## Team Member Contributions

### Team Member 1 Contribution
1. **Authentication**:
   - User registration with email, display name, and password validation.
   - User login with bcrypt-hashed passwords.
2. **Post Search**:
   - Implemented a search functionality for posts based on keywords.
3. **User Profile Page**:
   - Developed profile page displaying user statistics and data (posts, communities, comments).
4. **Admin Features**:
   - Enabled admin to manage all users and their data.

### Team Member 2 Contribution
1. **New Post Page**:
   - Registered users can create posts with titles, content, and flair.
2. **New Community Page**:
   - Registered users can create communities with unique names and descriptions.
3. **New Comment Page**:
   - Registered users can add comments and reply to other comments.
4. **UML Design**:
   - Designed Unified Modeling Language (UML) diagrams to illustrate:
     - Structure and workflow of the application.
     - Component interaction and data flow covering client, server, and database.
5. **Testing**:
   - Verified that deleting a post removes all associated comments.
   - Confirmed the server listens on port 8000.
   - Ensured the "Create Post" button is disabled for guests but enabled for registered users.

---

## Additional Notes
- Ensure the server runs on `http://localhost:8000` and the client on `http://localhost:3000`.
- MongoDB should use the database `phreddit` and run on `mongodb://127.0.0.1:27017/phreddit`.

For any issues or questions, contact [Your Email].