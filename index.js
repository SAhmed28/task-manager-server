const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const port = process.env.PORT || 5000;

const app = express();

//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oplybtq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const taskCollection = client.db('taskManager').collection('tasks');

        app.get('/tasks', async(req,res) => {
            let query = {};

            console.log(req.query.status);

            if(req.query.status){
                query = {
                    status: req.query.status
                }
            }

            const users = await taskCollection.find(query).toArray();
            res.send(users);
        });

        // get user
        // app.get('/users/role/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email }
        //     const user = await usersCollection.findOne(query);
        //     console.log(user);
        //     res.send(user);
        // })



        // get task information and save it in database
        app.post('/task', async (req,res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        });


        // update task status: Complete/incomplete
        app.patch('/task/:id', async(req,res) => {
            const id = req.params.id;
            console.log(req.query.status);
            const query = { _id: ObjectId(id) }

            if(req.query.status == 'complete'){
                const updatedDoc = {
                    $set: {
                        status : 'complete'
                    }
                }
                
                const result = await taskCollection.updateOne(query, updatedDoc);
                res.send(result);
            }

            if(req.query.status == 'incomplete'){
                const updatedDoc = {
                    $set: {
                        status : 'incomplete'
                    }
                }
                
                const result = await taskCollection.updateOne(query, updatedDoc);
                res.send(result);
            }

            if(req.query.task){
                const updatedDoc = {
                    $set: {
                        task : req.query.task
                    }
                }

                const result = await taskCollection.updateOne(query, updatedDoc);
                res.send(result);
            }


            if(req.query.comment){
                const options = {upsert: true};
                const updatedDoc = {
                    $set: {
                        comment : req.query.comment
                    }
                }

                const result = await taskCollection.updateOne(query, updatedDoc, options);
                res.send(result);
            }
           
        });


        // update task info
        // app.patch('/taskEdit', async(req,res) => {
        //     const task = req.body;
        //     const id = task.id;
        //     console.log(task);
        //     const query = { _id: ObjectId(id) }
        //     // const options = {upsert: true};
        //     // const updatedDoc = {
        //     //     $set: {
        //     //         task : task
        //     //     }
        //     // }
        //     // const result = await taskCollection.updateOne(query, updatedDoc);
        //     // res.send(result);
        // });

        // task delete
        app.delete('/task/:id', async(req,res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result)
        })




        // app.post('/bookings', async(req,res) => {
        //     const booking = req.body;

        //     const query = {
        //         // email: booking.email,
        //         productName: booking.productName,
        //         productId: booking.productId 
        //     }

        //     const alreadyBooked = await bookingsCollection.find(query).toArray();

        //     if (alreadyBooked.length){
        //         const message = `${booking.productName} is already booked!`
        //         return res.send({acknowledged: false, message})
        //     }
                
        //     const result = await bookingsCollection.insertOne(booking);
        //     return res.send(result);
        // })


        // app.get('/category/:brand', async (req,res)=> {
        //     const brand = req.params.brand;
        //     // console.log(brand);
        //     const query = {productBrand: brand};
        //     const categoryProducts = await productsCollection.find(query).toArray();
        //     // console.log(categoryProducts);
        //     res.send(categoryProducts);
        // });


        // app.get('/products', async(req,res) => {
        //     let query = {};
        //     if(req.query.email){
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     else if(req.query.isAdvertise){
        //         query = {
        //             isAdvertise: req.query.isAdvertise
        //         }
        //         // console.log(query)

        //     }
        //     const products = await productsCollection.find(query).toArray();
        //     res.send(products);
        // })

        // app.post('/products', async (req,res) => {
        //     const product = req.body;
        //     const result = await productsCollection.insertOne(product);
        //     res.send(result);
        // });

        // // patch  because I want to update it only if it is existing
        // app.patch('/products/:id', async(req,res) => {
        //     const id = req.params.id;
        //     // console.log(id);
        //     const query = { _id: ObjectId(id) }
        //     const options = {upsert: true};
        //     const updatedDoc = {
        //         $set: {
        //             isAdvertise : 'true'
        //         }
        //     }
        //     const result = await productsCollection.updateOne(query, updatedDoc, options);
        //     res.send(result);
        // })

        // // product delete
        // app.delete('/products/:id', async(req,res) => {
        //     const id = req.params.id;
        //     const filter = {_id : ObjectId(id) };
        //     const result = await productsCollection.deleteOne(filter);
        //     res.send(result)
        // })
    }
    finally{

    }
}
run().catch(console.log);

app.get('/', async(req,res) => {
    res.send("Task Manager server is running");
})


app.listen(port, () => console.log(`Task Manager server is running on ${port}`))