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
const {
    "database-config": databaseConfig,
    "ports-config": ports,
    "WebServerBaseURL" : WebServerBaseURL,
    "APIServerBaseURL" : APIServerBaseURL,
} = config[env];

console.log(`Environment: ${env}`);

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

webServer.use((req, res, next) => {
    if (req.session.username) {
      res.locals.username = req.session.username;
    } else {
      res.locals.username = null;
    }
    next();
  });

  webServer.use(express.json());

// CORS registration
APIServer.use(cors({
    origin: [
        WebServerBaseURL
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
    console.log(`Project Web Server is running at ${WebServerBaseURL}`);
})
APIServer.listen(ports.apiServerPort, () => {
    console.log(`API Server is running at ${APIServerBaseURL}`);
})

