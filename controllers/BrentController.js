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

    // calulate the date for booking form
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
    

    // if trail is not found, return 404 Not Found
    if (!trail) {
        return res.end('404 Not Found!');
    }else{
        // render the trail detail page
        res.render(fpath, {
                    trail: trail,
                    dateStringForToday: dateStringForToday,
                    dateStringForEnd: dateStringForEnd
        });
    }
};

// access: /book
const postTrailBookAction = (req, res) => {
    const bookSuccessPage = viewPaths.bookSuccess;
    const fpath = path.join(__dirname, bookSuccessPage);

    // verify the request is from the login user
    if (!req.session.username) {
         return res.redirect('/login');
    }else{
        // get the form data from the request body
        const {
            trailId,
            startDate,
            endDate,
            adultCount,
            childrenCount,
            parkingNeeded
        } = req.body;

        // verify input data
        if (!trailId || !startDate || !endDate || !adultCount || !childrenCount) {
            return res.end('Invalid input data!').status(400);
        }

        // check availability
        const availability = getTrailAvailabilityById(trailId, startDate, endDate, adultCount + childrenCount);
        // if not available, return error message
        if (!availability.success) {
            return res.end(availability.message).status(400);
        }else{
            // if available, book the trail
            const orderDetail = bookTrailWriteToDb(req.session.username, trailId, startDate, endDate, adultCount, childrenCount, parkingNeeded);
            // render the booking success page
            res.render(fpath, {
                orderDetail: orderDetail
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

// get trail availability by id
// TODO: add parking availability
// TODO: separate adults and children count
async function getTrailAvailabilityById(trailId, startDate, endDate, seatCount) {
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

// the function to book the trail
async function bookTrailWriteToDb(username, trailId, startDate, endDate, adultCount, childrenCount, parkingNeeded) {
    // get the username from session
    try{
        // get the user id by username
        const userId = await getUserIdByUserName(username);

        // get the available seats
        const maxGroupSize = await getMaxGroupSizeById(trailId);
    
        // generate order number
        const orderNumber = await generateOrderNumber();

        // insert the booking record into the database
        // order table
        await pool.query(`
            INSERT INTO order (order_num, trail_id, from_date, to_date, adult_num, child_num, parking_or_not, status_code, order_time, last_update_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
            `, [orderNumber, trailId, startDate, endDate, adultCount, childrenCount, parkingNeeded]);
        // user_order table to link user and order
        await pool.query(`
            INSERT INTO user_order (user_id, order_id)
            VALUES (?, ?)
            `, [userId, orderNumber]);
        
        // insert or update the available seats on each day
        const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
        for (let i = 0; i < days; i++) {
            await pool.query(`
                INSERT INTO trail_availability (trail_id, available_seats, date)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE available_seats=?
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
async function generateOrderNumber() {
    // generate non-repeating random number
    const orderNumber = Math.floor(Math.random() * 1000000000);
    // check if the order number is unique
    const [rows] = await pool.query(`
        SELECT order_num
        FROM order
        WHERE order_num = ?
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

module.exports = {
    getTrailDetailAction,
    getBookingSuccessAction,
    postTrailBookAction
}