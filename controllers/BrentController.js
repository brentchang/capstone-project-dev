const {
    // axios,
    path,
    mysql2,
    fs
} = require('../config/dependencies');
const {
    "views-path-config": viewPaths,
    "database-config": databaseConfig,
    // "api-urls-config": APIs
} = require('../config/config.json');

// access: /landing/trail-detail-:id
const getTrailDetailAction = async (req, res) => {
    const trailDetail1Page = viewPaths.trailDetail;
    // file path to trail-detail-1.ejs
    const fpath = path.join(__dirname, trailDetail1Page);

    // query the database to get the trail details
    const trailId = req.params.id;
    const trail = await getTrailById(trailId);
    // verbose output
    // console.log(trail);
    // console.log(typeof(trail));

    // calculate the date for booking form
    // today's date
    var dateForToday = new Date();
    var dateStringForToday = new Date(dateForToday.getTime() - (dateForToday.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];

    // end date for booking form, which is today + trail.duration
    var dateForEnd = new Date(dateForToday.getTime() + trail.duration * (1000 * 60 * 60 * 24));
    var dateStringForEnd = new Date(dateForEnd.getTime() - (dateForEnd.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
    
    // get the availability for the calendar view
    const events = await getAllTrailAvailabilityForCalendarById(trailId);

    // if trail is not found, return 404 Not Found
    if (!trail) {
        return res.end('404 Not Found!');
    }else{
        // render the trail detail page
        res.render(fpath, {
                    trail: trail,
                    dateStringForToday: dateStringForToday,
                    dateStringForEnd: dateStringForEnd,
                    events: events
        });
    }
};

// access: /book
async function postTrailBookAction (req, res) {
    const bookSuccessPage = viewPaths.bookSuccess;
    const fpath = path.join(__dirname, bookSuccessPage);

    // verify the request is from the login user
    if (!req.session.username) {
         return res.redirect('/login');
    }else{
        // get the form data from the request body
        const {
            trailId,
            from, // start date
            to, // end date
            adults, // adult count
            children, // children count
            parking // parking needed
        } = req.body;

        // verify input data
        if (!trailId || !from || !to || !adults || !children || adults <= 0 || children < 0) {
            return res.end('Invalid input data!').status(400);
        }

        // convert the parking to boolean
        // if the parking is checked, then parking is "on"
        // otherwise, parking is undefined
        // 1 for parking needed, 0 for parking not needed
        const parkingNeeded = parking === 'on' ? 1 : 0;

        // check availability
        const availability = await getTrailAvailabilityById(trailId, from, to, Number(adults) + Number(children));
        // if not available, return error message
        if (!availability || !availability.success) {
            return res.end(availability.message).status(400);
        }else{
            // if available, book the trail
            const orderDetail = await bookTrailWriteToDb(req.session.username, trailId, from, to, adults, children, parkingNeeded);
            // render the booking success page
            res.render(fpath, {
                orderDetail: orderDetail,
                username: req.session.username
            });
        }
    }
}

// access: /book-success
const getBookingSuccessAction = (req, res) => {
    const bookSuccessPage = viewPaths.bookSuccess;
    const fpath = path.join(__dirname, bookSuccessPage);

    fs.readFile(fpath, 'utf-8', (error, dataStream) => {
        // return 404 Not Found if file is failed to be read 
        if (error) return res.end('404 Not Found!');
        // response the file data stream to browser if success
        res.end(dataStream);
    })
};

// method: GET
// access: /book/modify/:orderNumber
// purpose: modify the order
async function getModifyOrderAction(req, res) {
    // share the same page with trail detail
    const modifyOrderPage = viewPaths.trailDetail;
    const fpath = path.join(__dirname, modifyOrderPage);
    // check if the user is logged in
    if (!req.session.username) {
        return res.redirect('/login');
    }else{
        // get the order number from the request
        const orderNumber = req.params.orderNumber;
        // query the database to get the order details
        const order = await getOrderDetailByOrderNumber(orderNumber);
        // get the availability for the calendar view
        const events = await getAllTrailAvailabilityForCalendarById(order.trail_id);
        // if the order is not found, return 404 Not Found
        if (order.length() === 0) {
            return res.end('404 Not Found!');
        }else{
            // render the modify order page
            res.render(fpath, {
                order: order,
                username: req.session.username,
                events: events
            });
        }
    }
}

// method: POST
// access: /book/modify/:orderNumber
// purpose: modify the order
async function postModifyOrderAction(req, res) {
    const bookSuccessPage = viewPaths.bookSuccess;
    const fpath = path.join(__dirname, bookSuccessPage);
    const orderNumber = req.params.orderNumber;
    const username = req.session.username;
    // verify the request is from the login user
    if (!username) {
        return res.redirect('/login');
   }else{
       // get the form data from the request body
       const {
           trailId,
           from, // start date
           to, // end date
           adults, // adult count
           children, // children count
           parking // parking needed
       } = req.body;

       // verify input data
       if (!trailId || !from || !to || !adults || !children || adults <= 0 || children < 0) {
           return res.end('Invalid input data!').status(400);
       }

       // convert the parking to boolean
       // if the parking is checked, then parking is "on"
       // otherwise, parking is undefined
       // 1 for parking needed, 0 for parking not needed
       const parkingNeeded = parking === 'on' ? 1 : 0;

       // compare the new order with the old order
       const oldOrder = await getOrderDetailByOrderNumber(orderNumber);
         if (oldOrder.trail_id === trailId && oldOrder.from_date === from && oldOrder.to_date === to && oldOrder.adult_num === adults && oldOrder.child_num === children && oldOrder.parking_or_not === parkingNeeded) {
              return res.end('The new order is the same as the old order!').status(400);
         }else{

         }
       // if the new order is the same as the old order, return error message

       // check availability
       // TODO: need to add a relationship between order and trail availability
       const availability = await getTrailAvailabilityById(trailId, from, to, Number(adults) + Number(children));
       // if not available, return error message
       if (!availability || !availability.success) {
           return res.end(availability.message).status(400);
       }else{
           // if available, update the trail order
           const orderDetail = await updateOrderTrailWriteToDb(orderNumber,username, trailId, from, to, adults, children, parkingNeeded);
           // render the booking success page
           res.render(fpath, {
               orderDetail: orderDetail,
               username: username
           });
       }
   }
}

// connection pool for mysql
const pool = mysql2.createPool({
    host: databaseConfig['localhost'],
    user: databaseConfig['username'],
    password: databaseConfig['password'],
    database: databaseConfig['database']
}).promise();

// get trail max_group_size by trailId
async function getMaxGroupSizeById(id) {
    const [rows] = await pool.query(`
    SELECT max_group_size 
    FROM trail
    WHERE id = ?
    `, [id])
    return rows[0].max_group_size
}

async function getTrailById(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM trail
    WHERE id = ?
    `, [id])
    return rows[0]
}

async function getTrailNameById(id) {
    const [rows] = await pool.query(`
    SELECT trail_name 
    FROM trail
    WHERE id = ?
    `, [id])
    return rows[0].trail_name
}

async function getOrderDetailByOrderNumber(orderNumber) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM \`order\`
    WHERE order_num = ?
    `, [orderNumber])
    return rows[0]
}

// get trail availability by id
// TODO: add parking availability
// TODO: separate adults and children count
async function getTrailAvailabilityById(trailId, startDate, endDate, seatCount) {
    // convert the date string to date
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    // count the days between start and end date
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
    try{
        // query the database to get the trail availability
        const [rows] = await pool.query(`
            SELECT available_seats
            FROM trail_availability
            WHERE trail_id = ?
            AND date BETWEEN ? AND ?
            `, [trailId, startDate, endDate]);
        // count how many rows are returned
        const rowCount = rows.length;
        
        // check if the seat count is under the limit of the trail
        const maxGroupSize = await getMaxGroupSizeById(trailId);
        if (seatCount > maxGroupSize) {
            // return false and error message if seat count is over the limit
            return { success: false, message: `Seat count is over the limit of ${maxGroupSize}` };
        }
    
        // compare the days between the start and end date with the rows returned from the database
        // if the days are equal to the rows, check if there are enough seats for each day
        if (days === rowCount){
            // check if there are enough seats for each day from the start date to the end date
            // for days that are not in the database, assume there are enough seats, however, still need to check if under the limit of the trail
            // go through each day in rows array
            for (let i = 0; i < rowCount; i++) {
                // if there are not enough seats for any day, return false
                if (rows[i].available_seats < seatCount) {
                    return { success: false, message: `Seat count is not available in the date range` };
                }else{
                    // if there are enough seats for all known days in database, return true
                    return { success: true };
                }
            }
        }else{
            // if the days are not equal to the rowCount, then there are some days that are not in the database
            // therefore, assume there are enough seats for each day, and insert new rows into the database
            // go through each day from start date to end date
            for (let i = 0; i < days; i++) {
                // if the row exists, check if there are enough seats by comparing the available seats with the seat count
                if (rows[i]){
                    // if there are not enough seats for any day, return false
                    if (rows[i] && rows[i].available_seats < seatCount) {
                        return { success: false, message: `Seat count is not available in the date range` };
                    }else{
                        // if there are enough seats for all known days in database, return true
                        return { success: true };
                    }
                }else{
                    // if the row does not exist, assume there are enough seats for the day
                    // thus return true
                    return { success: true };
                }
            }
        }
    }catch(error){
        // print error message if failed
        console.error('getTrailAvailabilityById error:'+error);
        // throw exception
        throw error;
    }
}

// the function to convert user name to user id
async function getUserIdByUserName(userName) {
    try{
        const [rows] = await pool.query(`
            SELECT id 
            FROM user
            WHERE username = ?
            `, [userName])
            return rows[0].id
    }catch(error){
        // print error message if failed
        console.error('getUserIdByUserName error:'+error);
        throw error;
    }
}

// the function to update the order of a trail
async function updateOrderTrailWriteToDb(username, trailId, startDate, endDate, adultCount, childrenCount, parking) {
    try{
        // get the user id by username
        const userId = await getUserIdByUserName(username);

        // get the available seats
        const maxGroupSize = await getMaxGroupSizeById(trailId);

        // generate the updated time
        const updatedTime = new Date();

        // convert the parking to boolean
        // if the parking is checked, then parking is "on"
        // otherwise, parking is undefined
        // 1 for parking needed, 0 for parking not needed
        const parkingNeeded = parking === 'on' ? 1 : 0;

        // update the booking record into the database
        // order table
        await pool.query(`
            UPDATE \`order\`
            SET \`trail_id\` = ?, \`from_date\` = ?,\`to_date\` = ?, \`adult_num\` = ?, \`child_num\` = ?,\`parking_or_not\` = ?, \`last_updated_time\` = ?
            WHERE \`order_num\` = ?
            `, [trailId, startDate, endDate, adultCount, childrenCount, parkingNeeded, updatedTime, orderNumber]);

        // insert or update the available seats on each day
        const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
        for (let i = 0; i < days; i++) {
            await pool.query(`
                INSERT INTO \`trail_availability\` (\`trail_id\`, \`available_seats\`, \`date\`)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE \`available_seats\`=?
                `, [trailId, maxGroupSize - adultCount - childrenCount, startDate + i * (1000 * 60 * 60 * 24)], maxGroupSize - adultCount - childrenCount);
        }
    }catch(error){
        // print error message if failed
        console.error('updateOrderTrailWriteToDb error:'+error);
        throw error;
    }
}



// the function to place the book order the trail
// TODO: cover all queries with transaction
async function bookTrailWriteToDb(username, trailId, startDate, endDate, adultCount, childrenCount, parkingNeeded) {
    try{
        // get the user id by username
        const userId = await getUserIdByUserName(username);

        // get the available seats
        const maxGroupSize = await getMaxGroupSizeById(trailId);
    
        // generate order number
        const orderNumber = await generateOrderNumber();

        // generate the order time
        const orderTime = new Date();

        // insert the booking record into the database
        // order table
        // status_code: 0 for booked, 1 for cancelled
        await pool.query(`INSERT INTO \`order\` (\`order_num\`, \`trail_id\`, \`from_date\`,\`to_date\`, \`adult_num\`, \`child_num\`,\`parking_or_not\`, \`status_code\`, \`order_time\`, \`last_updated_time\`)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
            `, [orderNumber, trailId, startDate, endDate, adultCount, childrenCount, parkingNeeded, orderTime, orderTime]);
        // look up the order id
        const [orderId] = await pool.query(`
            SELECT id
            FROM \`order\`
            WHERE order_num = ?
            LIMIT 1
            `, [orderNumber]);
        // user_order table to link user and order
        await pool.query(`
            INSERT INTO \`user_order\` (\`user_id\`, \`order_id\`)
            VALUES (?, ?)
            `, [userId, [orderId][0].id]);
        
        // insert or update the available seats on each day
        const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
        for (let i = 0; i < days; i++) {
            await pool.query(`
                INSERT INTO \`trail_availability\` (\`trail_id\`, \`available_seats\`, \`date\`)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE \`available_seats\`=?
                `, [trailId, maxGroupSize - adultCount - childrenCount, startDate + i * (1000 * 60 * 60 * 24)], maxGroupSize - adultCount - childrenCount);
        }

        // get trail name for the order details
        const trailName = await getTrailNameById(trailId);

        // return the order details
        return {
            orderNumber: orderNumber,
            trailName: trailName,
            startDate: startDate,
            endDate: endDate,
            adultCount: adultCount,
            childrenCount: childrenCount,
            parkingNeeded: parkingNeeded
        };   
    }catch(error){
        // print error message if failed
        console.error('bookTrail error:'+error);
        throw error;
    }
}

// the function to generate order number
// TODO: there might be a better way to generate order number
// TODO: this function should implement try-catch block
async function generateOrderNumber() {
    // generate non-repeating random number
    const orderNumber = Math.floor(Math.random() * 1000000000);
    // check if the order number is unique
    const [rows] = await pool.query(`
        SELECT \`order_num\`
        FROM \`order\`
        WHERE \`order_num\` = ?
        LIMIT 1
        `, [orderNumber])
    // if the order number is not unique, generate a new one
    if (rows.length > 0) {
        return generateOrderNumber();
    }else{
        // return the order number if it is unique
        return orderNumber;
    }
}

// the function to get all the available seats for a trail on each day
// for the calendar view
// TODO: can't get the real data from the database, always return the default data
async function getAllTrailAvailabilityForCalendarById(trailId) {
    let today = new Date();
    let oneYearFromToday = new Date();
    oneYearFromToday.setFullYear(today.getFullYear() + 1);
    let allDates = getDatesInRange(today, oneYearFromToday);
    let availabilityMap = {};
    try{
        let max_seats = await getMaxGroupSizeById(trailId);

        const results = await pool.query('SELECT available_seats, date FROM trail_availability WHERE trail_id = ?', [trailId]);
        // console.log(results);
        results.forEach(row => {
            if (row.available_seats && row.date){
                availabilityMap[row.date.toISOString().split('T')[0]] = {
                    // trail_id: row.trail_id,
                    available_seats: row.available_seats,
                    date: row.date
                };
            }
        });
        let events = allDates.map(date => {
            let dateString = date.toISOString().split('T')[0];
            if (availabilityMap[dateString]) {
                return availabilityMap[dateString];
            } else {
                return {
                    // trail_id: trailId,
                    available_seats: max_seats, 
                    date: date
                };
            }
        });
        return events;
    }catch(error){
        // print error message if failed
        console.error('getAllTrailAvailabilityForCalendarById error:'+error);
        throw error;
    }
}

// Helper function to get all dates in a range
function getDatesInRange(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

module.exports = {
    getTrailDetailAction,
    getBookingSuccessAction,
    postTrailBookAction
}