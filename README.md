# Chat Application

A full-stack real-time chat application built with the MERN stack. This application allows users to send messages in real-time, create group chats, share images, and receive notifications.

## Features

### Authentication and User Management
- User registration with email validation
- Secure login with password hashing using bcrypt
- JWT-based authentication with httpOnly cookies
- Profile picture upload and update
- Welcome email sent on successful registration
- Secure logout functionality

### Real-Time Messaging
- One-on-one private chat between users
- Real-time message delivery using Socket.io
- Send text messages and images
- Image upload and hosting with Cloudinary
- Message seen/read receipts with real-time updates
- Messages automatically delete after 24 hours if not seen

### Group Chat
- Create group chats with multiple users
- Add members to existing groups
- Group admin privileges for member management
- Real-time message delivery in group chats
- Group profile pictures

### User Experience
- Online and offline user status indicators
- Sound notifications for new messages
- Toggle sound on/off in settings
- Search and filter contacts
- Message history for each conversation
- Responsive design for mobile and desktop

### Security and Performance
- Rate limiting using Arcjet to prevent abuse
- Password strength validation (minimum 8 characters)
- Secure cookie handling with sameSite and httpOnly flags
- CORS protection with whitelisted origins
- Protected API routes with authentication middleware

## Technology Stack

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - MongoDB object modeling
- Socket.io - Real-time bidirectional communication
- JWT - JSON Web Tokens for authentication
- Bcrypt - Password hashing
- Cloudinary - Image storage and management
- Resend - Email service
- Arcjet - Rate limiting and security

### Frontend
- React - UI library
- Vite - Build tool and development server
- Zustand - State management
- React Router - Client-side routing
- Axios - HTTP client
- Socket.io Client - Real-time communication
- TailwindCSS - Utility-first CSS framework
- DaisyUI - Component library
- React Hot Toast - Notifications
- Lucide React - Icons

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (version 20.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Environment Variables Setup

You need to create environment variable files for both backend and frontend.

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URL=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Client URL (Frontend URL)
CLIENT_URL=http://localhost:5173

# Email Service (Resend)
EMAIL_FROM=your_email@yourdomain.com
EMAIL_FROM_NAME=Your App Name
RESEND_API_KEY=your_resend_api_key

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Arcjet (Rate Limiting)
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variable:

```env
VITE_API_URL=http://localhost:3000
```

### How to Get API Keys

1. **MongoDB**: 
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and get your connection string

2. **Cloudinary**:
   - Sign up at [Cloudinary](https://cloudinary.com/)
   - Find your credentials in the dashboard

3. **Resend**:
   - Sign up at [Resend](https://resend.com/)
   - Generate an API key from your account settings
   - Verify your sender domain or email

4. **Arcjet**:
   - Sign up at [Arcjet](https://arcjet.com/)
   - Create a new site and get your API key

5. **JWT Secret**:
   - Generate a random string (at least 32 characters)
   - You can use: `openssl rand -base64 32` in terminal

## Installation

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd Chat_Application_Project
```

### Step 2: Install Root Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

### Step 5: Setup Environment Variables

Create the `.env` files as described in the Environment Variables Setup section above.

## Running the Application

### Development Mode

You can run both frontend and backend simultaneously from the root directory, or run them separately.

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
This starts the backend server on `http://localhost:3000` with hot reload using nodemon.

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```
This starts the frontend development server on `http://localhost:5173`.

#### Option 2: Run Backend Only

```bash
cd backend
npm start
```
This runs the backend in production mode without hot reload.

### Production Mode

#### Build for Production

```bash
npm run build
```
This command:
1. Installs all backend dependencies
2. Installs all frontend dependencies
3. Builds the frontend for production

#### Start Production Server

```bash
npm start
```
This starts the backend server which also serves the built frontend files.

## Project Structure

```
Chat_Application_Project/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── Email/             # Email templates and handlers
│   │   ├── lib/               # Utility libraries
│   │   ├── middleware/        # Authentication and other middleware
│   │   ├── Models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   └── server.js          # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   ├── pages/             # Page components
│   │   ├── store/             # Zustand state management
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # React entry point
│   ├── public/                # Static assets
│   └── package.json
└── package.json               # Root package.json

```

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/update-profile` - Update user profile picture

### Message Routes
- `GET /api/messages/users/:id` - Get all messages with a specific user
- `POST /api/messages/send/:id` - Send a message to a user

### User Routes
- `GET /api/users` - Get all users except the logged-in user

### Group Routes
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all groups the user is a member of
- `GET /api/groups/:groupId` - Get a specific group
- `POST /api/groups/:groupId/members` - Add members to a group
- `DELETE /api/groups/:groupId/members/:memberId` - Remove a member from a group
- `POST /api/groups/:groupId/messages` - Send a message to a group
- `GET /api/groups/:groupId/messages` - Get all messages in a group

## Socket Events

### Client to Server
- `markSeen` - Mark messages as seen
- `disconnect` - User disconnects

### Server to Client
- `getOnlineUsers` - Receive list of online users
- `newMessage` - Receive a new message
- `messagesSeen` - Notification that messages have been seen
- `groupCreated` - Notification that a group has been created
- `groupMessage` - Receive a new group message

## Usage Guide

### For Users

1. **Sign Up**
   - Navigate to the signup page
   - Enter your full name, email, and password (minimum 8 characters)
   - Click Sign Up
   - You will receive a welcome email

2. **Login**
   - Enter your email and password
   - Click Login

3. **Start Chatting**
   - Select a user from the contacts list
   - Type your message in the input field
   - Press Enter or click Send
   - You can also send images by clicking the image icon

4. **Create a Group**
   - Click the "Create Group" button
   - Enter a group name
   - Select members to add
   - Click Create

5. **Update Profile Picture**
   - Click on your profile
   - Click the camera icon
   - Select an image
   - Click Update

6. **Enable/Disable Sounds**
   - Click on the sound icon in the profile header
   - Toggle between sound on and off

### Message Features
- Messages show delivered status with a single checkmark
- Messages show seen status with a double checkmark
- Unseen messages are automatically deleted after 24 hours
- Seen messages are deleted 60 seconds after being marked as seen

## Troubleshooting

### Common Issues

1. **Cannot connect to MongoDB**
   - Check your MongoDB connection string in the `.env` file
   - Ensure your MongoDB server is running
   - Check if your IP address is whitelisted in MongoDB Atlas

2. **Images not uploading**
   - Verify your Cloudinary credentials
   - Check if the image size is not too large (backend limit is 100mb for JSON)

3. **Emails not sending**
   - Verify your Resend API key
   - Check if your sender email is verified in Resend
   - Look at backend console logs for specific error messages

4. **Socket connection issues**
   - Ensure CLIENT_URL in backend `.env` matches your frontend URL
   - Check if the backend server is running
   - Look for CORS errors in the browser console

5. **Port already in use**
   - Change the PORT in backend `.env` file
   - Or stop the process using that port

## Security Considerations

- Never commit `.env` files to version control
- Use strong passwords and JWT secrets
- Keep all dependencies up to date
- The application uses httpOnly cookies to prevent XSS attacks
- Rate limiting is implemented to prevent abuse
- Password minimum length is enforced
- Email validation is performed before registration

## Contributing

If you want to contribute to this project:
1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Author

Feel free to reach out for questions or suggestions.

## Acknowledgments

- Built with MERN stack
- Real-time features powered by Socket.io
- UI components from DaisyUI
- Icons from Lucide React
