const express = require('express');
const path = require('path');
const session = require('express-session');

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


myApp.get('/', async function(req,res){
    console.log('-------------into home???');
    res.render("landingPage" );
});

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

    if(name == 'benson' & pass == '1234'){
        console.log('login success.');
        req.session.username = 'benson';
        req.session.userLoggedIn = true;
            
        res.render("orderListPage", {});
    }else{
        res.render("login", {});
    }
    
})

myApp.listen(5111, function(){
    console.log('---------------------- start up ok, please visit  localhost:5111.');
});