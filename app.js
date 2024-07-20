const {
    express,
    bodyParser,
    cors,
    session,
    fileUpload,
    mysql2
} = require('./config/dependencies.js'); // import dependencies 
const {
    "database-config": databaseConfig,
    "ports-config": ports
} = require('./config/config.json')

// create servers
const webServer = express();
const APIServer = express();

// mount the static resourses
webServer.use(express.static('./public'));

// use middleware
webServer.use(bodyParser.urlencoded({ extended: true })); // parse form submit data
webServer.use(express.json()); // parse json data
APIServer.use(bodyParser.urlencoded({ extended: true })); // parse form submit data
APIServer.use(express.json()); // parse json data
APIServer.use(fileUpload()); // file upload and no file size limit
webServer.use(session({
    secret: 'my_secret_key', // signature to cookie related to session id
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60000 * 60 // ms => 1 hour
    }
}))

// CORS registration
APIServer.use(cors({
    origin: [
        `http://127.0.0.1:${ports.webServerPort}`,
        `http://localhost:${ports.webServerPort}`
    ]
}))

// connect the DB and export the connection 
const connection = mysql2.createConnection({
    host: databaseConfig['localhost'],
    user: databaseConfig['username'],
    password: databaseConfig['password'],
    database: databaseConfig['database']
});
connection.connect(error => {
    if (error) {
        return console.error('Error connecting to the database: ' + error.message);
    }
    console.log('Connected to the MySQL server.');
});
module.exports = {
    connection
}

// routers registration
const loginPageRouter = require('./routers/router.js');
webServer.use(loginPageRouter); // register login page router
const APIs = require('./routers/APIs.js');
APIServer.use('/api', APIs); // register API routers

// launch the app server
webServer.listen(ports.webServerPort, () => {
    console.log(`Project Web Server is running at http://127.0.0.1:${ports.webServerPort}`);
})
APIServer.listen(ports.apiServerPort, () => {
    console.log(`API Server is running at http://127.0.0.1:${ports.apiServerPort}`);
})

