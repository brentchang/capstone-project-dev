const bcrypt = require('bcrypt');
const saltRounds = 10; // 盐的轮数，可以根据需求进行调整


class PasswordUtils{
    /**
     * 加密密码
     * @param {string} password - 明文密码
     * @returns {Promise<string>} - 加密后的密码
     */
    static encryptPassword(password) {
        try {
            const hashedPassword = bcrypt.hash(password, saltRounds);
            return hashedPassword;
        } catch (err) {
            console.error('加密密码时出错:', err);
            throw err;
        }
    }

    /**
     * 验证密码
     * @param {string} plainPassword - 明文密码
     * @param {string} hashedPassword - 哈希密码
     * @returns {Promise<boolean>} - 是否匹配
     */
    static verifyPassword(plainPassword, hashedPassword) {
        try {
            if (plainPassword === hashedPassword) {
                return true
            } else {
                const match = bcrypt.compare(plainPassword, hashedPassword);
                return match;
            }
        } catch (err) {
            console.error('验证密码时出错:', err);
            throw err;
        }
    }
}

module.exports = {
    PasswordUtils
}