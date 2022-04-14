let nameUser;
function sideBar(){
    document.querySelector(".fundoSide").classList.add("active");
    document.querySelector(".sideBar").classList.add("active");
}
function hideBar(){
    document.querySelector(".fundoSide").classList.remove("active");
    document.querySelector(".sideBar").classList.remove("active");
}
function login(){
    nameUser=document.querySelector(".entrada input").value;
    const tryLogin=axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",{ name:`${nameUser}`})
    tryLogin.then(function(response){
        document.querySelector(".entrada").classList.add("active")
    })
    tryLogin.catch(function(response){
        alert("Usuário já se encontra online.")
    })
    setInterval(conection,4000)
    setInterval(buscaMensagens,3000)
}
function conection(){
    const mantemLogin=axios.post("https://mock-api.driven.com.br/api/v6/uol/status",{ name:`${nameUser}`})
    mantemLogin.then(function(response){
        response.data
    })
}
function buscaMensagens(){
    const promise=axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(function(response){
        let contador=0;
        let main=document.querySelector("main");
        main.innerHTML=""
        while(contador<response.data.length){
            switch(response.data[contador].type){
            case "status":
                main.innerHTML+=`<div class="chatStatus">
                <span class="time">(${response.data[contador].time})</span> ${response.data[contador].from} ${response.data[contador].text}
            </div>`
            break
            case "message":
                main.innerHTML+=`<div class="chatMessage">
                <span class="time">(${response.data[contador].time})</span> ${response.data[contador].from} para ${response.data[contador].to}: ${response.data[contador].text}
            </div>`
            break
            case "private_message":
                main.innerHTML+=`<div class="chatPrivate">
                <span class="time">(${response.data[contador].time})</span> ${response.data[contador].from} reservadamente para ${response.data[contador].to}: ${response.data[contador].text}
            </div>`
            }
            contador++
        }
        let screenHeight = "" + window.innerHeight / 8;
        main.scrollIntoView(false);
        window.scrollBy(0, screenHeight);
        
    })
    
}