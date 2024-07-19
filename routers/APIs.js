const {
    express,
    path
} = require('../config/dependencies');

const {
    connection
} = require('../app');

const router = express.Router();

// define Restful APIs
router.get('/', async (req, res) => {
    res.end('this is API server') // test
});

// sign up validation : if the username exists
router.post('/sign-up/validation/username', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: 'No username provided' });
    }

    // DB query
    const query = 'SELECT username FROM user WHERE username = ?';
    connection.query(query, [username], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database query failed' });
        }

        if (results.length > 0) {
            res.json({ success: false, message: 'Username already exists' });
        } else {
            res.json({ success: true, message: 'This is a new username, you can create this username' });
        }
    });
});

//  sign up validation : email address
router.post('/sign-up/validation/email', (req, res) => {
    // get the email and validation code
    const { email, validationCode } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'No email provided' });
    }
    if (!validationCode) {
        return res.status(400).json({ success: false, message: 'No validation code provided' });
    }

    // DB query
    const query = 'SELECT email, validation_code, create_time FROM email_validation WHERE email = ? and validation_code = ?';
    connection.query(query, [email, validationCode], (error, results, fields) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database query failed' });
        }

        if (results.length > 0) {
            res.json({ success: false, message: 'Validation failed' });
        } else {
            res.json({ success: true, message: 'Validation succecced' });
        }
    })
});

// login validation user with username&password
router.post('/user-login', async (req, res) => {

});

module.exports = router;
