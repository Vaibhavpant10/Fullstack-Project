const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Note = require("./models/Note");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "mysecret123";




const app = express();

app.use(express.json());
const cors = require("cors");

app.use(cors({
  origin: "*"
}));


mongoose.connect("mongodb://127.0.0.1:27017/fullstackDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.json({ message: "Access denied. No token." });
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch {
    res.json({ message: "Invalid token" });
  }
}




app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ message: "All fields required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

  


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { userId: user._id },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return res.json({ 
    message:"login successful",
    token });
});




// const { title, content, userId } = req.body;
// if error come so we past this code -- 
// const body = req.body || {};

//console.log("BODY:", body);
//const title = body.title;
//const content = body.content;
//const userId = body.userId;





app.post("/add-note", auth, async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const body = req.body || {};

    const title = body.title;
    const content = body.content;
    const userId = body.userId;

    if (!title || !content || !userId) {
      return res.json({ message: "Missing fields" });
    }

    await Note.create({
      title,
      content,
      userId
    });

    res.json({ message: "Note added successfully" });

  } catch (err) {
    console.log("ADD NOTE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



app.get("/notes/:userId", auth,async (req, res) => {
  const notes = await Note.find({ userId: req.params.userId })
    .populate("userId");

  res.json(notes);
});


app.get("/delete-note/:noteId",auth,async(req,res)=>{
  await Note.findByIdAndDelete(req.params.noteId);

  res.json({message: "Note deleted successfully"});
});


app.put("/update-note/:noteId", auth,async (req, res) => {
  const { title, content } = req.body;

  await Note.findByIdAndUpdate(
    req.params.noteId,
    { title, content }
  );

  res.json({ message: "Note updated successfully" });
});



app.get("/", (req, res) => {
  res.send("Backend working");
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});

