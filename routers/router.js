const {
    express
} = require('../config/dependencies.js'); // import denpendencies
const {
    // BensonController.js
    getLoginPageAction,
    getLandingPageAction,
    getOrderListPageAction,
    getLogOutAction,
    postLoginAction,
    getTrailDetail1Action,
    getTrailDetail2Action,
    getTrailDetail3Action,
    getBookingSuccessAction
} = require('../controllers/index.js'); /* import controllers */

// create a router
const router = express.Router();

// define routes with URLs and controllers
router.get('/', getLandingPageAction);
router.get('/landing', getLandingPageAction);
router.get('/login', getLoginPageAction);
router.get('/logout', getLogOutAction);
router.get('/order-list', getOrderListPageAction)
router.post('/login', postLoginAction);
router.get('/landing/trail-detail-1', getTrailDetail1Action);
router.get('/landing/trail-detail-2', getTrailDetail2Action);
router.get('/landing/trail-detail-3', getTrailDetail3Action);
router.get('/book-success', getBookingSuccessAction)
// export JS module as a object
module.exports = router; 