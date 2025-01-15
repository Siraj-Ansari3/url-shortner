const express = require("express");
const path = require('path')
const cookieParser = require("cookie-parser");

const { connectToMongoDB } = require("./connect");
const { restrictToLoggedInUserOnly, checkAuth} = require("./middlewares/auth");

const staticRoute = require('./routes/staticRouter')
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const URL = require("./models/url");

const PORT = 8001;
const app = express();


// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/shortURL")
    .then(() => console.log("MONGODB CONNECTED."));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

// Register routes with correct path prefix
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        },
        {
            $push: {
                visitHistory: { timestamps: Date.now() }
            },
        },
    )
    return res.redirect(entry.redirectURL)
})

app.listen(PORT, () => console.log("Server started on port", PORT));
