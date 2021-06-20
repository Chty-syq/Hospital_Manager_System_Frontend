let root = "http://localhost:8083"

window.onload = ()=>{
    let bookOption = document.getElementById("book-option")
    bookOption.addEventListener("click",()=>processOption("book"))
    let caseOption = document.getElementById("case-option")
    caseOption.addEventListener("click",()=>processOption("case"))
    let presOption = document.getElementById("pres-option")
    presOption.addEventListener("click",()=>processOption("pres"))
    let settingOption = document.getElementById("setting-option")
    settingOption.addEventListener("click",()=>processOption("setting"))

    let btnBookSearch = document.getElementById("book-search-button")
    btnBookSearch.addEventListener("click",()=>processBookSearch())
    let btnCaseSearchName = document.getElementById("case-search-button-name")
    btnCaseSearchName.addEventListener("click",()=>processCaseSearchByName())
    let btnCaseSearchDate = document.getElementById("case-search-button-date")
    btnCaseSearchDate.addEventListener("click",()=>processCaseSearchByDate())
    let btnCaseSearchAll = document.getElementById("case-search-button-all")
    btnCaseSearchAll.addEventListener("click",()=>processCaseSearchAll())
    let btnPresSearchAll = document.getElementById("pres-search-button-all")
    btnPresSearchAll.addEventListener("click",()=>processPresSearchAll())

    processOption("book")
    let optionList = getOptionList();
    for(let i=1;i<optionList.length;++i){
        optionList[i].style.borderTop = "none"
    }
    optionList[0].style.borderRadius = "5px 5px 0px 0px"
    optionList[optionList.length-1].style.borderRadius = "0px 0px 5px 5px"
}

function processBookSearch() {
    let searchInput = document.getElementById("book-search-input")
    fetch(root+"/patient/findDoctor",{
        method: "POST",
        body: JSON.stringify({
            department: searchInput.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processBookSearchData(data, searchInput.value))
        .catch(err=>console.log(err))
}

function processBookSearchData(data, department) {
    let resultTableBody = document.getElementById("book-result-table").tBodies[0]
    resultTableBody.innerHTML = ""
    let searchList = data["data"]["list"]
    for(let i=0;i<searchList.length;++i){
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        td1.innerText = searchList[i]["accountName"]
        let td2 = document.createElement("td")
        td2.innerText = department
        let td3 = document.createElement("td")
        td3.innerText = searchList[i]["phone"]
        let td4 = document.createElement("td")
        td4.innerText = searchList[i]["idCard"]
        let td5 = document.createElement("td")
        let tButton = document.createElement("button")
        tButton.innerText = "立即预约"
        tButton.addEventListener("click", ()=>processBookOperation(searchList[i]))
        td5.appendChild(tButton)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        resultTableBody.appendChild(tr)
    }
}

function processBookOperation(doctorData) {
    fetch(root + "/patient/appointment",{
        method: "POST",
        body: JSON.stringify({
            currentDto: {
                id: localStorage.getItem("userID"),
                accountName: localStorage.getItem("username")
            },
            targetDto: {
                id: doctorData["id"],
                accountName: doctorData["accountName"]
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>res.json())
        .then(data=> {
            alert(data["code"]==200 ? "预约成功！" : "预约失败！")
        })
        .catch(err=>console.log(err))
}

function processCaseSearchByName() {
    let searchInput = document.getElementById("case-search-input-name");
    let searchName = searchInput.value;
    console.log(searchDate)
    fetch(root + "/patient/findCaseByDate",{
        method: "POST",
        body: JSON.stringify({
            patient: {
                id: localStorage.getItem("userID")
            },
            date: searchName
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processCaseSearchData(data))
        .catch(err=>console.log(err))
}

function processCaseSearchByDate(){
    let searchInput = document.getElementById("case-search-input-date");
    let searchDate = searchInput.value;
    fetch(root + "/patient/findCaseByDate",{
        method: "POST",
        body: JSON.stringify({
            patientDto: {
                id: localStorage.getItem("userID")
            },
            date: searchDate
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processCaseSearchData(data))
        .catch(err=>console.log(err))
}

function processCaseSearchAll(){
    fetch(root + "/patient/getAllCase",{
        method: "POST",
        body: JSON.stringify({
            patientDto: {
                id: localStorage.getItem("userID")
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processCaseSearchData(data))
        .catch(err=>console.log(err))
}

function processCaseSearchData(data) {
    let resultTableBody = document.getElementById("case-result-table").tBodies[0]
    resultTableBody.innerHTML = null;
    let searchList = data["data"]["list"]
    for(let i=0;i<searchList.length;++i){
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        td1.innerText = searchList[i]["date"]
        let td2 = document.createElement("td")
        td2.innerText = searchList[i]["doctorDto"]["realName"]
        let td3 = document.createElement("td")
        td3.innerText = searchList[i]["department"]
        let td4 = document.createElement("td")
        td4.innerText = searchList[i]["description"]
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        resultTableBody.appendChild(tr)
    }
}

function processPresSearchAll(){
    fetch(root + "/patient/checkPrescription",{
        method: "POST",
        body: JSON.stringify({
            patientDto: {
                id: localStorage.getItem("userID")
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processPresSearchData(data))
        .catch(err=>console.log(err))
}

function processPresSearchData(data) {
    let resultTableBody = document.getElementById("pres-result-table").tBodies[0]
    resultTableBody.innerHTML = null;
    let searchList = data["data"]["list"]
    for(let i=0;i<searchList.length;++i){
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        td1.innerText = searchList[i]["date"]
        let td2 = document.createElement("td")
        td2.innerText = searchList[i]["doctorDto"]["realName"]
        let td3 = document.createElement("td")
        td3.innerText = searchList[i]["description"]
        let td4 = document.createElement("td")
        let tButton = document.createElement("button")
        tButton.innerText = "支付"
        tButton.addEventListener("click", ()=>processPresPay(
            searchList[i]["id"], searchList[i]["description"], searchList[i]["doctorDto"]["id"]
        ));
        td4.appendChild(tButton)
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        resultTableBody.appendChild(tr)
    }
}

function processPresPay(presID, presDes, presDoctorID) {
    fetch(root + "/patient/pay",{
        method: "POST",
        body: JSON.stringify({
            id: presID.toString(),
            patientDto: {
                id: localStorage.getItem("userID")
            },
            doctorDto: {
                id: presDoctorID.toString()
            },
            description: presDes
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=> {
            console.log(data)
            alert(data["code"] == 200 ? "支付成功！" : "支付失败！")
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
    var optionField = document.getElementById("patient-list")
    var optionList = [];
    for(let i=0;i<optionField.childElementCount;++i){
        var element = optionField.children[i];
        optionList.push(element)
    }
    return optionList;
}