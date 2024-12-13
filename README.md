[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/MVUO33FO)

# Term Project: Phreddit

## Overview

Phreddit is a simplified version of Reddit designed as a learning project. It is built with a full-stack architecture using **React** for the front end, **Node.js** and **Express** for the server, and **MongoDB** for the database. The application allows users to create communities, posts, and comments, with distinct permissions for guests, registered users, and admins.

## Features

### General Components
- **Banner**: 
  - Includes:
    - Application name (`phreddit`) linking to the welcome page.
    - Search bar.
    - Profile button displaying username or "Guest."
    -Logout Button (hidden for guests)
    - Create Post button (disabled for guests).
- **Navigation Bar**: 
  - Includes links for:
    - Home
    - Create Community
    - List of communities (clickable links)

### Main Pages
- **Welcome Page**:
  - Displays options for users to:
    - Log in to an existing account.
    - Register for a new account.
    - Continue as a guest (limited functionality).

- **Registration**:
  - Register with name, email, password, and display name.

- **Login**
  - Login to access user-specific features.

- **Home Page**: 
  -Displays all posts with user's community posts listed on top and options to sort by newest, oldest, or active.

- **Create Community Page**
  - Create new communities with unique names and descriptions.

- **Community Page**
  - Clicking community list items takes user to this page
  - View community specific posts with sorting options.
  - Join or leave communities.

- **Search Page**: 
    - Search results for keywords entered in the serch bar lists here.
    - Lists search results for community, posts and comments based on keywords.
    - Lists user's community posts on top, and provides options to sort by newest, oldest, or active.

- **Create Post Page**
  - Create posts with titles, content, and optional link flair.

- **Post Page**
  - User lands Post Page on clicking any post for post specific details
  - Display vote counts, view counts, and comment counts.
  - Nested/threaded comments with indentation for replies.
  - Add comments or reply to existing ones.

- **Create Comment/Reply Page**
  - Create Comments or Replies to previous comments

- **User Profile Page**:
  - View personal details (display name, email, reputation, member since).
  - List of user-created posts, comments, and communities.
  - Edit or delete their content.

### User-Specific Features

- **User Roles**:
  - Guests: Can view posts and comments but cannot create or interact with content.
  - Registered Users: Can create posts, comments, and communities.
  - Admins: Manage users, posts, comments, and communities.

### Admin-Specific Features
- **Admin Profile Page**:
  - View all users with options to delete accounts.
  - Act as a user to manage their content.

- **User Management**:
  - View and manage users’ posts, comments, and communities.
  - Delete users and all their associated data.

---

## Setup and Installation

### Prerequisites
1. **Install Node.js**:
   - Ensure you have **Node.js (v16 or later)** installed. Download it from [Node.js Official Website](https://nodejs.org).
   - Verify installation by running:
     ```bash
     node -v
     npm -v
     ```

2. **Install MongoDB**:
   - Download and install [MongoDB Community Edition](https://www.mongodb.com/try/download/community).
   - Ensure `mongod` and `mongosh` commands are available in your terminal.

3. **Additional Tools**:
   - Install a text editor (e.g., VSCode) for development.
   - Install Git if using version control.

---

### Steps to Run the Application

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sbu-ckane-f24-cse316-pa01org/project-brownies.git
   cd project-brownies
   ```
2. **Start MongoDB**:
   - Open a terminal and run:
     ```bash
     mongod
     ```
   - In a separate terminal, run:
     ```bash
     mongosh
     ```
     Ensure MongoDB is running and accessible at `mongodb://127.0.0.1:27017`.

3. **Set Up the Server**:
   - Navigate to the `server` directory:
     ```bash
     cd server
     ```
   - Install server dependencies:
     ```bash
     npm install
     ```
   - Initialize server with initial data:
     ``` bash
     node server/init.js mongodb://127.0.0.1:27017/phreddit admin@example.com AdminDisplayName AdminFirstName AdminLastName secureAdminPass
     ```   
   - Start the server:
     ```bash
     node server.js
     ```
   - The server will run on **http://localhost:8000**.

3. **Set Up the Client**:
   - Open a new terminal and navigate to the `client` directory:
     ```bash
     cd client
     ```
   - Install client dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```
   - The client will run on **http://localhost:3000** and proxy API requests to **http://localhost:8000**.

4. **Access the Application**:
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

### Testing
- **Server Testing**:
  - Run Jest tests for the server:
    ```bash
    npm test
    ```
- **Client Testing**:
  - Run React tests for the client:
    ```bash
    npm test
    ```

## Team Member Contributions

### Sabrina Akter Chaite
- **Server-Side Development**:
  1) Designed and implemented the **data models** and **schemas** for `User`, `Post`, `Community`, `Comment`, and other entities.
  2) Created all **routes** for CRUD operations and API endpoints.
  3) Developed the `server.js` file to set up the Express server and middleware.
  4) Created the `init.js` file to initialize the database and seed data where necessary.
  5) Configured the MongoDB connection and handled server-side validations.

  Here’s a more polished version:



### **Client-Side Development**
- Implemented both **JavaScript** and **CSS** to create a fully functional and visually cohesive frontend. Key contributions include:

1. **Banner** (Guest, User): Displays user-specific navigation options like login/logout and profile access.
2. **NavBar** (Guest, User): Provides navigation to key features, adapting to the user's login status.
3. **Welcome Page**: Root page where users can choose to log in, register, or browse as a guest.
4. **Register Page**: Enables users to create an account with validations and feedback.
5. **Login Page**: Allows users to securely log in with email and password.
6. **Home Page** (Guest, User): Displays posts dynamically, with features adapted to guest and user roles.
7. **Community Page**: Showcases individual communities with their associated posts and information.
8. **Post Page** (Guest, User): Displays individual posts, with options to comment and interact for registered users.
9. **Reply Page**: Provides a structured view for nested comments and replies.
10. **Search Page** (Guest, User): Enables users to search posts and communities dynamically.
11. **User Profile**: Displays personalized data for individual users, including posts, comments, and communities.
12. **Admin Profile**: Offers advanced administrative features like viewing and managing user lists.
13. **Created README.md file**

### **Extras**
1. Resolved an error in the **New Post Page** that ensured created posts were properly added to their respective communities.
2. Updated **CSS styling** to enhance the user interface for:
   - **New Comment Page**
   - **New Community Page**
   - **New Post Page**

### Aradhana jayakrishna
1) New Post Page: Registered User can create posts with titles, content, and flair.
2) New Community Page: Registered User can create communities with unique names and descriptions.
3) New Comment Page: Registered User can add comments.
4) UML- Designed Unified Modeling Language (UML) diagrams to illustrate the structure and workflow of the application, including component interaction, and data flow covering client, server, and database
5) Testing: Verified that deleting a post removes all its comments from the database. Confirmed the server is listening on port 8000. Ensured the "Create Post" button is disabled for guests and enabled for registered users.

---

## Additional Notes
- Ensure the server runs on `http://localhost:8000` and the client on `http://localhost:3000`.
- MongoDB should use the database `phreddit` and run on `mongodb://127.0.0.1:27017/phreddit`.

For any issues or questions, contact sabrinaakter.chaite@stonybrook.edu or aradhana.jayakrishna@stonybrook.edu.


---