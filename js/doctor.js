let root = "http://localhost:8083"

window.onload = ()=>{
    let bookOption = document.getElementById("patient-option")
    bookOption.addEventListener("click",()=>processOption("patient"))
    let createCaseOption = document.getElementById("create-case-option")
    createCaseOption.addEventListener("click",()=>processOption("create-case"))
    let createPresOption = document.getElementById("create-pres-option")
    createPresOption.addEventListener("click",()=>processOption("create-pres"))
    let findCaseOption = document.getElementById("find-case-option")
    findCaseOption.addEventListener("click",()=>processOption("find-case"))
    let findPresOption = document.getElementById("find-pres-option")
    findPresOption.addEventListener("click",()=>processOption("find-pres"))
    let settingOption = document.getElementById("setting-option")
    settingOption.addEventListener("click",()=>processOption("setting"))

    let btnPatientRefresh = document.getElementById("refresh-operation-button")
    btnPatientRefresh.addEventListener("click", ()=>processPatientRefresh())
    let btnPatientAccept = document.getElementById("accept-operation-button")
    btnPatientAccept.addEventListener("click",()=>processPatientAccept())
    let btnPatientDelay = document.getElementById("delay-operation-button")
    btnPatientDelay.addEventListener("click",()=>processPatientDelay())
    let btnCaseSubmit = document.getElementById("case-description-button")
    btnCaseSubmit.addEventListener("click",()=>processCaseSubmit())
    let btnPresSubmit = document.getElementById("pres-description-button")
    btnPresSubmit.addEventListener("click",()=>processPresSubmit())

    processOption("patient");
    let optionList = getOptionList();
    for(let i=1;i<optionList.length;++i){
        optionList[i].style.borderTop = "none"
    }
    optionList[0].style.borderRadius = "5px 5px 0px 0px"
    optionList[optionList.length-1].style.borderRadius = "0px 0px 5px 5px"
}

function processPatientRefresh(){
    fetch(root + "/doctor/checkAppointment",{
        method: "POST",
        body: JSON.stringify({
            id: localStorage.getItem("userID"),
            accountName: localStorage.getItem("username")
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processPatientRefreshData(data))
        .catch(err=>console.log(err))
}

function processPatientRefreshData(data) {
    var patientList = data["data"]["info"]
    let resultTableBody = document.getElementById("patient-list-table").tBodies[0]
    resultTableBody.innerHTML = ""
    for(let i=0;i<patientList.length;++i){
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        td1.innerText = patientList[i]["accountName"]
        let td2 = document.createElement("td")
        td2.innerText = patientList[i]["phone"]
        let td3 = document.createElement("td")
        td3.innerText = patientList[i]["idCard"]
        let td4 = document.createElement("td")
        td4.innerText = patientList[i]["realName"]
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        resultTableBody.appendChild(tr)
    }
}

function processPatientAccept() {
    fetch(root + "/doctor/acceptAppointment",{
        method: "POST",
        body: JSON.stringify({
            id: localStorage.getItem("userID"),
            accountName: localStorage.getItem("username")
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processPatientAcceptData(data))
        .catch(err=>console.log(err))
}

function processPatientAcceptData(data) {
    if(data["code"]!=200){
        alert("接受预约失败！")
        return;
    }
    localStorage.setItem("patientID", data["data"]["info"]["id"])
    localStorage.setItem("patientName", data["data"]["info"]["accountName"])
    localStorage.setItem("caseCreatable", 1)
    localStorage.setItem("presCreatable", 1)
    processPatientRefresh()
    alert("接受预约成功!")
}

function processPatientDelay() {
    fetch(root + "/doctor/delayAppointment",{
        method: "POST",
        body: JSON.stringify({
            id: localStorage.getItem("userID"),
            accountName: localStorage.getItem("username")
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=> {
            alert(data["code"]==200 ? "推迟成功" : "推迟失败")
            processPatientRefresh()
        })
        .catch(err=>console.log(err))
}

function processCaseSubmit() {
    if(localStorage.getItem("caseCreatable") != 1){
        alert("当前状态不可创建病例！");
        return;
    }
    var description = document.getElementById("case-description-input").value
    fetch(root + "/doctor/createCase",{
        method: "POST",
        body: JSON.stringify({
            doctor:{
                id: localStorage.getItem("userID")
            },
            patient:{
                id: localStorage.getItem("patientID")
            },
            description: description
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=> {
            localStorage.setItem("caseCreatable", 0)
            alert(data["code"]==200 ? "创建病例成功!" : "创建失败!")
        })
        .catch(err=>console.log(err))
}

function processPresSubmit() {
    if(localStorage.getItem("presCreatable") != 1){
        alert("当前状态不可创建处方！");
        return;
    }
    var description = document.getElementById("pres-description-input").value
    fetch(root + "/doctor/createPrescription",{
        method: "POST",
        body: JSON.stringify({
            doctor:{
                id: localStorage.getItem("userID")
            },
            patient:{
                id: localStorage.getItem("patientID")
            },
            description: description
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=> {
            localStorage.setItem("presCreatable", 0)
            alert(data["code"]==200 ? "创建处方成功!" : "创建失败!")
        })
        .catch(err=>console.log(err))
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
    if(optionName == "patient"){
        processPatientRefresh();
    }
    else if(optionName == "create-case"){
        if(localStorage.getItem("caseCreatable") != 1){
            alert("当前状态不可创建病例！")
            return;
        }
        document.getElementById("patient-info-name-case").innerText = localStorage.getItem("patientName")
    }
    else if(optionName == "create-pres"){
        if(localStorage.getItem("presCreatable") != 1){
            alert("当前状态不可创建处方！")
            return;
        }
        document.getElementById("patient-info-name-pres").innerText = localStorage.getItem("patientName")
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
    var optionField = document.getElementById("doctor-list")
    var optionList = [];
    for(let i=0;i<optionField.childElementCount;++i){
        var element = optionField.children[i];
        optionList.push(element)
    }
    return optionList;
}