creaSessione = function (pezzo) {
    let pezzi, parte, dove, p1, p2;
    pezzi=pezzo.split("-");
    dove = document.getElementsByTagName("main")[0];
    parte=document.createElement('form');
    parte.className='parte';
    if (pezzi[1]==="m/s" || pezzi[1]==="m/s") {
        p1="Velocità: ";
    } else if (pezzi[1]==="s" || pezzi[1]==="m") {
        p1="Tempo al giro: ";
    };
    if (pezzi[3]==="sec" || pezzi[3]==="min") {
        p2="Tempo fase: ";
    } else if (pezzi[3]==="m" || pezzi[3]==="km") {
        p2="Distanza fase: ";
    } else if (pezzi[3]==="") {
        p2="Numero giri: ";
    };
    parte.innerHTML=`
    <section>
        <p>${p1}</p>
        <p class="input">${pezzi[0]}</p>
        <p class="select">${pezzi[1]}</p>
    </section>
    <section>
        <p>${p2}</p>
        <p class="input">${pezzi[2]}</p>
        <p class="select">${pezzi[3]}</p>
    </section>
    `
    dove.appendChild(parte);
}

creaRecupero = function (pezzo) {
    let pezzi, parte, dove;
    pezzi=pezzo.split("-");
    dove = document.getElementsByTagName("main")[0];
    parte=document.createElement('form');
    parte.className='parte';
    parte.innerHTML=`
    <section>
        <p>Recupero: </p>
        <p class="input">${pezzi[0]}</p>
        <p class="select">${pezzi[1]}</p>
    </section>
    `
    dove.appendChild(parte);
}

creaTracciaS = function (pezzo, lunghezzaPista,numeroBirilli){//numero di beep e intervallo tra i vari beep
    let dati,intervalloBeep,numeroBeep,velocità,tempoAlGiro,distanza;
    dati=pezzo.split("-");

    if (dati[1]==="m/s"){ //controllo il primo dato immesso
        velocità=parseFloat(dati[0]);
    } else if (dati[1]==="km/h"){
        velocità=parseFloat(dati[0]/3.6);
    } else {
        if (dati[1]==="sec"){
            tempoAlGiro=parseFloat(dati[0]);
        } else if (dati[1]==="min"){
            tempoAlGiro=parseFloat(dati[0])/60;
        }
        velocità=lunghezzaPista/tempoAlGiro;
    }
    if (dati[3]==="sec"){ //controllo il secondo dato immesso
        tempo=parseFloat(dati[2]);
    } else if (dati[3]==="min"){
        tempo=parseFloat(dati[2])*60; 
    } else {
        if (dati[3]==="m"){
            distanza=parseFloat(dati[2]);
        } else if (dati[3]==="km"){
            distanza=parseFloat(dati[2])*1000;
        } else if (dati[3]===""){
            distanza=parseFloat(dati[2])*lunghezzaPista;
        }
        tempo=distanza/velocità;
    }
    intervalloBeep=(lunghezzaPista/numeroBirilli)/velocità;
    numeroBeep=parseInt(tempo/intervalloBeep);
    return [intervalloBeep,numeroBeep];
   
}

creaTracciaR = function (pezzo){
    let pezzi;
    pezzi=pezzo.split("-");  
    if (pezzi[1]==="sec"){
        return [parseFloat(pezzi[0])];
    } else if (pezzi[1]==="min"){
        return [parseFloat(pezzi[0])*60];
    }
}

emettiBeep = function (traccia,audio){
    try {
        let pezzo,intervalloBeep,numeroBeep;
        pezzo=traccia.shift();
        if (pezzo.length===2){
            intervalloBeep=pezzo[0];
            numeroBeep=pezzo[1];
            audio.play();//posso cambiare il suono del primo beep
            let intervalloTempo=setInterval(function(){
                audio.play();
                numeroBeep--;
                if(numeroBeep<=0){
                  clearInterval(intervalloTempo);
                  emettiBeep(traccia,audio);
                }
            },intervalloBeep*1000);
        } else /*if (pezzo.length===1)*/{
            recupero=pezzo[0];
            setTimeout(function(){emettiBeep(traccia,audio);},recupero*1000);
        }
    }
    catch{
        return;
    }
}

play = function (){

}

pause = function (){

}

quit = function (){

}

previous = function (){

}

next = function (){

}





if(stringa = window.location.href.split('?')[1].split('=')[1]){//controlla che il link contenga i dati che servono
    //Penso bisognerebbe controllarlo meglio in futuro tuttavia
    let input,article;
    article=document.getElementsByTagName("article")[0];
    input=stringa.split(";")[0].split('-');
    article.children[0].innerHTML="I birilli sono "+input[0]+".";
    article.children[1].innerHTML="La pista è lunga "+input[1]+input[2]+".";
} else {
    window.alert("Torna alla iniziale, c'è quale problema alla URL!");
    window.location.href = 'index2.html';
}

window.onload=function(){ //leggo la URL e creo le sessioni grafiche
    let audio,traccia,numeroBirilli,lunghezzaPista;
    traccia=[]
    numeroBirilli=stringa.split(";")[0].split('-')[0];
    if (stringa.split(";")[0].split('-')[2]==="m"){
        lunghezzaPista=parseFloat(stringa.split(";")[0].split('-')[1]);
    } else if (stringa.split(";")[0].split('-')[2]==="km"){
        lunghezzaPista=parseFloat(stringa.split(";")[0].split('-')[1])*1000;
    }

    for (element of stringa.split(";")){
        if (element.split("-").length===4) {
            creaSessione(element);
            traccia.push(creaTracciaS(element,lunghezzaPista,numeroBirilli));
        } else if (element.split("-").length===2){
            creaRecupero(element);
            traccia.push(creaTracciaR(element));
        }
    }

    audio = new Audio('assets/audio/beep-07a.mp3');
    emettiBeep(traccia,audio);











    audio = new Audio('assets/audio/beep-07a.mp3');
    
}


//SERVE ARROTONDARE I TEMPI, DEVO DECIDERE SE PER ECCESSO O PER DIFETTO, MI SA FARò IL PRIMO CHE CAPITA

