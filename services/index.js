const { connection } = require('../app');

const UserService = require('./userServices');
const userService = new UserService(connection);

const Services = {
    userService,
}

module.exports = {
    Services
}