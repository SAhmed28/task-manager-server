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


       

        // task delete
        app.delete('/task/:id', async(req,res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.log);

app.get('/', async(req,res) => {
    res.send("Task Manager server is running");
})


app.listen(port, () => console.log(`Task Manager server is running on ${port}`))