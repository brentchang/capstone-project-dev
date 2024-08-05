// Jest unit test suite for the function in this project
const BrentController = require("../controllers/BrentController.js");

// add environment support for dev and prod
const config = require('../config/config.json');
const env = process.env.NODE_ENV || 'development';
const finalConfig = {
    ...config['shared'],
    ...config[env]
}

it("tests getting date string from a funtion", ()=>{
    expect(BrentController.formatDateString(new Date("2024/7/27"))).toBe("2024-07-27");
});

it("tests getting correct type from formatDateString", ()=>{
    expect(BrentController.formatDateString(new Date("2024/7/27"))).toStrictEqual("2024-07-27");
});

it("tests getting a date range from a funtion", ()=>{
    expect(BrentController.getDatesInRange(new Date("2024-07-25T04:00:00.000Z"),new Date("2024-07-27T04:00:00.000Z"))).toHaveLength(3);
});