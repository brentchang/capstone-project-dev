const { Utils } = require('../utils/index');
const { Services } = require('../services/index');

// define RESTful APIs
const apiServerConnectAction = async (req, res) => {
    res.status(200).json({ success: true, message: "this is API server" });
};

// sign up validation : if the username exists
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
                // if email exists, meaning we already generate the validation code
                res.json({ success: false, message: "Validation code already generated" });
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
                            res.json({ success: true, message: "Validation code generated successfully" });
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
const validateEmailAction = (req, res) => {
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

const APIActions = {
    apiServerConnectAction,
    signUpValidateUsernameAction,
    generateValidationCodeAction,
    validateEmailAction
}
module.exports = APIActions;