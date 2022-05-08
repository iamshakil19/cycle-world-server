const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvyxp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('assignment11').collection('products')

        // inventories api
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const products = await cursor.toArray();
            res.send(products)
        })

        // single inventory api
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product)
        })

        // update api
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInventory = Number(req.body.quantity)
            console.log(id, updatedInventory);
            const filter = { _id: ObjectId(id) }

            const updateDoc = {
                $inc: {
                    quantity: +updatedInventory
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // delivery api
        app.put('/delivery/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $inc: {
                    quantity: -1
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        //post api
        app.post('/products', async (req, res) => {
            const newInventory = req.body;
            console.log("adding new user", newInventory);
            const result = await productCollection.insertOne(newInventory);
            res.send(result);
        })

        // delete api
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('assignment11 server is running')
})
app.listen(port, () => {
    console.log("Running at port number", port);
})
