const {
    axios,
    path,
    fs
} = require('../config/dependencies');

const {
    "views-path-config": viewPaths,
    "WebServerBaseURL" : webServerBaseURL,
    "APIServerBaseURL" : apiServerBaseURL,
    "api-url-config" : apiUrls
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
const postSignUpPageSubmitAction = async (req, res) => {
    // get the register information
    const { username, password, email, phoneNumber, address, validationCode } = req.body;
    const currentTime = new Date();

    try {
        try {
            // call API: validate username if exists
            let response = await axios.post(apiServerBaseURL+apiUrls["validate-username"],{
                    username: username
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                console.log('username validated successfully');
    
                // call API: validate the user is real by email validation code
                response = await axios.post(apiServerBaseURL+apiUrls["validate-email"],{
                    email : email,
                    validationCode : validationCode,
                    currentTime : currentTime
                },{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.success) {
                    console.log('email validated successfully');
    
                    // call API: write record into DB table `user`
                    response = await axios.post(apiServerBaseURL+apiUrls["create-new-account"],{
                            username: username,
                            password: password,
                            email : email,
                            phoneNumber : phoneNumber,
                            address : address
                    },{
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.data.success) {
                        console.log('new account created successfully');
                        return res.status(200).send('All APIs executed successfully');
                    }
                    return res.status(400).send('account failed to create!' + response.data.message);
                }
                return res.status(400).send('email validation failed!' + response.data.message);
            }
            return res.status(400).send('username validation failed!' + response.data.message);
        } catch (error) {
            console.error('API request failed: ', error);
            return res.status(500).send('Server error');
        }

        // // 返回最终结果
        // res.send({
        //     message: "All APIs called successfully.",
        //     results: [result1, result2, result3]
        // });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
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
    postSignUpPageSubmitAction
}