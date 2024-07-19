const {
    axios,
    path,
    fs
} = require('../config/dependencies');

const {
    "views-path-config": viewPaths,
    "database-config": databaseConfig,
    "api-urls-config": APIs
} = require('../config/config.json');
 

// access the Sign Up Page
const getSignUpPageAction = async (req, res) => {
    // get the view
    const signUpPage = viewPaths.signUp;
    const fpath = path.join(__dirname, signUpPage);

    // response the view to FE
    fs.readFile(fpath, 'utf-8', (error, dataStream) => {
        // return 404 Not Found if file is failed to be read 
        if (error) return res.end('404 Not Found!');
        // response the file data stream to browser if success
        res.end(dataStream);
    })
}

// post requesting for signing up new account
const postSignUpPageAction = async (req, res) => {
    // get the register information

    // call API: validate username if exists

    // call API: validate the user is real by email validation code

    // call API: write record into DB table `user`

}

// send validation email
const postSendValidationEmailAction = async (req, res) => {
    // get the email address

    // call the email address validation api 
}

const getForgetPasswordAction = async (req, res) => {
    // get the register information

    // call API: validation username if exists

    // call API: validation the user is real by email

    // call API: write record into DB table `user`

}

module.exports = {
    getSignUpPageAction,
    postSignUpPageAction
}