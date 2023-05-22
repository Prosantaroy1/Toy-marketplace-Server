const express = require('express')
const app = express()
const port =  process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

//Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Toys Car Project Start')
})



//Mongodb Start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.atafojn.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    //
     const productCollection = client.db('Toy-Car').collection('product');
    //Post data Server
    app.post('/product', async(req, res)=>{
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result)     
    })
    //all data get
    app.get('/product', async(req, res)=>{
        const result =await productCollection.find().toArray();
        res.send(result)
    })
    ///data Get server
    app.get('/product/:subCategory', async(req, res)=>{
            //console.log(req.query)
           if(req.params.subCategory == 'truck' || req.params.subCategory == 'sports car' || req.params.subCategory == 'regular car'){
              const result = await productCollection.find({subCategory : req.params.subCategory}).toArray();
              res.send(result);
              //console.log(result)
           }
    })
    //get data user email
    app.get('/product', async(req, res)=>{
         //
         let query = {};
         if(req.query?.email){
           query ={email: req.query.email}
         }
         const result = await productCollection.find(query).toArray();
         res.send(result)
    })
    //MyCar deleted
    app.delete('/product/:id', async(req, res)=>{
        const id = req.params.id;
      //  console.log(id)
         const query ={_id: new ObjectId(id)};
       //  console.log(query)
        const result = await productCollection.deleteOne(query);
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})