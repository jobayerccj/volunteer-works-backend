const express = require('express');
const app = express();
const port = 5000;

const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());

const dotenv = require('dotenv');
dotenv.config();
//console.log(`Your port is ${process.env.PORT}`); // 8626


app.get('/', (req, res) => {
    res.send('Hello World from nodemon')
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jobayer:"+process.env.DBPASSWORD+"@cluster0.wlizm.mongodb.net/volunteer-works?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const events = client.db("volunteer-works").collection("events");

    app.get('/events', (req, res) => {
        events.find({})
        .toArray((err, documents) => {
            console.log(err);
            res.status(200).send(documents);
        });
    })
    // perform actions on the collection object
    //client.close();
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});