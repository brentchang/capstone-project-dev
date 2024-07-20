class DateUtils{
    // 自定义函数，用于格式化日期时间为 "yyyy-MM-dd HH:mm:ss"
    static formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，因此加1
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
    
        // 按照 "yyyy-MM-dd HH:mm:ss" 格式返回
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

module.exports = {
    DateUtils
}