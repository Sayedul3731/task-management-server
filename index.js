const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(express.json())
app.use(cors())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvnw110.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const toDoListsCollection = client.db("taskDB").collection("toDoLists")
    const onGoingListsCollection = client.db("taskDB").collection("onGoingLists")
    const completeListsCollection = client.db("taskDB").collection("completeLists")
    const personalTasksCollection = client.db("taskDB").collection("personalTasks")

    app.post("/newTask", async (req, res) => {
        const newTask = req.body;
        console.log(newTask);
        const result = await personalTasksCollection.insertOne(newTask)
        res.send(result)
    })
    app.get("/toDoTasks/:email", async(req,res) => {
        const result = await personalTasksCollection.find({email: req.params.email}).toArray()
        res.send(result)
    })
    app.get("/personalTasks/:email", async(req,res) => {
        const result = await personalTasksCollection.find({email: req.params.email}).toArray()
        res.send(result)
    })
 
    app.get("/onGoingTasks/:email", async(req,res) => {
        const result = await onGoingListsCollection.find({email: req.params.email}).toArray()
        res.send(result)
    })
 
    app.get("/completedTasks/:email", async(req,res) => {
        const result = await completeListsCollection.find({email: req.params.email}).toArray()
        res.send(result)
    })
    app.delete("/toDo/:id", async(req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
        const result = await toDoListsCollection.deleteOne(query)
        res.send(result)
    })
    app.delete("/newTask/:id", async(req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
        const result = await personalTasksCollection.deleteOne(query)
        res.send(result)
    })
    app.delete("/onGoing/:id", async(req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
        const result = await onGoingListsCollection.deleteOne(query)
        res.send(result)
    })
    app.delete("/complete/:id", async(req,res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
        const result = await completeListsCollection.deleteOne(query)
        res.send(result)
    })

    app.patch('/newTask/:id', async(req, res) => {
      const id = req.params.id
      const newInfo = req.body;
      const updateDoc = {
          $set: {
            title: newInfo?.title,
            description: newInfo?.description,
            deadline: newInfo?.deadline,
            priority: newInfo?.priority
          }
      }
      console.log('update id & newInfo', id, newInfo);
      const filter = {_id: new ObjectId(id)}
      const result = await personalTasksCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.patch('/toDo/:id', async(req, res) => {
      const id = req.params.id
      const newInfo = req.body;
      const updateDoc = {
          $set: {
            task: newInfo.toDoUpdateTask
          }
      }
      console.log('update id & newInfo', id, newInfo);
      const filter = {_id: new ObjectId(id)}
      const result = await toDoListsCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    app.patch('/onGoing/:id', async(req, res) => {
      const id = req.params.id
      const newInfo = req.body;
      const updateDoc = {
          $set: {
            task: newInfo.onGoingUpdateTask
          }
      }
      console.log('update id & newInfo', id, newInfo);
      const filter = {_id: new ObjectId(id)}
      const result = await onGoingListsCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    app.patch('/complete/:id', async(req, res) => {
      const id = req.params.id
      const newInfo = req.body;
      const updateDoc = {
          $set: {
            task: newInfo.completeUpdateTask
          }
      }
      console.log('update id & newInfo', id, newInfo);
      const filter = {_id: new ObjectId(id)}
      const result = await completeListsCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
 

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task manager is running...')
})

app.listen(port, () => {
    console.log(`Task manager is running on port ${port}`)
})