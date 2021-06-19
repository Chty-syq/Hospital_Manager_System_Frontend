let root = "http://localhost:8083"

window.onload = ()=>{
    var regForm1 = document.forms["regForm-1"];
    var regForm2 = document.forms["regForm-2"];
    var regForm3 = document.forms["regForm-3"];
    regForm2.style.display = "none"
    regForm3.style.display = "none"
    var btnRegister1 = document.getElementById("btn-register1")
    var btnRegister2 = document.getElementById("btn-register2")
    var btnRegister3 = document.getElementById("btn-register3")
    btnRegister1.addEventListener("click", processRegist1)
    btnRegister2.addEventListener("click", processRegist2)
    btnRegister3.addEventListener("click", processRegist3)
}

class RegistData{
    constructor(username, password, confirm, realname, phone, idcard, birth, sex, blood) {
        this.accountName = username
        this.password = password
        this.confirmPassword = confirm
        this.phone = phone
        this.realName = realname
        this.idCard = idcard
        this.birthday = birth
        this.blood = blood
        this.sex = sex
    }
}

var username, password, confirm, realname, phone, idcard, birth, sex, blood;

function processRegist1() {
    var regForm = document.forms["regForm-1"];
    for(let i=0;i<regForm.length;++i){
        switch (regForm[i].name) {
            case "username":
                username = regForm[i].value;
                break;
            case "password":
                password = regForm[i].value;
                break;
            case "confirm":
                confirm = regForm[i].value;
                break;
        }
    }
    regForm.style.display = "none"
    regForm = document.forms["regForm-2"];
    regForm.style.display = "block"
}

function processRegist2() {
    var regForm = document.forms["regForm-2"];
    for(let i=0;i<regForm.length;++i){
        switch (regForm[i].name) {
            case "realname":
                realname = regForm[i].value;
                break;
            case "phone":
                phone = regForm[i].value;
                break;
            case "idcard":
                idcard = regForm[i].value;
                break;
        }
    }
    regForm.style.display = "none"
    regForm = document.forms["regForm-3"]
    regForm.style.display = "block"
}

function processRegist3() {
    var regForm = document.forms["regForm-3"];
    for(let i=0;i<regForm.length;++i){
        switch (regForm[i].name) {
            case "birth":
                birth = regForm[i].value;
                break;
            case "sex":
                sex = regForm[i].value;
                break;
            case "blood":
                blood = regForm[i].value;
                break;
        }
    }
    var registData = new RegistData(username, password, confirm, realname, phone, idcard, birth, sex, blood);
    fetch(root+"/register/register",{
        method: "POST",
        body: JSON.stringify(registData),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processData(data))
        .catch(err=>console.log(err))
}

function processData(data) {
    console.log(data)
    if(data["msg"]=="success"){
        alert("注册成功!")
    }
}
