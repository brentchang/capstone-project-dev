const {
    axios,
    path,
    mysql2,
    fs
} = require('../config/dependencies');
const {
    "views-path-config": viewPaths,
    "database-config": databaseConfig,
    "WebServerBaseURL": webServerBaseURL,
    "APIServerBaseURL": apiServerBaseURL,
    "api-url-config": apiUrls
} = require('../config/config.json');

// access: /login
const getLoginPageAction = (req, res) => {
    req.session.username = req.body.username;
    const loginPage = viewPaths.login;
    const fpath = path.join(__dirname, loginPage);

    res.render(fpath, {});
};

// access: /landing
const getLandingPageAction = async (req, res) => {
    try {
        // 获取数据
        // 1）username
        const username = req.session.username;
        // 2）当前天气数据
        let respose = await axios.get(apiServerBaseURL + apiUrls["get-current-weather"]);
        const currentWeather = respose.data.currentWeather;

        const landingPage = viewPaths.landing;
        const fpath = path.join(__dirname, landingPage);

        res.render(fpath, {
            username : username,
            currentWeather : currentWeather
        });
    } catch (error) {
        console.error("Error fetching data to landing page:", error);
        res.status(500).send("Internal Server Error");
    }
};

// access: /order-list
const getOrderListPageAction = async (req, res) => {
    const orderListPage = viewPaths.orderList;
    const fpath = path.join(__dirname, orderListPage);
    // if user is not logged in, redirect to login page
    if (!req.session.userLoggedIn) {
        res.redirect('/login');
        return;
    }
    const activeOrder = await getActiveOrder(req.session.username)
   // console.log(activeOrder);

    

    const pastOrders = await getPastOrders(req.session.username)
    console.log(pastOrders);

    res.render(fpath,  {    username: req.session.username ,
                            activeOrder : activeOrder, 
                            pastOrders : pastOrders 
                       });
};

// access: /logout
const getLogOutAction = (req, res) => {
    req.session.destroy();
    res.redirect('/');
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

  async function getActiveOrder(uname) {
    const [rows] = await pool.query(`
    SELECT conestoga_provincial_park_test.order.*, trail.* , 
    DATE_FORMAT(conestoga_provincial_park_test.order.from_date, "%b. %d, %Y") AS date_str ,
    DATEDIFF(conestoga_provincial_park_test.order.to_date, conestoga_provincial_park_test.order.from_date) AS days
    FROM user 
    left join user_order on user_order.user_id = user.id
    left join conestoga_provincial_park_test.order on user_order.order_id = conestoga_provincial_park_test.order.id
    left join trail on trail.id = conestoga_provincial_park_test.order.trail_id
    WHERE user.username = ? and conestoga_provincial_park_test.order.status_code = 0
    `, [uname])
    return rows[0]
  }

  async function getPastOrders(uname) {
    const [rows] = await pool.query(`
    SELECT conestoga_provincial_park_test.order.*, trail.* , 
    DATE_FORMAT(conestoga_provincial_park_test.order.from_date, "%b. %d, %Y") AS date_str ,
    DATEDIFF(conestoga_provincial_park_test.order.to_date, conestoga_provincial_park_test.order.from_date) AS days
    FROM user 
    left join user_order on user_order.user_id = user.id
    left join conestoga_provincial_park_test.order on user_order.order_id = conestoga_provincial_park_test.order.id
    left join trail on trail.id = conestoga_provincial_park_test.order.trail_id
    WHERE user.username = ? and conestoga_provincial_park_test.order.status_code = 1
    `, [uname])
    return rows
  }

module.exports = {
    getLoginPageAction,
    getLandingPageAction,
    getOrderListPageAction,
    getLogOutAction,
    postLoginAction
}