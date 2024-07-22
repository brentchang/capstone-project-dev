document.getElementById('sendCodeBtn').addEventListener('click', function() {
    let email = document.getElementById('email').value;
    if (email) {
        // 发送 POST 请求到服务器
        fetch('http://127.0.0.1:8080/sign-up/send-validation-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        }).then(response => {
            console.log('Email sent:', response);
        }).catch(error => {
            console.error('Error sending email:', error);
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
                btn.textContent = 'Validate';
                btn.style.backgroundColor = '#ff5722';
                btn.style.borderColor = '#ff5722';
                btn.disabled = false;
            }
        }, 1000);
    } else {
        // alert('Please enter a valid email address.');
    }
});

// username format hint
document.getElementById('username').addEventListener('input', function() {
    var usernameRegex = /^[A-Za-z0-9._]{1,20}$/;
    var username = this.value;
    var hint = document.getElementById('usernameHint');

    if (username) {
        if (!usernameRegex.test(username)) {
            this.classList.add('input-error');
            this.classList.remove('input-success');
            hint.classList.remove('hint-success');
            hint.textContent = `Username must be 1-20 characters long and can only contain letters numbers . and _.`;
            hint.style.display = 'block';
        } else {
            this.classList.add('input-success');
            this.classList.remove('input-error');
            hint.classList.add('hint-success');
            hint.textContent = 'Username format is correct';
            hint.style.display = 'block';
        }
    } else {
        this.classList.remove('input-success', 'input-error');
        hint.classList.remove('hint-success');
        hint.style.display = 'none';
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

// email hint
document.getElementById('email').addEventListener('input', function() {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;;
    var email = this.value;
    var hint = document.getElementById('emailHint');

    if (email) {
        if (!emailRegex.test(email)) {
            this.classList.add('input-error');
            this.classList.remove('input-success');
            hint.classList.remove('hint-success');
            hint.textContent = 'Your email format is incorrect.';
            hint.style.display = 'block';
        } else {
            this.classList.add('input-success');
            this.classList.remove('input-error');
            hint.classList.add('hint-success');
            hint.textContent = 'Email format is correct.';
            hint.style.display = 'block';
        }
    } else {
        this.classList.remove('input-success', 'input-error');
        hint.classList.remove('hint-success');
        hint.style.display = 'none';
    }
});

// phone number hint
document.getElementById('phoneNum').addEventListener('input', function() {
    var phoneNumRegex = /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/
    var phoneNum = this.value;
    var hint = document.getElementById('phoneNumHint');

    if (phoneNum) {
        if (!phoneNumRegex.test(phoneNum)) {
            this.classList.add('input-error');
            this.classList.remove('input-success');
            hint.classList.remove('hint-success');
            hint.textContent = 'Your phone number format is incorrect.';
            hint.style.display = 'block';
        } else {
            this.classList.add('input-success');
            this.classList.remove('input-error');
            hint.classList.add('hint-success');
            hint.textContent = 'Phone number format is correct.';
            hint.style.display = 'block';
        }
    } else {
        this.classList.remove('input-success', 'input-error');
        hint.classList.remove('hint-success');
        hint.style.display = 'none';
    }
});

// address hint
document.getElementById('address').addEventListener('input', function() {
    var addressRegex = /^[A-Za-z0-9 ,]{0,50}$/
    var address = this.value;
    var hint = document.getElementById('addressHint');

    if (address) {
        if (!addressRegex.test(address)) {
            this.classList.add('input-error');
            this.classList.remove('input-success');
            hint.classList.remove('hint-success');
            hint.textContent = `Number, letter, ',' or ' ' only, not longer than 50 characters`;
            hint.style.display = 'block';
        } else {
            this.classList.add('input-success');
            this.classList.remove('input-error');
            hint.classList.add('hint-success');
            hint.textContent = 'Address format is correct.';
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
document.getElementById('createAccountBtn').addEventListener('click', function(event) {
    // 阻止表单的默认提交行为
    event.preventDefault();  
    console.log("debug - 111");
    // elements
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNum').value;
    const address = document.getElementById('address').value;
    const validationCode = document.getElementById('validationCode').value;
    // console.log(username);
    // console.log(password);
    // console.log(confirmPassword);
    // console.log(email);
    // console.log(phoneNumber);
    // console.log(address);
    // console.log(validationCode);

    // reg ex
    const usernameRegex = /^[A-Za-z0-9._]{1,20}$/;
    const passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>?,.\/\\-]).{7,}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneNumRegex = /^(?:\d{10}|\d{3}-\d{3}-\d{4})$/;
    const addressRegex = /^[A-Za-z0-9 ,]{0,50}$/;
    const vcRegex = /^\d{6}$/;
    // console.log((usernameRegex.test(username)));
    // console.log((passwordRegex.test(password)));
    // console.log((password == confirmPassword));
    // console.log((emailRegex.test(email)));
    // console.log((phoneNumRegex.test(phoneNumber)));
    // console.log((vcRegex.test(validationCode)));
    // console.log(JSON.stringify({ 
    //     username : username,
    //     password : password,
    //     email : email,
    //     phoneNumber : phoneNumber,
    //     address : address,
    //     validationCode : validationCode
    // }));

    // 校验通过
    const responseMessageDiv = document.getElementById('responseMessage');
    const loginLink = document.getElementById('loginLink');
    if (
        (usernameRegex.test(username)) &&
        (passwordRegex.test(password)) &&
        (password == confirmPassword) &&
        (emailRegex.test(email)) &&
        (phoneNumRegex.test(phoneNumber)) &&
        (addressRegex.test(address)) &&
        (vcRegex.test(validationCode))
    ) {
        console.log("debug - 校验通过");
        // request create the account
        fetch('http://127.0.0.1:8080/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username : username,
                password : password,
                email : email,
                phoneNumber : phoneNumber,
                address : address,
                validationCode : validationCode
            })
        }).then(response => {
            responseMessageDiv.style.color = 'green';
            if (!response.ok) {  // 如果response不是200-209，说明错误，进行错误处理
                console.log("debug - response.ok - false");
                // 显示错误信息 - 红色
                responseMessageDiv.style.color = 'red';
            }
            response.text().then(data => {
                responseMessageDiv.textContent = data;
                responseMessageDiv.style.display = 'block';
                loginLink.style.display = 'block'; // display login link
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