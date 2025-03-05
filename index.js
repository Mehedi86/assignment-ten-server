require('dotenv').config();
const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kpht8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const topGameCollection = client.db('gameDB').collection('games');
        const reviewCollection = client.db('reviewDB').collection('reviews');
        const watchListCollection = client.db('watchlistDB').collection('watchlist')

        // app.post('/games', async(req, res)=>{
        //     const games = req.body;
        //     const result = await topGameCollection.insertOne(games);
        //     res.send(result)
        // })
        app.get('/games', async (req, res) => {
            const cursor = topGameCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/games/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await topGameCollection.findOne(query);
            res.send(result);
        })

        app.post('/addReview', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result)
        })

        app.post('/myWatchlist', async (req, res) => {
            const watchlist = req.body;
            const result = await watchListCollection.insertOne(watchlist);
            res.send(result)
        })

        app.get('/myWatchlist/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await watchListCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollection.findOne(query);
            res.send(result)
        })

        app.get('/reviews/yourReview/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const result = await reviewCollection.find(query).toArray();
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("This is running server of assignment 10 server")
})

app.listen(port, () => {
    console.log(`The server is running in port number ${port}`)
})


// chill-gamer-db
// T8Z2XJnaRrOu646l