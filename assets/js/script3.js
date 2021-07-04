creaSessione = function (pezzo) {
    let pezzi, parte, dove, p1, p2;
    pezzi=pezzo.split("-");
    dove = document.getElementsByTagName("main")[0];
    parte=document.createElement('form');
    parte.className='parte';
    if (pezzi[1]==="m/s" || pezzi[1]==="km/h") {
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
    <div class="container">
        <div class="progressBar">
        <div class="progressBarFull">
        </div>     
        </div>
    </div>
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
    <div class="container">
        <div class="progressBar">
        <div class="progressBarFull"></div>     
        </div>
    </div>
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

emettiBeep = function (delta){
    audio2.play();
    try {
        let pezzo,intervalloBeep,numeroBeep,percentuale,deltaPercentuale;
        pezzo=traccia[index];
        if (pezzo.length===2){
            beepIndex=0;
            intervalloBeep=pezzo[0];
            numeroBeep=pezzo[1];
            deltaPercentuale=100/numeroBeep;
            percentuale=delta*deltaPercentuale;
            document.getElementsByClassName('progressBarFull')[index].style.width=percentuale+"%"
            let intervalloTempo=setInterval(function(){
                if (pausa){
                    clearInterval(intervalloTempo); //non posso mettere solo il return perchè altrimenti poi riparte
                    return; //serve per non emettere il beep di troppo dopo il click
                }
                audio.play();
                beepIndex++;
                numeroBeep--;
                percentuale+=deltaPercentuale;
                document.getElementsByClassName('progressBarFull')[index].style.width=percentuale+"%"
                if(numeroBeep<=delta){
                  clearInterval(intervalloTempo);
                  index++;
                  emettiBeep(0);
                }
            },intervalloBeep*1000);
        } else /*if (pezzo.length===1)*/{
            recupero=pezzo[0];
            secondi=0;
            deltaPercentuale=100/recupero;
            percentuale=delta*deltaPercentuale;
            document.getElementsByClassName('progressBarFull')[index].style.width=percentuale+"%"
            let intervalloTempo=setInterval(function(){
                if (pausa){//idem leggi sopra
                    clearInterval(intervalloTempo);
                    return;
                }
                secondi++;
                percentuale+=deltaPercentuale;
                document.getElementsByClassName('progressBarFull')[index].style.width=percentuale+"%"
                if(secondi+delta>=recupero){
                  clearInterval(intervalloTempo);
                  index++;
                  emettiBeep(0);
                }
            },1000);
        }
    }
    catch{
        pausa=true;
        return;
    }
}

play = function (){
    if (funzioneInCorso||!pausa){illuminaR(document.getElementsByTagName("button")[0]);}
    else {
        illuminaV(document.getElementsByTagName("button")[0]);
        pausa=false;
        emettiBeep(deltaX);
        deltaX=0;
    }
}

pause = function (){
    if (funzioneInCorso||pausa){illuminaR(document.getElementsByTagName("button")[1]);}
    else {
        let aspetta;
        funzioneInCorso=true;
        illuminaV(document.getElementsByTagName("button")[1]);
        pausa=true;
        if (traccia[index].length===2){
            deltaX=beepIndex;
            aspetta=traccia[index][0]*1000
        } else {
            deltaX=secondi;
            aspetta=1000
        }
        setTimeout(function(){funzioneInCorso=false;},aspetta);  
    }
}

restart = function (){
    if (funzioneInCorso || index===traccia.length){illuminaR(document.getElementsByTagName("button")[2]);}
    else {
        funzioneInCorso=true;
        let aspetta;
        illuminaV(document.getElementsByTagName("button")[2]);
        pausaCopia=pausa;
        pausa=true;
        if (index===traccia.length){index--}
        if (traccia[index].length===2){aspetta=traccia[index][0]*1000}
        else {aspetta=1000};
        // aspettare questo tempo è necessario se no succedono casini: 
        // non ricomincerebbe il ciclo o non si accorgerebbe che la sessione precedente è terminata 
        // e quindi ne partirebbero 2 in contemporanea
        setTimeout(function(){
            funzioneInCorso=false;
            if (!pausaCopia){
                pausa=false;
                emettiBeep(0);
                deltaX=0;
            }
            else {
                deltaX=0;
                document.getElementsByClassName('progressBarFull')[index].style.width="0%"
            }
        },aspetta);  
    }
}

next = function (){
    if (funzioneInCorso || index===traccia.length){illuminaR(document.getElementsByTagName("button")[3]);}
    else {
        let aspetta;
        funzioneInCorso=true;
        illuminaV(document.getElementsByTagName("button")[3]);
        pausaCopia=pausa;
        pausa=true;
        if (traccia[index].length===2){aspetta=traccia[index][0]*1000}
        else {aspetta=1000};
        //idem sopra
        setTimeout(function(){
            funzioneInCorso=false;
            index++;
            if (!pausaCopia){
                document.getElementsByClassName('progressBarFull')[index-1].style.width="100%";
                pausa=false;
                emettiBeep(0);
                deltaX=0;
            }
            else {
                deltaX=0;
                document.getElementsByClassName('progressBarFull')[index-1].style.width="100%"
            }
        },aspetta);
    } 
}


previous = function (){
    if (funzioneInCorso){illuminaR(document.getElementsByTagName("button")[4]);}
    else {
        let aspetta;
        funzioneInCorso=true;
        illuminaV(document.getElementsByTagName("button")[4]);
        pausaCopia=pausa;
        pausa=true;
        if (index===traccia.length){aspetta=0}
        else if (traccia[index].length===2){aspetta=traccia[index][0]*1000}
        else {aspetta=1000};
        //idem sopra
        setTimeout(function(){
            funzioneInCorso=false;
            index--;
            if (index===-1){index=0}
            if (!pausaCopia){
                document.getElementsByClassName('progressBarFull')[index+1].style.width="0%";
                pausa=false;
                emettiBeep(0);
                deltaX=0;
            }
            else {
                deltaX=0;
                document.getElementsByClassName('progressBarFull')[index+0].style.width="0%";
                if (index!==traccia.length-1){document.getElementsByClassName('progressBarFull')[index+1].style.width="0%";}
            }
        },aspetta);
    }
}

reset = function (){
    illuminaV(document.getElementsByTagName("button")[5]);
    location.reload(); 
}

illuminaV = function (tag){
    tag.style.backgroundColor = "lightgreen";
    setTimeout(function(){
        tag.style.backgroundColor = "white";
    },200);
}

illuminaR = function (tag){
    tag.style.backgroundColor = "lightsalmon";
    setTimeout(function(){
        tag.style.backgroundColor = "white";
    },200);
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
    let numeroBirilli,lunghezzaPista;
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
    emettiBeep(0);  
}

let traccia,index,audio,pausa,beepIndex,deltaX,secondi,funzioneInCorso;
index=0;
pausa=false;
audio = new Audio('assets/audio/beep-07a.mp3');
audio2 = new Audio('assets/audio/beep-09.mp3');
deltaX=0;
funzioneInCorso=false;

//manca forse il tempo della sessione e a quanto sono arrivato (da mettere magari con la barra)
//manca anche il tempo totale e a che punto sono sul totale