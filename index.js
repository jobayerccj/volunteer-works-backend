const express = require('express');
const app = express();
const port = 5000;

const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
const ObjectId = require('mongodb').ObjectId;

const dotenv = require('dotenv');
dotenv.config();


app.get('/', (req, res) => {
    res.send('Hello World from nodemon')
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jobayer:"+process.env.DBPASSWORD+"@cluster0.wlizm.mongodb.net/volunteer-works?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const events = client.db("volunteer-works").collection("events");
    const registeredEvents = client.db("volunteer-works").collection("registeredUsers");

    app.get('/events', (req, res) => {
        events.find({})
        .toArray((err, documents) => {
            console.log(err);
            res.status(200).send(documents);
        });
    });

    app.post('/addEventRegistration', (req, res)=>{

        const newRegistration = req.body;
        registeredEvents.insertOne(newRegistration)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    app.get('/registeredevents', (req, res) => {
        //console.log(req.header('email'));
        registeredEvents.find({ email: req.header('email')})
            .toArray((err, documents) => {
                res.status(200).send(documents);
            });
    });

    app.delete('/deleteregistration/:id', (req, res) =>{
        registeredEvents.deleteOne({_id: ObjectId(req.params.id)})
            .then( result => {
                res.send(result.deletedCount > 0);
            })
    });

    app.get('/admin', (req, res) => {
        //console.log(req.header('email'));
        registeredEvents.find({})
            .toArray((err, documents) => {
                res.status(200).send(documents);
            });
    });

    app.post('/addEvent', (req, res)=>{

        const newEvent = req.body;
        events.insertOne(newEvent)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    // perform actions on the collection object
    //client.close();
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`app listening at http://localhost:${port}`)
});