const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addUser(email, plainPassword, role = "user") {
  try {
    await client.connect();
    const userCollection = client.db("my-portfolio").collection("user");

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Insert the user into the database
    const result = await userCollection.insertOne({
      email,
      password: hashedPassword,
      role,
    });

    console.log("User added successfully:", result.insertedId);
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    await client.close();
  }
}

module.exports = { addUser };