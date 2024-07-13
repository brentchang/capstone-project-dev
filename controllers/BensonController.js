const {
    axios,
    path,
    fs
} = require('../config/dependencies');
const {
    "views-path-config": viewPaths,
    "api-urls-config": APIs
} = require('../config/config.json');

// access: /login
const getLoginPageAction = (req, res) => {
    const loginPage = viewPaths.login;
    const fpath = path.join(__dirname, loginPage);

    res.render(fpath, {});
};

// access: /landing
const getLandingPageAction = (req, res) => {
    const landingPage = viewPaths.landing;
    const fpath = path.join(__dirname, landingPage);

    res.render(fpath, {});
};

// access: /order-list
const getOrderListPageAction = (req, res) => {
    const orderListPage = viewPaths.orderList;
    const fpath = path.join(__dirname, orderListPage);

    res.render(fpath, {});
};

// access: /logout
const getLogOutAction = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}

// operation: log in
const postLoginAction = (req, res) =>  {
    const name = req.body.name;
    const pass = req.body.password;

    if(name == 'benson' & pass == '1234'){
        console.log('login success.');
        req.session.username = 'benson';
        req.session.userLoggedIn = true;
            
        res.redirect('/order-list');
    }else{
        res.redirect('/login');
    }
}

module.exports = {
    getLoginPageAction,
    getLandingPageAction,
    getOrderListPageAction,
    getLogOutAction,
    postLoginAction
}