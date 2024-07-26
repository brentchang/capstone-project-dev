/* 
    每个XXXXController.js中定义了所有的页面响应Action，用于渲染页面或者处理需要访问数据库的一些请求（各种调用API接口），
    如果涉及到对数据库的业务操作（如客户端要求注册新账户、查询账户信息、删除账户等），
    则会在Action中通过调用API服务器提供的各种接口，来完成对应的CRUD操作，
    /controllers/index.js 是为了集合所有的XXXXController.js文件，通过Controller对象统一暴露出来
*/
const {
    getTrailDetailAction,
    postTrailBookAction,
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
    postSignUpPageSubmitAction,
    postSendValidationCodeAction,
    getForgetPasswordAction,
    postSendValidationCodeByUsernameAction,
    postUpdatePasswordAction,
    getWeatherPageAction
} = require('./SmarsController');

const Controller = {
    // Benson Controller
    getLoginPageAction,
    getLandingPageAction,
    getOrderListPageAction,
    getLogOutAction,
    postLoginAction,

    // Brent Controller
    getTrailDetailAction,
    getBookingSuccessAction,
    postTrailBookAction,

    // Smars Controller
    getSignUpPageAction,
    postSignUpPageSubmitAction,
    postSendValidationCodeAction,
    getForgetPasswordAction,
    postSendValidationCodeByUsernameAction,
    postUpdatePasswordAction,
    getWeatherPageAction
}

module.exports = {
    Controller
}