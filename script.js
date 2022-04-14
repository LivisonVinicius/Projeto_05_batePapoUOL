let nameUser;
let destinatario="Todos";
let mensagemDigitada;
let tipoMensagem="message";
function sideBar(){
    document.querySelector(".fundoSide").classList.add("active");
    document.querySelector(".sideBar").classList.add("active");
}
function hideBar(){
    document.querySelector(".fundoSide").classList.remove("active");
    document.querySelector(".sideBar").classList.remove("active");
}
function login(){
    nameUser=document.querySelector(".entrada input");
    const tryLogin=axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",{ name:`${nameUser.value}`})
    tryLogin.then(function(){
        document.querySelector(".entrada").classList.add("active");
        document.querySelector("header").classList.add("active");
    })
    tryLogin.catch(function(){
        alert("Usuário já se encontra online.")
    })
    setInterval(conection,3000)
    setInterval(buscaMensagens,3000)
    participantsOnline()
}
function conection(){
    const mantemLogin=axios.post("https://mock-api.driven.com.br/api/v6/uol/status",{ name:`${nameUser.value}`})
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
                <p><span class="time">(${response.data[contador].time})</span> ${response.data[contador].from} ${response.data[contador].text}</p>
            </div>`
            break
            case "message":
                main.innerHTML+=`<div class="chatMessage">
                <p><span class="time">(${response.data[contador].time})</span> ${response.data[contador].from} para ${response.data[contador].to}: ${response.data[contador].text}</p>
            </div>`
            break
            case "private_message":
                if(response.data[contador].from==nameUser.value ||response.data[contador].to==nameUser.value){
                    main.innerHTML+=`<div class="chatPrivate">
                <p><span class="time">(${response.data[contador].time})</span> ${response.data[contador].from} reservadamente para ${response.data[contador].to}: ${response.data[contador].text}</p>
            </div>`
                }          
            }
            contador++
        }
        let screenHeight = "" + window.innerHeight / 8;
        main.scrollIntoView(false);
        window.scrollBy(0, screenHeight);
    })
}
function participantsOnline(){
    const promise=axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(function(response){
        let contador=0
        let users=document.querySelector(".users")
        users.innerHTML=""
        while(contador<response.data.length){
            users.innerHTML+= `<div class="usuario" onclick=selecionar(this)>
            <ion-icon name="people"></ion-icon> <p>${response.data[contador].name}</p> <img src="imagens/Vector.png" alt="selecionado"/>
        </div>`
            contador++
        }
        setTimeout(participantsOnline,10000)
    })
}
function enviarMensagem(){
    mensagemDigitada=document.querySelector("footer input")
    const promise=axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",{
        from:`${nameUser.value}`,
        to:`${destinatario}`,
        text:`${mensagemDigitada.value}`,
        type:`${tipoMensagem}`
    })
    promise.then(function(){
        buscaMensagens()
        mensagemDigitada.value=""
    })
    promise.catch(function(){
        alert("Usuário não está online")
        window.location.reload()
    })
}
function selecionar(opcao){
    const opcaoSelecionada = document.querySelector(`.Selecionada`);
    if (opcaoSelecionada !== null) {
        opcaoSelecionada.classList.remove("Selecionada");
    }
    opcao.classList.add("Selecionada");
    destinatario=opcao.querySelector("p").innerHTML
}