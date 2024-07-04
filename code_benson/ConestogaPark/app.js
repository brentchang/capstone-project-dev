const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/finalexam');
const session = require('express-session');

const AdminModel = mongoose.model('Admin',{
    name: String,
    pass: String    
} );


const GiftCardModel = mongoose.model('GiftCard',{
    imgpath: String,
    price: String   ,
    description : String 
} );


var myApp = express();
myApp.use(express.urlencoded({extended:false}));
myApp.use(session({
    secret: 'fsfsef',
    resave: false,
    saveUninitialized: true
}));

myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.use("/css", express.static(__dirname + "public/css"));
myApp.use("/images", express.static(__dirname + "public/images"));
myApp.set('view engine', 'ejs');
// myApp.get('/', function(req, res){
//     console.log("-------------into this ");
//     res.render("home", {aaa:"noen"});
// });

myApp.get('/', async function(req,res){
    console.log('-------------into home???');
    const cardList =  await GiftCardModel.find({});
    console.log(cardList);
    res.render("landingPage" );
});


myApp.get('/add', function(req,res){
    console.log(req.session.userLoggedIn);
    if( req.session.userLoggedIn){
        res.render('add')
    }else{
        res.redirect("/login");
    }
})

myApp.post('/add', function(req,res){
    const imgpath =  req.body.imgpath;
    const price =  req.body.price;
    const description =  req.body.description;

     console.log(imgpath);
     console.log(price);
     console.log(description);
    if( req.session.userLoggedIn){
      const card =  new GiftCardModel({
        imgpath : imgpath,
        price : price,
        description : description
       });
       card.save();
       res.render("add",{msg: 'added success.'});
    }else{
        res.redirect("/login");
    }
})



myApp.get('/login', function(req,res){
    res.render("loginPage", {});
})


myApp.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect('/');
});

myApp.post('/login', function(req,res){
    const name = req.body.name;
    const pass = req.body.password;

    console.log(name);
    console.log(pass);

    if(name == 'benson' & pass == '1234'){
        console.log('login success.');
        req.session.username = 'benson';
        req.session.userLoggedIn = true;
            
        res.render("orderListPage", {cardList : []});
    }else{
        res.render("login", {});
    }
    
})






myApp.listen(5111, function(){
    console.log('---------------------- working well');
});