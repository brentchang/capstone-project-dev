// Jest unit test suite for the function in this project
const BrentController = require("../controllers/BrentController.js");

it("tests query database data from a funtion", ()=>{
    expect(HST.calculate("ON", 10)).toBe(1.3);
});