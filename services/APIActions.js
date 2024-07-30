const { Utils } = require('../utils/index');
const { Services } = require('../services/index');

/* 
    这个文件中，定义了每个API具体实现的行为（Action），原理一致，
    即获取到req后，
    进行一系列处理，
    最后返回res。

    具体的处理，
    如果涉及到业务逻辑，如检查邮箱是否存在、通过邮箱找到验证码等功能，则通过调用Services类取到静态方法
    如果涉及到简单的通用处理，如对日期进行基础的格式化处理、生成6位数字字符串等功能，则通过调用Utils类取到静态方法
*/

// define RESTful APIs
const apiServerConnectAction = async (req, res) => {
    res.status(200).json({ success: true, message: "this is API server" });
};

// sign up validation : if the username not exists, return success: true
const signUpValidateUsernameAction = (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: 'No username provided' });
    }

    // connect to DB, query username
    Services.userService.checkUsernameExists(username)
        .then(result => {
            if (result.exists) {
                res.json({ success: false, message: 'Username already exists' });
            } else {
                res.json({ success: true, message: 'This is a new username, you can create this username' });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        });
};

const ValidateUsernameExistingAction = (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: 'No username provided' });
    }

    // connect to DB, query username
    Services.userService.checkUsernameExists(username)
        .then(result => {
            if (result.exists) {
                res.json({ success: true, message: 'Username already exists' });
            } else {
                res.json({ success: false, message: 'This is a new username, you can create this username' });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        });
};

//  generate validation code and insert to table `email_validation`
const generateValidationCodeAction = (req, res) => {
    const { email, currentTimeISO } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    // connect to DB, query email
    Services.userService.findValidationCodeRecordByEmail(email)
        .then(result => {
            if (result.exists) {
                // if email exists, meaning we already generate the validation code, we should refresh
                // generate the new validation code
                const newValidationCode = Utils.ValidationCodeUtils._6DigitsNumberValidationCodeGenerator();

                // format the datetime
                const date = new Date(currentTimeISO);
                const formattedCurrentTime = Utils.DateUtils.formatDate(date);
                Services.userService.updateValidationCode(email, newValidationCode, formattedCurrentTime)
                    .then(result => {
                        if (result.updated) {
                            res.json({ success: true, message: "Validation code updated successfully", validation_code: newValidationCode });
                        } else {
                            res.json({ success: false, message: "Validation code failed to update " });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ success: false, message: error.message });
                    });
            } else {
                // email does not exist, meaning we can generate validation code
                // generate the validation code
                const validationCode = Utils.ValidationCodeUtils._6DigitsNumberValidationCodeGenerator();

                // format the datetime
                const date = new Date(currentTimeISO);
                const formattedCurrentTime = Utils.DateUtils.formatDate(date);

                // generate validation code, inserting to DB
                Services.userService.createValidationCode(email, validationCode, formattedCurrentTime)
                    .then(result => {
                        if (result.inserted) {
                            res.json({ success: true, message: "Validation code generated successfully", validation_code: validationCode });
                        } else {
                            res.json({ success: false, message: "Validation code failed to generated " });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ success: false, message: error.message });
                    });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        });
};

