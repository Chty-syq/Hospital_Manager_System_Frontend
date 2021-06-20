let root = "http://localhost:8083"

class UserData {
    constructor(accountName, password, phone, realName, idCard, roleId, department) {
        this.accountName = accountName
        this.password = password
        this.phone = phone
        this.realName = realName
        this.idCard = idCard
        this.roleId = roleId
        this.department = department
    }
}

window.onload = ()=>{
    let addUserOption = document.getElementById("add-user-option")
    addUserOption.addEventListener("click",()=>processOption("add-user"))
    let settingOption = document.getElementById("setting-option")
    settingOption.addEventListener("click",()=>processOption("setting"))

    let btnAddUser = document.getElementById("btn-add-user")
    btnAddUser.addEventListener("click",()=>processAddUser())

    let radioList = document.getElementsByClassName("user-type-radio")
    for(let i=0;i<radioList.length;++i){
        radioList[i].addEventListener("click",()=>{
            let departmentInput = document.getElementsByClassName("department")[0]
            if(radioList[i].value === "3"){
                departmentInput.disabled = null
                departmentInput.style.background = "white"
            }
            else{
                departmentInput.value = null
                departmentInput.disabled = "disabled"
                departmentInput.style.background = "gray"
            }
        })
    }

    processOption("add-user")
    let optionList = getOptionList();
    for(let i=1;i<optionList.length;++i){
        optionList[i].style.borderTop = "none"
    }
    if(optionList.length == 1){
        optionList[0].style.borderRadius = "5px 5px 5px 5px"
    }
    else{
        optionList[0].style.borderRadius = "5px 5px 0px 0px"
        optionList[optionList.length-1].style.borderRadius = "0px 0px 5px 5px"
    }
}

function processAddUser() {
    let accountName, password, phone, realName, idCard, department;
    let roleId = getRadioValue("user-type-radio");
    let infoForm = document.forms["infoForm"]
    for(let i=0;i<infoForm.length;++i){
        switch (infoForm[i].name) {
            case "username":
                accountName = infoForm[i].value;
                break;
            case "password":
                password = infoForm[i].value;
                break;
            case "phone":
                phone = infoForm[i].value;
                break;
            case "realName":
                realName = infoForm[i].value;
                break;
            case "idcard":
                idCard = infoForm[i].value;
                break;
            case "department":
                department = infoForm[i].value;
                break;
        }
    }
    if(accountName == null || password == null || phone == null || realName ==null || idCard ==null){
        alert("输入信息不能为空！")
        return;
    }
    if(roleId == "3" && department == null){
        alert("科室不能为空！")
        return;
    }
    let userData = new UserData(accountName, password, phone, realName, idCard, roleId, department);
    fetch(root+"/register/adminAddUser",{
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>{
            console.log(data)
            alert(data["code"] == 200 ? "添加用户成功！" : "添加失败！")
        })
        .catch(err=>console.log(err))
}

function getRadioValue(radioName) {
    var radios = document.getElementsByName(radioName)
    for(let i=0;i<radios.length;++i){
        if(radios[i].checked){
            return radios[i].value;
        }
    }
    return null;
}

function processOption(optionName) {
    let contentDivList = getContentDivList()
    for(let i=0;i<contentDivList.length;++i){
        let element = contentDivList[i];
        if(element.id === optionName + "-region"){
            element.style.display = "block"
        }
        else{
            element.style.display = "none"
        }
    }
    let optionList = getOptionList();
    for(let i=0;i<optionList.length;++i){
        let element = optionList[i];
        if(element.id === optionName + "-option"){
            element.style.background = "#66ccff"
        }
        else{
            element.style.background = "#f1f1f1"
        }
    }
}

function getContentDivList(){
    var contentField = document.getElementById("content")
    var contentDivList = []
    for(let i=0;i<contentField.childElementCount;++i){
        var element = contentField.children[i];
        contentDivList.push(element)
    }
    return contentDivList;
}

function getOptionList(){
    var optionField = document.getElementById("admin-list")
    var optionList = [];
    for(let i=0;i<optionField.childElementCount;++i){
        var element = optionField.children[i];
        optionList.push(element)
    }
    return optionList;
}