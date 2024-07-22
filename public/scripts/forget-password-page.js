document.getElementById('sendCodeBtn').addEventListener('click', function() {
    let username = document.getElementById('username').value;
    const usernameHintDiv = document.getElementById('usernameHint');
    usernameHintDiv.style.color = 'green';
    if (username) {
        // 发送 POST 请求到服务器
        fetch('http://127.0.0.1:8080/forget-password/send-validation-code-by-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        }).then(response => {
            console.log('username sent:', response); // debug

            // 如果response不是200-209，说明错误，进行错误处理
            if (!response.ok) {  
                console.log("debug - response.ok - false");
                // 显示红色
                usernameHintDiv.style.color = 'red';
            }
            // 显示信息 （错误/正确）
            response.text().then(data => {
                usernameHintDiv.style.display = 'block';
                usernameHintDiv.textContent = data;
                return data;
            })
        }).catch(error => {
            console.error('Error sending username:', error);
        });

        // 按钮倒计时效果
        let btn = document.getElementById('sendCodeBtn');
        btn.style.backgroundColor = '#d3d3d3';
        btn.style.borderColor = '#d3d3d3';
        btn.disabled = true;
        var seconds = 60;
        btn.textContent = `(${seconds})`;

        var intervalId = setInterval(() => {
            seconds--;
            btn.textContent = `(${seconds})`;
            if (seconds === 0) {
                clearInterval(intervalId);
                btn.textContent = 'Validation Code';
                btn.style.backgroundColor = '#ff5722';
                btn.style.borderColor = '#ff5722';
                btn.disabled = false;
            }
        }, 1000);
    } else {
        // alert('Please enter a valid username address.');
    }
});

// password format hint
document.getElementById('password').addEventListener('input', function() {
    var passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>?,.\/\\-]).{7,}$/;
    var password = this.value;
    var hint = document.getElementById('passwordHint');

    if (password) {
        if (!passwordRegex.test(password)) {
            this.classList.add('input-error');
            this.classList.remove('input-success');
            hint.classList.remove('hint-success');
            hint.textContent = `Password must start with an uppercase letter and be at least 8 characters long, including at least one lowercase letter, one number, and one special character (e.g., !@#$%^&*()).`;
            hint.style.display = 'block';
        } else {
            this.classList.add('input-success');
            this.classList.remove('input-error');
            hint.classList.add('hint-success');
            hint.textContent = 'Password format is correct';
            hint.style.display = 'block';
        }
    } else {
        this.classList.remove('input-success', 'input-error');
        hint.classList.remove('hint-success');
        hint.style.display = 'none';
    }
});


// confirm password hint
document.getElementById('confirmPassword').addEventListener('input', function() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var hint = document.getElementById('confirmPasswordHint');

    if (confirmPassword) {
        if (password !== confirmPassword) {
            this.classList.add('input-error');
            this.classList.remove('input-success');
            hint.classList.remove('hint-success');
            hint.textContent = 'Passwords do not match.';
            hint.style.display = 'block';
        } else {
            this.classList.add('input-success');
            this.classList.remove('input-error');
            hint.classList.add('hint-success');
            hint.textContent = 'Password matched';
            hint.style.display = 'block';
        }
    } else {
        this.classList.remove('input-success', 'input-error');
        hint.classList.remove('hint-success');
        hint.style.display = 'none';
    }
});

// validation code hint
document.getElementById('validationCode').addEventListener('input', function() {
    var vcRegex = /^\d{6}$/;
    var vc = this.value;
    var hint = document.getElementById('vcHint');

    if (vc) {
        if (!vcRegex.test(vc)) {
            this.classList.add('input-error');
            this.classList.remove('input-success');
            hint.classList.remove('hint-success');
            hint.textContent = `6 digits validation code only, no other characters`;
            hint.style.display = 'block';
        } else {
            this.classList.add('input-success');
            this.classList.remove('input-error');
            hint.classList.add('hint-success');
            hint.textContent = 'validation code format is correct';
            hint.style.display = 'block';
        }
    } else {
        this.classList.remove('input-success', 'input-error');
        hint.classList.remove('hint-success');
        hint.style.display = 'none';
    }
});

// 前端格式校验后提交
document.getElementById('updatePasswordBtn').addEventListener('click', function(event) {
    // 阻止表单的默认提交行为
    event.preventDefault();  
    
    // elements
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const validationCode = document.getElementById('validationCode').value;

    // reg ex
    const usernameRegex = /^[A-Za-z0-9._]{1,20}$/;
    const passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>?,.\/\\-]).{7,}$/;
    const vcRegex = /^\d{6}$/;

    // 校验通过
    const responseMessageDiv = document.getElementById('responseMessage');
    const loginLink = document.getElementById('loginLink');
    if (
        (usernameRegex.test(username)) &&
        (passwordRegex.test(password)) &&
        (password == confirmPassword) &&
        (vcRegex.test(validationCode))
    ) {
        // request create the account
        fetch('http://127.0.0.1:8080/forget-password/update-password-for-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username : username,
                validation_code : validationCode,
                newPassword : password
            })
        }).then(response => {
            responseMessageDiv.style.color = 'green';
            if (!response.ok) {  // 如果response不是200-209，说明错误，进行错误处理
                console.log("debug - response.ok - false");
                // 显示错误信息 - 红色
                responseMessageDiv.style.color = 'red';
            } else {
                loginLink.style.display = 'block'; // display login link
            }

            response.text().then(data => {
                responseMessageDiv.textContent = data;
                responseMessageDiv.style.display = 'block';
                return data;
            })
        }).catch(error => {
            console.error('Error! - ', error);
        });
    } else {
        // 错误信息
        responseMessageDiv.style.color = 'red';
        responseMessageDiv.textContent = `You are missing some information or mismatch the correct format!`;
        responseMessageDiv.style.display = 'block';
    }
});