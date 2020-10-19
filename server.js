const express = require('express');
const stripe = require('stripe')('sk_test_51HdtpaEnh1UV5uiPwkoMIGoCyOJlGhcuKZg8m0DN9EvwSzJPTOGZ8n5JAFRHmLNV2tBWMTbMBfAkYeTpHt54M92P005MZTpVl0')
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//Handel bars middlewares

app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static folder
app.use(express.static(`$(__dirname)/public`));


// Index route

app.get('/',(req,res)=>{
    res.render('index');
})
//Charge Route
app.post('/charge',(req,res)=>{
    const amount = 2500;
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken,
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {

        return stripe.charges.create({
            amount: 2500,     // Charing Rs 25 
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then(charge => res.render('success'))
    .catch(function (err) {
        console.log(err)
        res.status(500).end()
    })

})

// app.post('/payment', function (req, res) {

//     // Moreover you can take more details from user 
//     // like Address, Name, etc from form 
//     stripe.customers.create({
//         email: req.body.stripeEmail,
//         source: req.body.stripeToken,
//         name: 'Gourav Hammad',
       
//     })
//         .then((customer) => {

//             return stripe.charges.create({
//                 amount: 2500,     // Charing Rs 25 
//                 description: 'Web Development Product',
//                 currency: 'INR',
//                 customer: customer.id
//             });
//         })
//         .then((charge) => {
//             res.send("Success")  // If no error occurs 
//         })
//         .catch((err) => {
//             res.send(err)       // If some error occurs 
//         });
// })



const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})