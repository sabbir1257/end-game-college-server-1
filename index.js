require("dotenv").config()
const express = require("express")
const port = process.env.PORT || 5000
const app = express()
const cors = require("cors")
const morgan = require("morgan")
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.ihnyz1z.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const viewCollegeCollection = client.db("endGameCollege").collection("viewCollege");
    const myCollegeCollection = client.db("endGameCollege").collection("myCollege");
    const feedbackCollection = client.db("endGameCollege").collection("feedback");


    // College data home page
    app.get("/homeCollege", async (req, res) => {
      const homeCollege = await viewCollegeCollection.find().limit(3).toArray()
      res.send(homeCollege)
    })

    // College data get 
    app.get("/allCollege", async (req, res) => {
      const allCollege = await viewCollegeCollection.find().toArray()
      res.send(allCollege)
    })


    // View College Data get 
    app.get("/viewCollege/:id", async (req, res) => {
      const id = req.params.id
      console.log(id);
      const viewCollege = await viewCollegeCollection.findOne({ _id: new ObjectId(id) })
      console.log(viewCollege);
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

    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("College is running")
})
app.listen(port)