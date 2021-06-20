let root = "http://localhost:8083"

window.onload = ()=>{
    let presOption = document.getElementById("pres-option")
    presOption.addEventListener("click",()=>processOption("pres"))
    let settingOption = document.getElementById("setting-option")
    settingOption.addEventListener("click",()=>processOption("setting"))

    let btnRefreshPres = document.getElementById("pres-refresh-button")
    btnRefreshPres.addEventListener("click",()=>processPresRefresh())

    processOption("pres")
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

function processPresRefresh() {
    fetch(root+"/chemist/updatePaidPrescription",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>processPresRefreshData(data))
        .catch(err=>console.log(err))
}

function processPresRefreshData(data) {
    let resultTableBody = document.getElementById("pres-result-table").tBodies[0]
    resultTableBody.innerHTML = null;
    let searchList = data["data"]["info"]
    for(let key1 in searchList){
        let searchListTemp = searchList[key1]
        for(let key2 in searchListTemp){
            let info = searchListTemp[key2]
            let tr = document.createElement("tr")
            let td1 = document.createElement("td")
            td1.innerText = info["patientDto"]["realName"]
            let td2 = document.createElement("td")
            td2.innerText = info["patientDto"]["idCard"]
            let td3 = document.createElement("td")
            td3.innerText = info["description"]
            let td4 = document.createElement("td")
            let tButton = document.createElement("button")
            tButton.innerText = "确认取药"
            tButton.addEventListener("click", ()=>processPresFetch(info["id"], info["patientDto"]["id"]));
            td4.appendChild(tButton)
            tr.appendChild(td1)
            tr.appendChild(td2)
            tr.appendChild(td3)
            tr.appendChild(td4)
            resultTableBody.appendChild(tr)
        }
    }
}

function processPresFetch(presID, patientID) {
    fetch(root+"/chemist/releaseMedicine",{
        method: "POST",
        body: JSON.stringify({
            id: presID.toString(),
            patientDto: {
                id: patientID.toString()
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })  .then(res=>res.json())
        .then(data=>{
            console.log(data)
            alert(data["code"] == 200 ? "取药成功！" : "取药失败！")
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
    var optionField = document.getElementById("chemist-list")
    var optionList = [];
    for(let i=0;i<optionField.childElementCount;++i){
        var element = optionField.children[i];
        optionList.push(element)
    }
    return optionList;
}