//  sign up validation : email address
const signUpValidateEmailAction = (req, res) => {
    // get the email and validation code
    const { email, validationCode, currentTime } = req.body;
    if (!email || !validationCode) {
        return res.status(400).json({ success: false, message: 'No email or validation code provided' });
    }

    // 查询数据库中的email和validation_code
    Services.userService.findValidationCodeRecordByEmail(email)
        .then(result => {
            if (result.exists) {
                // 检查时间是否超过5分钟
                const record = result.record; // get the data record (only 1 row expected)
                const recordTime = new Date(record.create_time); // the field create_time
                const currentTimeParsed = new Date(currentTime);
                const timeDifference = (currentTimeParsed - recordTime) / 60000; // 转换为分钟
                if (timeDifference > 5) {
                    // 验证码超时
                    return res.json({ success: false, message: 'Verification code timed out, please resend the verification code' });
                }

                if (record.validation_code !== validationCode) {
                    // 验证码不匹配
                    return res.json({ success: false, message: 'Incorrect verification code' });
                }

                // 通过所有检查，验证成功
                res.json({ success: true, message: 'Email verification successful' });
            } else {
                return res.json({ success: false, message: 'This email does not exist in our system, please resend the verification code' });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        });
}

// create new account by the data provided from user
const createNewAccountAction = async (req, res) => {
    // get the data provided by user
    const {
        username,
        password, // format - validate by FE
        email, // format - validate by FE
        phoneNumber,  // format - validate by FE
        address, // format - validate by FE
    } = req.body;

    // 获得当前时间
    const date = new Date();
    const formattedCurrentTime = Utils.DateUtils.formatDate(date);
    const validationPassCode = true;

    // 密码加密
    const encryptedPassword = await Utils.PasswordUtils.encryptPassword(password);

    // 把数据写入User表
    Services.userService.createNewAccount(username, encryptedPassword, email, address, phoneNumber, validationPassCode, formattedCurrentTime)
        .then(result => {
            if (result.inserted) {
                res.json({ success: true, message: "The new account has been created successfully" });
            } else {
                res.json({ success: false, message: "The new account failed to be created" });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        })
}

const sendEmailAction = async (req, res) => {
    const { email, validationCode } = req.body;

    // call service to send email the validation code
    Services.emailService.sendEmailWithValidationCode(email, validationCode)
        .then(result => {
            if (result.sended) {
                res.json({ success: true, message: `The email has been sent successfully ${result.info}` });
            } else {
                res.json({ success: false, message: `The email failed to be sent ${result.info}` });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        })
}

const findEmailByUsernameAction = (req, res) => {
    const { username } = req.body;

    // call services to get email by username
    Services.emailService.getEmailByUsername(username)
        .then(result => {
            if (result.exists) {
                res.json({ success: true, message: `The email found`, email: result.record.email });
            } else {
                res.json({ success: false, message: `The email not found` });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        })
}

const updatePasswordForUsernameAction = async (req, res) => {
    const { username, newPassword, updatedTime } = req.body;

    Services.userService.updatePasswordForUsername(username, newPassword, updatedTime)
        .then(result => {
            if (result.updated) {
                res.json({ success: true, message: `The password updated successfully` });
            } else {
                res.json({ success: false, message: `The password failed to update` });
            }
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        })
}

const getCurrentWeather = async (req, res) => {
    // Service calling
    Services.weatherService.getTodayWeatherData()
        .then(result => {
            // data formatting
            const retData = Utils.WeatherUtils.currentDayWeatherDataFormatter(result.data);

            res.json({
                success: true,
                message: `Weather data received`,
                currentWeather: retData
            });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        })
}

const getDailyWeather = async (req, res) => {
    // Service calling
    Services.weatherService.getIn7DaysDailyWeatherData()
        .then(result => {
            // data formatting
            const retData = Utils.WeatherUtils.dailyWeatherDataFormatter(result.data);

            res.json({
                success: true,
                message: `Weather data received`,
                dailyWeather: retData
            });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        })
}

const getTodayHourlyWeather = async (req, res) => {
    // Service calling
    Services.weatherService.getTodayHourlyWeatherData()
    .then(result => {
        // data formatting
        const retData = Utils.WeatherUtils.todayHourlyWeatherDataFormatter(result.data);

        res.json({
            success: true,
            message: `Weather data received`,
            todayHourlyWeather: retData
        });
    })
    .catch(error => {
        res.status(500).json({ success: false, message: error.message });
    })
}

const APIActions = {
    apiServerConnectAction,
    signUpValidateUsernameAction,
    ValidateUsernameExistingAction,
    generateValidationCodeAction,
    signUpValidateEmailAction,
    createNewAccountAction,
    sendEmailAction,
    findEmailByUsernameAction,
    updatePasswordForUsernameAction,
    getCurrentWeather,
    getDailyWeather,
    getTodayHourlyWeather
}
module.exports = APIActions;