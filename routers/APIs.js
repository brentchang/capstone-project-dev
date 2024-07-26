const { express } = require('../config/dependencies');
const router = express.Router();
const APIActions = require('../services/APIActions');

// API Server Route 
// API服务器的URL和路由规则在这个文件中指定，为了使代码更易读、不臃肿，所有的详细Action逻辑请查看文件： /services/APIActions.js
router.get('/', APIActions.apiServerConnectAction);
router.post('/sign-up/validation/username', APIActions.signUpValidateUsernameAction); 
router.post('/sign-up/generate-validation-code', APIActions.generateValidationCodeAction);
router.post('/sign-up/validation/email', APIActions.signUpValidateEmailAction);
router.post('/sign-up/create-new-account', APIActions.createNewAccountAction);
router.post('/sign-up/send-email', APIActions.sendEmailAction)
router.post('/forget-password/find-email-by-username', APIActions.findEmailByUsernameAction)
router.post('/forget-password/validate-username-existing', APIActions.ValidateUsernameExistingAction)
router.post('/forget-password/update-new-password', APIActions.updatePasswordForUsernameAction)
router.get('/weather/current-weather', APIActions.getCurrentWeather)
router.get('/weather/daily-weather', APIActions.getDailyWeather)
router.get('/weather/today-hourly-weather', APIActions.getTodayHourlyWeather)

module.exports = router;