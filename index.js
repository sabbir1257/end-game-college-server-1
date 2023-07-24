const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.ihnyz1z.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const homeCollegeCollection = client.db("endGameCollege").collection("homeCollege");
    const collegeCollection = client.db("endGameCollege").collection("college");
    const myCollegeCollection = client.db("endGameCollege").collection("myCollege");
    const feedbackCollection = client.db("endGameCollege").collection("feedback");


    app.get("/homeCollege", async (req, res) => {
      const homeCollege = await homeCollegeCollection.find().toArray()
      res.send(homeCollege)
    })


    app.get("/college", async (req, res) => {
      const college = await collegeCollection.find().toArray()
      res.send(college)
    })

    // View College Data get 
    app.get("/viewCollege/:id", async (req, res) => {
      const id = req.params.id
      const viewCollege = await collegeCollection.findOne({ _id: new ObjectId(id) })
      res.send(viewCollege)
    })

    // My College data get 
    app.get("/myCollege", async (req, res) => {
      const myCollege = await myCollegeCollection.find({ email: req.query.email }).toArray()
      res.send(myCollege)
    })

    // My College Post data 
    app.post("/myCollege", async (req, res) => {
      const data = req.body
      const result = await myCollegeCollection.insertOne(data)
      res.send(result)
    })

    // Feedback get data 
    app.get("/feedback", async (req, res) => {
      const feedback = await feedbackCollection.find().limit(10).toArray()
      res.send(feedback)
    })

    // Feedback post data 
    app.post("/feedback", async (req, res) => {
      const data = req.body
      const result = await feedbackCollection.insertOne(data)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("College is running");
});

app.listen(port, () => {
  console.log(`College server is running port ${port}`);
});

