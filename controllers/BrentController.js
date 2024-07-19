const {
    axios,
    path,
    fs
} = require('../config/dependencies');
const {
    "views-path-config": viewPaths,
    "api-urls-config": APIs
} = require('../config/config.json');

// access: /login
const getTrailDetail1Action = (req, res) => {
    const trailDetail1Page = viewPaths.trailDetail;
    const fpath = path.join(__dirname, trailDetail1Page);

    fs.readFile(fpath, 'utf-8', (error, dataStream) => {
        // return 404 Not Found if file is failed to be read 
        if (error) return res.end('404 Not Found!');
        // response the file data stream to browser if success
        res.end(dataStream);
    })
};

const getTrailDetail2Action = (req, res) => {
    const trailDetail2Page = viewPaths.trailDetail;
    const fpath = path.join(__dirname, trailDetail2Page);

    fs.readFile(fpath, 'utf-8', (error, dataStream) => {
        // return 404 Not Found if file is failed to be read 
        if (error) return res.end('404 Not Found!');
        // response the file data stream to browser if success
        res.end(dataStream);
    })
};

const getTrailDetail3Action = (req, res) => {
    const trailDetail3Page = viewPaths.trailDetail;
    const fpath = path.join(__dirname, trailDetail3Page);

    fs.readFile(fpath, 'utf-8', (error, dataStream) => {
        // return 404 Not Found if file is failed to be read 
        if (error) return res.end('404 Not Found!');
        // response the file data stream to browser if success
        res.end(dataStream);
    })
};

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

module.exports = {
    getTrailDetail1Action,
    getTrailDetail2Action,
    getTrailDetail3Action,
    getBookingSuccessAction
}