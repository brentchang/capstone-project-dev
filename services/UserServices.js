class UserService {
    constructor(connection) {
        this.connection = connection;
    }

    checkUsernameExists(username) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT username FROM user WHERE username = ?';
            this.connection.query(query, [username], (error, results) => {
                if (error) {
                    reject(new Error('Database query failed'));
                } else if (results.length > 0) {
                    resolve({ exists: true });
                } else {
                    resolve({ exists: false });
                }
            });
        });
    }

    findValidationCodeRecordByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT email, validation_code, create_time FROM email_validation WHERE email = ?';
            this.connection.query(query, [email], (error, results) => {
                if (error) {
                    reject(new Error('Database query failed'));
                } else if (results.length > 0) {
                    resolve({ exists: true , record: results[0]});
                } else {
                    resolve({ exists: false });
                }
            });
        });
    }

    createValidationCode(email, validation_code, create_time){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO email_validation (email, validation_code, create_time) VALUES (?, ?, ?)';
            this.connection.query(query, [email, validation_code, create_time], (error, results) => {
                if (error) {
                    reject(new Error('Database query failed'));
                } else {
                    resolve({ inserted : true });
                }
            });
        });
    }
}

module.exports = UserService;