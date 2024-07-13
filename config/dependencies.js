const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const ejs = require('ejs');
const cors = require('cors');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const mysql2 = require('mysql2')

module.exports = {
    express,
    fs,
    path,
    bodyParser,
    axios,
    ejs,
    cors,
    session,
    fileUpload,
    mysql2
};
