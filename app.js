
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB URL
const dbUrl = process.env.ATLASDB_URL;

// Check environment variables
if (!dbUrl) {
    console.error("ERROR: ATLASDB_URL is missing in .env file");
    process.exit(1);
}

if (!process.env.SECRET) {
    console.error("ERROR: SECRET is missing in .env file");
    process.exit(1);
}

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Session Store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

// Session store error handling
store.on("error", (err) => {
    console.error("ERROR IN MONGO SESSION STORE:", err);
});

// Session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true, // Enable HTTPS in production
    },
};

// Session and Flash
app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages and logged-in user
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Listings routes
app.use("/listings", listingRouter);

// Reviews routes
app.use("/listings/:id/reviews", reviewRouter);

// User routes
app.use("/", userRouter);

// 404 error handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// General error handler
app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = "Something went wrong!",
    } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// MongoDB connection and server startup
async function main() {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
}

main().catch((err) => {
    console.error("MongoDB connection error:", err);
});
