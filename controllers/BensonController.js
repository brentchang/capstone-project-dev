const {
    axios,
    path,
    mysql2,
    fs
} = require('../config/dependencies');
const {
    "views-path-config": viewPaths,
    "database-config": databaseConfig,
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

    res.render(fpath,  { username: req.session.username });
};

// access: /logout
const getLogOutAction = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}

// operation: log in
const postLoginAction =  async (req, res) =>  {
    const name = req.body.name;
    const pass = req.body.password;
    const users = await getUserByUserName(name);
    console.log("-------users ------------: ");
    console.log(users);

    if( pass == users.password){
        console.log('login success.');
        req.session.username = name;
        req.session.userLoggedIn = true;
        res.redirect('/order-list');
    }else{
        res.redirect('/login');
    }
}


const pool = mysql2.createPool({
    host: databaseConfig['localhost'],
    user: databaseConfig['username'],
    password: databaseConfig['password'],
    database: databaseConfig['database']
}).promise();

async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user")
    return rows;
}

async function getUserByUserName(uname) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM user
    WHERE username = ?
    `, [uname])
    return rows[0]
  }

module.exports = {
    getLoginPageAction,
    getLandingPageAction,
    getOrderListPageAction,
    getLogOutAction,
    postLoginAction
}