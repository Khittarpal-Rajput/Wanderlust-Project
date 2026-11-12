# 🌍 Wanderlust – Travel & Accommodation Platform

Wanderlust is a full-stack travel accommodation listing platform where users can explore places, discover properties, create listings, and share their travel experiences through reviews.

The platform provides user authentication, listing management, image uploads, reviews, and an interactive user experience.

## ✨ Features

- **User Authentication:** Secure user registration and login.
- **Explore Listings:** Browse available travel accommodations.
- **Create Listings:** Add new properties with descriptions and details.
- **Edit & Delete Listings:** Manage your own property listings.
- **Image Uploads:** Upload and manage listing images using Cloudinary.
- **Reviews & Ratings:** Share experiences and rate properties.
- **Interactive Maps:** Explore listing locations.
- **Search & Filters:** Find suitable accommodations.
- **Responsive Design:** User-friendly interface.
- **Session Management:** Maintain authenticated user sessions.
- **Authorization:** Restrict listing and review management to authorized users.

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Express Session

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS
- Bootstrap

### Tools & Services
- MongoDB Atlas
- Cloudinary
- Git & GitHub
- VS Code
- npm

## 📁 Project Structure

```text
Wanderlust-Project/
│
├── controllers/
├── init/
├── models/
├── public/
├── routes/
├── utils/
├── views/
│
├── .env
├── .gitignore
├── app.js
├── cloudConfig.js
├── middleware.js
├── package.json
├── package-lock.json
└── schema.js
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Khittarpal-Rajput/Wanderlust-Project.git
```

### 2. Navigate to Project Directory

```bash
cd Wanderlust-Project
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

Add the required environment variables used by your application:

- MongoDB Atlas connection string
- Session secret
- Cloudinary cloud name
- Cloudinary API key
- Cloudinary API secret
- Any additional API keys required by your configuration

Use the exact variable names referenced in `app.js` and `cloudConfig.js`.

### 5. Start the Application

```bash
node app.js
```

For development with Nodemon:

```bash
npx nodemon app.js
```

Open your browser and visit:

```text
http://localhost:8080
```

## 🔐 Security

- Environment variables are stored in `.env`.
- `.env` is excluded through `.gitignore`.
- Database credentials and API secrets should never be committed to GitHub.
- Authentication and authorization protect restricted operations.

## 📸 Screenshots

Screenshots of the application will be added here.

## 👨‍💻 Author

**KHITTARPAL RAJPOOT**

Software Engineer | Full Stack MERN Developer

- GitHub: https://github.com/Khittarpal-Rajput
- LinkedIn: https://www.linkedin.com/in/khittarpal-Rajpoot/
- LeetCode: https://leetcode.com/u/khittarpalRajpoot/
- Email: khittarpalrajoot@gmail.com

## 🎯 Project Purpose

This project was developed to gain practical experience in full-stack web development, database management, authentication, cloud image storage, and building real-world web applications.

---

⭐ If you find this project interesting, consider giving it a star!