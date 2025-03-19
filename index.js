require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", ],
  })
);
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const userCollection = client.db("my-portfolio").collection("users");
    const projectCollection = client.db("my-portfolio").collection("projects");
    const messageCollection = client.db("my-portfolio").collection("message");
    const blogCollection = client.db("my-portfolio").collection("blogs");
    const skillCollection = client.db("my-portfolio").collection("skills");
    const experienceCollection = client
      .db("my-portfolio")
      .collection("experiences");

    app.get("/skills", async (req, res) => {
      const skills = await skillCollection.find().toArray();
      res.send(skills);
    });

    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectCollection.findOne(query);
      res.send(result);
    });

    app.get("/projects", async (req, res) => {
      const projects = await projectCollection.find().toArray();
      res.send(projects);
    });

    app.post("/projects", async (req, res) => {
      const project = req.body;
      const result = await projectCollection.insertOne(project);
      res.send(result);
    });

    app.patch("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const {
        title,
        sub_title,
        image,
        full_image,
        technologies,
        features,
        live_link,
      } = req.body;

      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          title,
          sub_title,
          image,
          full_image,
          technologies,
          features,
          live_link,
        },
      };
      const result = await projectCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/message", async (req, res) => {
      const message = await messageCollection.find().toArray();
      res.send(message);
    });

    app.post("/message", async (req, res) => {
      const message = req.body;
      const result = await messageCollection.insertOne(message);
      res.send(result);
    });

    app.delete("/message/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await messageCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const blogs = await blogCollection.find().toArray();
      res.send(blogs);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      const result = await blogCollection.insertOne(blog);
      res.send(result);
    });

    app.patch("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const { blog, title, author, image, category } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title,
          author,
          image,
          category,
          blogContent,
        },
      };
      const result = await blogCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    });

    // experiences

    app.get("/experience", async (req, res) => {
      const experiences = await experienceCollection.find().toArray();
      res.send(experiences);
    });

    // User Registration
    app.post("/register", async (req, res) => {
      const { username, email, password } = req.body;

      // Check if email already exists
      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exist!!!",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      await collection.insertOne({
        username,
        email,
        password: hashedPassword,
        role: "user",
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully!",
      });
    });

    // User Login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await userCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );

      res.json({
        success: true,
        message: "User successfully logged in!",
        accessToken: token,
      });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Portfolio Server is running smoothly",
  };
  res.json(serverStatus);
});
