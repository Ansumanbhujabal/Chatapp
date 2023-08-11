# MERN Chat App

## Features
- **User Registration:** Users can create accounts by providing a unique username and password.
- **User Authentication:** Secure user authentication using JWT (JSON Web Tokens) for logging in and accessing the app's features.
- **Real-time Messaging:** Users can send and receive text messages in real-time.
- **Online Status:** Display of online and offline status for each user.
- **Responsive Design:** The app is designed to work smoothly across various devices and screen sizes.

## Technologies Used
- **Frontend:** React.js with functional components and hooks for dynamic UI rendering.
- **Backend:** Node.js and Express.js for building the RESTful API.
- **Database:** MongoDB for storing user data and message history.
- **Real-time Communication:** WebSocket protocol for real-time messaging using libraries like Socket.io.
- **Authentication:** JWT (JSON Web Tokens) for user authentication.
- **Styling:** CSS (with the option to incorporate preprocessors like Sass or CSS-in-JS libraries).
- **Deployment:** The app can be deployed on platforms like Heroku, AWS, or Vercel.

## Getting Started
Follow these instructions to set up and run the MERN Chat App locally for development and testing purposes.

### Prerequisites
- Node.js and npm (Node Package Manager) installed on your system.
- MongoDB database or MongoDB Atlas account for database storage.

### Installation
1. Clone the repository: `git clone https://github.com/your-username/mern-chat-app.git`
2. Navigate to the project directory: `cd mern-chat-app`
3. Install server dependencies: `npm install`
4. Navigate to the `client` directory: `cd client`
5. Install client dependencies: `npm install`
6. Create a `.env` file in the root directory and set the following environment variables:
```env
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret

 
