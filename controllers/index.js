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
const {
    getSignUpPageAction,
    postSignUpPageAction
} = require('./SmarsController');


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
    getBookingSuccessAction,

    // Smars Controller
    getSignUpPageAction,
    postSignUpPageAction
}