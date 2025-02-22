const dotenv = require('dotenv');
dotenv.config();
const express= require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override')

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Fruit = require("./models/fruit")

//middleware - helps hanle the request body of the form
app.use(express.urlencoded({extended: false}));

app.use(methodOverride('_method'));
app.use(morgan('dev'));


//get route to landing page i think
app.get('/', async (req,res) => {
    res.render('index.ejs');
});


//GET to /fruits * use a res.send to the page to make sure the connection works before res.render
app.get('/fruits', async (req,res) =>{
    const allFruits = await Fruit.find(); //this route when requested gets all the fruits now
    // console.log(allFruits) //this is to check in the console if it does
   res.render('fruits/index.ejs', {fruits: allFruits})
})

//Get to /create a new fruit page with the submit button
app.get('/fruits/new', (req,res) => {
    res.render('fruits/new.ejs');
});


//submit posts the req.body 
app.post('/fruits', async (req,res) => {
    if (req.body.isReadyToEat === 'on'){
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect('/fruits')
})



//GET route to fruitID
app.get('/fruits/:fruitId',async (req,res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render('fruits/show.ejs', {fruit:foundFruit});
});

//DELETE fruit route 
app.delete('/fruits/:fruitId', async (req,res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect('/fruits')
})


//edit (update) fruit route

app.get('/fruits/:fruitId/edit', async (req, res) => {
   const foundFruit = await Fruit.findById(req.params.fruitId);
   res.render('fruits/edit.ejs', { fruit: foundFruit});
});

app.put('/fruits/:fruitId', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true
    } else {
        req.body.isReadyToEat = false
    };
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
    res.redirect(`/fruits/${req.params.fruitId}`);
 });

app.listen(3000, () => {
    console.log('Listening on port 3000');
});