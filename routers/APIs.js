const { express } = require('../config/dependencies');
const router = express.Router();
const APIActions = require('../services/APIActions');

// API Server Route 
// API服务器的URL和路由规则在这个文件中指定，为了使代码更易读、不臃肿，所有的详细Action逻辑请查看文件： /services/APIActions.js
router.get('/', APIActions.apiServerConnectAction);
router.get('/sign-up/validation/username', APIActions.signUpValidateUsernameAction); 
router.post('/sign-up/generate-validation-code', APIActions.generateValidationCodeAction);
router.get('/sign-up/validation/email', APIActions.signUpValidateEmailAction);
router.post('/sign-up/create-new-account', APIActions.createNewAccountAction);

module.exports = router;