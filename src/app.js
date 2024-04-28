const express = require("express");
const path = require("path");
const app = express();
const subscriberModel = require("./models/subscribers");
const staticPath = path.join(__dirname, "../public");

// Middleware to parse JSON bodies
app.use(express.json());

// Serving static files
app.use(express.static(staticPath));

// POST endpoint to create a new subscriber
app.post("/api/subscribers", async (req, res) => {
  try {
    const { name, subscribedChannel, subscribedDate } = req.body;
    const newSubscriber = new subscriberModel({
      name,
      subscribedChannel,
      subscribedDate,
    });
    await newSubscriber.save();
    res.status(201).json({
      message: "Subscriber created successfully",
      data: newSubscriber,
    });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    res.status(500).json({ error: "Failed to create subscriber" });
  }
});

// GET endpoint to fetch all subscribers
app.get("/api/subscribers", async (req, res) => {
  try {
    const subs = await subscriberModel.find();
    res.status(200).json(subs);
  } catch (error) {
    res.status(400).json({
      error: "Bad Request",
    });
  }
});

// GET endpoint to fetch subscriber names and channels
app.get("/api/subscribers/names", async (req, res) => {
  try {
    const subs = await subscriberModel.find(
      {},
      { _id: 0, name: 1, subscribedChannel: 1 }
    );
    res.status(200).json(subs);
  } catch (error) {
    res.status(400).json({
      error: "Bad Request",
    });
  }
});

// GET endpoint to fetch subscriber by ID
app.get("/api/subscribers/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const subs = await subscriberModel.findById(id);
    res.status(200).json(subs);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = app;

//===============================================================
// const express = require("express");
// const bodyParser = require("body-parser"); // Import body-parser middleware
// const mongoose = require("mongoose"); // Import mongoose

// const app = express();
// const port = 3000;

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/my_database", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// // Define a Mongoose schema for the data
// const subscriberSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });
// const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// // Define a POST mapping API endpoint
// app.post("/api/subscribers", async (req, res) => {
//   try {
//     // Extract data from request body
//     const { name, email } = req.body;

//     // Create a new subscriber document
//     const newSubscriber = new Subscriber({ name, email });

//     // Save the new subscriber to the database
//     await newSubscriber.save();

//     // Send a success response
//     res.status(201).json({
//       message: "Subscriber created successfully",
//       data: newSubscriber,
//     });
//   } catch (error) {
//     // Handle errors
//     console.error("Error creating subscriber:", error);
//     res.status(500).json({ error: "Failed to create subscriber" });
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
