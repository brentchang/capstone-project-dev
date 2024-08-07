class UserService {
    constructor(connection) {
        this.connection = connection;
    }

    checkUsernameExists(username) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT username FROM user WHERE username = ?';
            this.connection.query(query, [username], (error, results) => {
                if (error) {
                    reject(new Error('Database query failed' + error.message));
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
                    reject(new Error('Database query failed'  + error.message));
                } else if (results.length > 0) {
                    resolve({ exists: true, record: results[0] });
                } else {
                    resolve({ exists: false });
                }
            });
        });
    }

    createValidationCode(email, validation_code, create_time) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO email_validation (email, validation_code, create_time) VALUES (?, ?, ?)`;
            this.connection.query(query, [email, validation_code, create_time], (error, results) => {
                if (error) {
                    return this.connection.rollback(() => {
                        reject(new Error('Create validation code failed when insert table `email_validation`'  + error.message));
                    });
                }
                this.connection.commit(err => {
                    if (err) {
                        return this.connection.rollback(() => {
                            reject(new Error('Transaction commit failed - Create validation code' + err.message));
                        });
                    }
                    resolve({ inserted: true });
                });
            });
        });
    }

    updateValidationCode(email, validation_code, create_time) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE email_validation SET validation_code = ?, create_time = ? WHERE email = ?;`;
            // console.log([validation_code, create_time, email])
            this.connection.query(query, [validation_code, create_time, email], (error, results) => {
                if (error) {
                    return this.connection.rollback(() => {
                        reject(new Error('Update validation code failed when update table `email_validation`' + error.message));
                    });
                }
                this.connection.commit(err => {
                    if (err) {
                        return this.connection.rollback(() => {
                            reject(new Error('Transaction commit failed - Update validation code ' + err.message));
                        });
                    }
                    resolve({ updated: true });
                });
            });
        });
    }

    createNewAccount(username, password, email, address, phone_num, validation_pass, current_date) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO user (
                                username, 
                                password, 
                                email, 
                                address, 
                                phone_num, 
                                validation_pass, 
                                created_time
                            ) VALUES (?, ?, ?, ?, ?, ?, ?);
            `;
            this.connection.query(query, [username, password, email, address, phone_num, validation_pass, current_date], (error, results) => {
                if (error) {
                    return this.connection.rollback(() => {
                        reject(new Error(`Create new account failed when INSERT INTO table \`user\` - ${error.message}`));
                    });
                }
                this.connection.commit(err => {
                    if (err) {
                        return this.connection.rollback(() => {
                            reject(new Error('Transaction commit failed - Create new account ' + err.message));
                        });
                    }
                    resolve({ inserted: true });
                });
            });
        });
    }

    updatePasswordForUsername(username, newPassword, updateTime) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE user SET password = ? WHERE username = ?;`;
            // console.log([validation_code, create_time, email])
            this.connection.query(query, [newPassword, username], (error, results) => {
                if (error) {
                    return this.connection.rollback(() => {
                        reject(new Error('Update password failed when update table `user`' + error.message));
                    });
                }
                this.connection.commit(err => {
                    if (err) {
                        return this.connection.rollback(() => {
                            reject(new Error('Transaction commit failed - Update password to table user ' + err.message));
                        });
                    }
                    resolve({ updated: true });
                });
            });
        });
    }
}

module.exports = UserService;