const {     
    getTrailDetail1Action,
    getTrailDetail2Action,
    getTrailDetail3Action,
    getBookingSuccessAction
} = require('./BrentController');
const {
    getLoginPageAction,
    getLandingPageAction,
    getOrderListPageAction,
    getLogOutAction,
    postLoginAction
} = require('./BensonController');

module.exports = {
    // Benson Controller
    getLoginPageAction,
    getLandingPageAction,
    getOrderListPageAction,
    getLogOutAction,
    postLoginAction,

    // Brent Controller
    getTrailDetail1Action,
    getTrailDetail2Action,
    getTrailDetail3Action,
    getBookingSuccessAction
}