let root = "http://localhost:8083"
let checkCode = getRandomString();

window.onload = ()=>{
    const btnCode = document.getElementById("code");
    btnCode.addEventListener("click", refreshCode)
    btnCode.value = checkCode;
    const btnLogin = document.getElementById("btn-login");
    btnLogin.addEventListener("click", processLogin)
}

class UserData{
    constructor(username, password) {
        this.username = username
        this.password = password
    }
}

function processLogin() {
    var loginForm = document.forms["loginForm"];
    var username, password, inputcode;
    for(let i=0;i<loginForm.length;++i) {
        switch (loginForm[i].name) {
            case "username":
                username = loginForm[i].value;
                break;
            case "password":
                password = loginForm[i].value;
                break;
            case "code":
                inputcode = loginForm[i].value;
                break;
        }
    }
    if(inputcode!=checkCode){
        alert("验证码错误！");
        refreshCode();
        return
    }
    let userData = new UserData(username, password);
    fetch(root+"/login/login",{
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res=>res.json())
        .then(data=>processData(data))
        .catch(err=>console.log(err))
}

function processData(data) {
    if(data["code"]==200){//登陆成功

    }
}

function refreshCode() {
    checkCode = getRandomString();
    const btnCode = document.getElementById("code");
    btnCode.value = checkCode;
}

function getRandomString() {
    let alphabet = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789";
    let code = ""
    for(let i=0;i<4;++i){
        let ch = alphabet[Math.round(Math.random()*(alphabet.length-1))];
        code = code + ch;
    }
    return code;
}
