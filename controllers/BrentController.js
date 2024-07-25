const {
    axios,
    path,
    mysql2,
    fs
} = require('../config/dependencies');
const {
    "views-path-config": viewPaths,
    "database-config": databaseConfig,
    "api-urls-config": APIs
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
    console.log(typeof(trail));

    // if trail is not found, return 404 Not Found
    if (!trail) {
        return res.end('404 Not Found!');
    }else{
        // render the trail detail page
        res.render(fpath, {
                    trail: trail
        });
    }
};

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

// get trail by id
async function getTrailById(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM trail
    WHERE id = ?
    `, [id])
    return rows[0]
  }

module.exports = {
    getTrailDetailAction,
    getBookingSuccessAction
}