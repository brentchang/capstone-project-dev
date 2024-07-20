class ValidationCodeUtils{
    // 自定义函数，用于
    static _6DigitsNumberValidationCodeGenerator() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

module.exports = {
    ValidationCodeUtils
}