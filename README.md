Mailbox
Mailbox is a web application that allows users to authenticate via Google OAuth, view a list of mock emails, classify them into categories (e.g., Marketing, Important, Other), mark emails as read/unread, and log out. The backend is built with Node.js, Express, and MongoDB, using Passport for authentication and JWT for API security. The frontend is a React application running on Vite, providing a user-friendly interface to interact with emails.
Features

LiveDemo- https://email-classifier-pi.vercel.app/


Google OAuth Login: Authenticate users via Google OAuth 2.0.
Email Listing: Display mock emails stored in MongoDB for the authenticated user.
Email Classification: Classify emails based on content (e.g., "sale" → Marketing, "urgent" → Important).
Read/Unread Status: Mark emails as read or unread (in progress).
Logout: Clear session and JWT token to log out securely.
Error Handling: Robust error handling in backend and frontend for authentication, API calls, and database operations.

Tech Stack

Backend:
Node.js
Express
MongoDB 
Passport.js (Google OAuth 2.0)
JSON Web Tokens (JWT)


Frontend:
React
Vite
React Router
Axios
Tailwind CSS


Database:  Mongoose Atls

Setup Instructions
1. Clone the Repository
git clone https://github.com/LaxmanPrajapat3/-Email-classifier.git
cd Mailbox

2. Backend Setup

Navigate to Backend Directory:
cd Backend


Install Dependencies:
npm install


Set Up Environment Variables:
Create a .env file in the Backend directory with the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/emailapp
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret


Replace MONGO_URI with your MongoDB connection string (local or Atlas).
Obtain GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console (see below).
Use a secure JWT_SECRET (e.g., a random string).


Configure Google OAuth


Start MongoDB (if using local):
mongod


Start Backend:
npm start


The backend should run on http://localhost:5000.
Check logs for Server running on port 5000 and MongoDB connected.



3. Frontend Setup

Navigate to Frontend Directory:
cd /frontend


Install Dependencies:
npm install


Verify Vite Configuration:
Ensure vite.config.js sets the port to 5173:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});


Start Frontend:
npm run dev


The frontend should run on http://localhost:5173.



Usage

Login:

Open http://localhost:5173 in a browser (use incognito mode to avoid cache issues).
Click Login with Google.
Sign in with a test user (e.g., theprogrammer452023@gmail.com).
After authentication, you’ll be redirected to /home, where emails are displayed.


View Emails:

The /home page shows a list of mock emails on the left and a preview pane on the right.
Click an email to view its details.


Classify Emails:

Select the number of emails to classify from the dropdown.
Click Classify to tag emails as Marketing, Important, or Other based on content.


Mark Read/Unread (In Progress):

Toggle the read/unread status of emails (feature under development).


Logout:

Click the Logout button on the /home page to clear the session and return to the login page.



