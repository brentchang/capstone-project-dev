const {
    axios,
    path,
    fs
} = require('../config/dependencies');

const {
    "views-path-config": viewPaths,
    "WebServerBaseURL": webServerBaseURL,
    "APIServerBaseURL": apiServerBaseURL,
    "api-url-config": apiUrls
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
            let response = await axios.post(apiServerBaseURL + apiUrls["validate-username"], {
                username: username
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                console.log('username validated successfully');

                // call API: validate the user is real by email validation code
                response = await axios.post(apiServerBaseURL + apiUrls["validate-email"], {
                    email: email,
                    validationCode: validationCode,
                    currentTime: currentTime
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.success) {
                    console.log('email validated successfully');

                    // call API: write record into DB table `user`
                    response = await axios.post(apiServerBaseURL + apiUrls["create-new-account"], {
                        username: username,
                        password: password,
                        email: email,
                        phoneNumber: phoneNumber,
                        address: address
                    }, {
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

// send validation code to email
const postSendValidationCodeAction = async (req, res) => {
    // get the email address
    const { email } = req.body;
    const currentTimeISO = new Date();

    try {
        // call API - 1: generate validation code in the DB
        let response = await axios.post(apiServerBaseURL + apiUrls["generate-validation-code"], {
            email: email,
            currentTimeISO: currentTimeISO
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            // call API - 2: send email
            const validationCode = response.data.validation_code;
            response = await axios.post(apiServerBaseURL + apiUrls["send-email"], {
                email: email,
                validationCode: validationCode
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                return res.status(200).send('Sent vc to email successfully');
            }
            // fail for 2
            return res.status(400).send('account failed to create!' + response.data.message);
        }
        // fail for 1
        return res.status(400).send('account failed to create!' + response.data.message);
    } catch (error) {
        console.error('API request failed: ', error);
        return res.status(500).send('Server error');
    }
}

const getForgetPasswordAction = (req, res) => {
    // go to fotget password page

}

// send validation code by email
const postSendValidationCodeByUsernameAction = async (req, res) => {
    // get the email address
    const { username } = req.body;

    try {
        // call API - 1: validate the username is existing
        let response = await axios.post(apiServerBaseURL + apiUrls["validate-username-existing"], {
            username: username
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // call API - 2: find email by username when username is existing.
        if (response.data.success) {
            response = await axios.post(apiServerBaseURL + apiUrls["find-email-by-username"], {
                username: username
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                const email = response.data.email;
                // call Controller Action - 3: postSendValidationCodeAction
                response = await axios.post(webServerBaseURL + '/sign-up/send-validation-code', {
                    email: email
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status == 200) {
                    return res.status(200).send('The validation code has been sent to your registered email! please check!')
                }
                return res.status(400).send('failed to send validation code!' + response.data.message);
            }
            // fail for 2
            return res.status(400).send('failed to find the email by username!' + response.data.message);
        }
        // fail for 1
        return res.status(400).send('username not found in our system!' + response.data.message);
    } catch (error) {
        console.error('API request failed: ', error);
        return res.status(500).send('Server error');
    }
}

const postUpdatePasswordAction = async (req, res) => {
    // go to fotget password page
    const { username, validation_code, newPassword } = req.body

    try {
        // call API - 1:  validate the username is existing
        let response = await axios.post(apiServerBaseURL + apiUrls["validate-username-existing"], {
            username: username
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // call API - 2: find email by username when username is existing.
        if (response.data.success) {
            response = await axios.post(apiServerBaseURL + apiUrls["find-email-by-username"], {
                username: username
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                const email = response.data.email;
                const currentTime = new Date();

                // call API - 3: validate the email and validation code
                response = await axios.post(apiServerBaseURL + apiUrls["validate-email"], {
                    email: email,
                    validationCode: validation_code,
                    currentTime: currentTime
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.success) {
                    // call API - 4: update the password.
                    response = await axios.post(apiServerBaseURL + apiUrls["update-new-password"], {
                        username: username,
                        newPassword: newPassword,
                        updatedTime: currentTime
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.data.success) {
                        // all process succeed
                        return res.status(200).send('All process succeed: ' + response.data.message);
                    }
                    // fail for 4
                    return res.status(400).send('failed to update password' + response.data.message);
                }
                // fail for 3
                return res.status(400).send('validation failed' + response.data.message);
            }
            // fail for 2
            return res.status(400).send('failed to find the email by username!' + response.data.message);
        }
        // fail for 1
        return res.status(400).send('username not found in our system!' + response.data.message);
    } catch (error) {
        console.error('API request failed: ', error);
        return res.status(500).send('Server error');
    }
}


module.exports = {
    getSignUpPageAction,
    postSignUpPageSubmitAction,
    postSendValidationCodeAction,
    getForgetPasswordAction,
    postSendValidationCodeByUsernameAction,
    postUpdatePasswordAction
}