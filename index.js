const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k3kfh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        console.log('database connected');
        const serviceCollection = client.db('doctors_portal').collection('services');
        const bookingCollection = client.db('doctors_portal').collection('bookings');
        const userCollection = client.db('doctors_portal').collection('users');

        app.get('/service', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });


        // app.get('/user',  async (req, res) => {
        //   const users = await userCollection.find().toArray();
        //   res.send(users);
        // });

        // app.put('/user/:email', async (req, res) => {
        //   const email = req.params.email;
        //   const user = req.body;
        //   const filter = { email: email };
        //   const options = { upsert: true };
        //   const updateDoc = {
        //     $set: user,
        //   };
        //   const result = await userCollection.updateOne(filter, updateDoc, options);
        //   const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
        //   res.send({ result, token });
        // })

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient }
            const exists = await bookingCollection.findOne(query);
            if (exists) {
              return res.send({ success: false, booking: exists })
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({ success: true, result });
          })


    }
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Dentist!')
  })
  
  app.listen(port, () => {
    console.log(`Doctors App listening on port ${port}`)
  })