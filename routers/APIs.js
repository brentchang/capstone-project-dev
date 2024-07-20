const {
    express,
    path
} = require('../config/dependencies');

const router = express.Router();
const APIActions = require('../services/APIActions');

// API Server Route
router.get('/', APIActions.apiServerConnectAction);
router.get('/sign-up/validation/username', APIActions.signUpValidateUsernameAction); 
router.post('/sign-up/generate-validation-code', APIActions.generateValidationCodeAction);
router.get('/sign-up/validation/email', APIActions.validateEmailAction);

module.exports = router;