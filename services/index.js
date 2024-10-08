const { connection } = require('../app');

/* 
    Services中定义了所有的业务逻辑，方便在API Action中重复的使用。
    /services/index.js 是为了集合所有的XXXXServices文件，通过Services对象统一暴露出来
*/

const UserService = require('./UserServices');
const userService = new UserService(connection);

const EmailService = require('./EmailServices');
const emailService = new EmailService(connection);

const weatherService = require('./WeatherServices');

const Services = {
    userService,
    emailService,
    weatherService
}

module.exports = {
    Services
}