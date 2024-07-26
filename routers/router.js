const { express } = require('../config/dependencies.js'); // import denpendencies
const { Controller } = require('../controllers/index.js'); /* import controllers */

// create a router
const router = express.Router();

// 这个文件中定义了所有的Web服务器的path及其对应的Controller具体Action，
// 为了使代码更易读、不臃肿，所有的详细Action逻辑请查看文件： /Controllers/index.js
// define routes with URLs and controllers
router.get('/', Controller.getLandingPageAction);
router.get('/landing', Controller.getLandingPageAction);
router.get('/login', Controller.getLoginPageAction);
router.get('/logout', Controller.getLogOutAction);
router.get('/order-list', Controller.getOrderListPageAction)
router.post('/login', Controller.postLoginAction);
router.get('/landing/trail-detail-:id', Controller.getTrailDetailAction);
router.post('/order', Controller.postTrailBookAction);
router.get('/order/modify/:orderNumber', Controller.getModifyOrderAction);
router.post('/order/modify/:orderNumber', Controller.postModifyOrderAction);
router.get('/book-success', Controller.getBookingSuccessAction);
router.get('/sign-up', Controller.getSignUpPageAction);
router.post('/sign-up', Controller.postSignUpPageSubmitAction);
router.post('/sign-up/send-validation-code', Controller.postSendValidationCodeAction);
router.get('/forget-password', Controller.getForgetPasswordAction);
router.post('/forget-password/send-validation-code-by-username', Controller.postSendValidationCodeByUsernameAction);
router.post('/forget-password/update-password-for-username', Controller.postUpdatePasswordAction);
router.get('/weather', Controller.getWeatherPageAction);

// export JS module as a object
module.exports = router; 