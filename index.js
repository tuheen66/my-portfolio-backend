require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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

    const userCollection = client.db("my-portfolio").collection("user");
    const projectCollection = client.db("my-portfolio").collection("projects");
    const messageCollection = client.db("my-portfolio").collection("message");
    const blogCollection = client.db("my-portfolio").collection("blogs");
    const skillCollection = client.db("my-portfolio").collection("skills");

    const experienceCollection = client
      .db("my-portfolio")
      .collection("experiences");

      async function addUser(email, password, role = "admin") {
        try {
          const userCollection = client.db("my-portfolio").collection("user");
      
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
      
          // Insert the user into the database
          const result = await userCollection.insertOne({
            email,
            password: hashedPassword,
            role,
          });
      
          console.log("User added successfully:", result.insertedId);
        } catch (error) {
          console.error("Error adding user:", error);
        }
      }
      addUser("hassan.monirul@gmail.com", "admin123");

    // skills section
    app.get("/skills", async (req, res) => {
      const skills = await skillCollection.find().toArray();
      res.send(skills);
    });

    app.post("/skills", async (req, res) => {
      const skill = req.body;
      const result = await skillCollection.insertOne(skill);
      res.send(result);
    });

    // projects section

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

    // message section

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

    // blog section

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

    // experiences section

    app.get("/experience", async (req, res) => {
      const experiences = await experienceCollection.find().toArray();
      res.send(experiences);
    });

    app.post("/experience", async (req, res) => {
      const experience = req.body;
      const result = await experienceCollection.insertOne(experience);
      res.send(result);
    });

    app.get("/experience/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await experienceCollection.findOne(query);
      res.send(result);
    });

    app.patch("/experience/:id", async (req, res) => {
      const id = req.params.id;
      const {
        position,
        company,
        companyDescription,
        startDate,
        endDate,
        duties,
      } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          position,
          company,
          companyDescription,
          startDate,
          endDate,
          duties,
        },
      };
      const result = await experienceCollection.updateOne(filter, updateDoc);
      res.send(result);
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
      try {
        const { email, password } = req.body;
    
        // Validate input
        if (!email || !password) {
          return res.status(400).json({ message: "Email and password are required" });
        }
    
        // Find user by email
        const user = await userCollection.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
    
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
        }
    
        // Ensure JWT_SECRET and EXPIRES_IN are defined
        if (!process.env.JWT_SECRET || !process.env.EXPIRES_IN) {
          return res.status(500).json({ message: "Server configuration error" });
        }
    
        // Generate JWT token
        const token = jwt.sign(
          { email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.EXPIRES_IN }
        );
    
        // Set cookie and respond
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
          })
          .json({
            success: true,
            message: "User successfully logged in!",
            accessToken: token,
          });
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
      }
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
