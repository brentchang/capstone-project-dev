const {
    express,
    path
} = require('../config/dependencies');

// const {

// } = require('../models/index');
const router = express.Router();

// define Restful APIs
router.get('/', async (req, res) => {
    res.end('this is API server') // test
})

// login validation user with username&password
router.post('/user-login', async (req, res) => {

});

module.exports = router;
