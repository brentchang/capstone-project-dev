const {
    express,
    bodyParser,
    cors,
    session,
    fileUpload,
    mysql2
} = require('./config/dependencies.js'); // import dependencies 

// add environment support for dev and prod
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';
// const envConfig = config[env];
const finalConfig = {
    ...config['shared'],
    ...config[env]
}

console.log(`Environment: ${env}`);

// create servers
const webServer = express();
const APIServer = express();

// mount the static resources
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

webServer.use((req, res, next) => {
    if (req.session.username) {
        res.locals.username = req.session.username;
    } else {
        res.locals.username = null;
    }
    next();
});
console.log(`webServerBaseURL: ${finalConfig['WebServerBaseURL']}`);
webServer.use(express.json());
// CORS registration
APIServer.use(cors({
    origin: [
        finalConfig['WebServerBaseURL'],
    ]
}))

// connect the DB and export the connection 
const connection = mysql2.createConnection({
    host: finalConfig["databaseConfig"]["host"],
    user: finalConfig["databaseConfig"]["user"],
    password: finalConfig["databaseConfig"]["password"],
    database: finalConfig["databaseConfig"]["database"]
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

console.log(`webServerPortsConfig: ${finalConfig['portsConfig']['webServerPort']}`);
console.log(`apiServerPortsConfig: ${finalConfig['portsConfig']['apiServerPort']}`);
console.log(`webServerBaseURL: ${finalConfig['WebServerBaseURL']}`);
console.log(`apiServerBaseURL: ${finalConfig['APIServerBaseURL']}`);

// launch the app server
webServer.listen(finalConfig['portsConfig']['webServerPort'], () => {
    console.log(`Project Web Server is running at ${finalConfig['WebServerBaseURL']}`);
})
APIServer.listen(finalConfig['portsConfig']['apiServerPort'], () => {
    console.log(`API Server is running at ${finalConfig['APIServerBaseURL']}`);
})

