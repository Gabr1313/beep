creaSessione = function (pezzo) {
    let pezzi, parte, dove, p1, p2, p;
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
        p2="Tempo sessione: ";
    } else if (pezzi[3]==="m" || pezzi[3]==="km") {
        p2="Distanza sessione: ";
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

    p=document.createElement("p");
    if (traccia[traccia.length-1][2]>60){
        p.innerHTML="0.00 / "+(traccia[traccia.length-1][2]/60).toFixed(2) + " min";
    } else{
        p.innerHTML="0.00 / "+traccia[traccia.length-1][2].toFixed(2) + " sec";
    }
    document.getElementsByClassName('progressBar')[traccia.length-1].appendChild(p);
}

creaRecupero = function (pezzo) {
    let pezzi, parte, dove, p;
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

    p=document.createElement("p");
    if (traccia[traccia.length-1][0]>60){
        p.innerHTML="0.00 / "+(traccia[traccia.length-1][0]/60).toFixed(2) + " min";
    } else{
        p.innerHTML="0.00 / "+traccia[traccia.length-1][0].toFixed(2) + " sec";
    }
    document.getElementsByClassName('progressBar')[traccia.length-1].appendChild(p);
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
    distanza=velocità*tempo;
    intervalloBeep=(lunghezzaPista/numeroBirilli)/velocità;
    numeroBeep=Math.ceil(tempo/intervalloBeep); //non so se sarebbe meglio Math.round()
    lunghezzaTotale+=distanza;
    tempoTotale+=intervalloBeep*numeroBeep;
    return [intervalloBeep,numeroBeep,intervalloBeep*numeroBeep];
   
}

creaTracciaR = function (pezzo){
    let pezzi;
    pezzi=pezzo.split("-");  
    if (pezzi[1]==="sec"){
        tempoTotale+=parseFloat(pezzi[0]);
        return [parseFloat(pezzi[0])];
    } else if (pezzi[1]==="min"){
        tempoTotale+=parseFloat(pezzi[0])*60;
        return [parseFloat(pezzi[0])*60];
    }
}

emettiBeep = function (delta){
    audio2.play();
    try {
        let pezzo,intervalloBeep,numeroBeep,percentuale,deltaPercentuale,tempo;
        pezzo=traccia[index];
        if (pezzo.length!==1){
            beepIndex=delta;
            intervalloBeep=pezzo[0];
            numeroBeep=pezzo[1];
            deltaPercentuale=100/numeroBeep;
            percentuale=delta*deltaPercentuale;
            tempo=beepIndex*intervalloBeep;
            let intervalloTempo=setInterval(function(){
                if (pausa){
                    audio2.play();
                    clearInterval(intervalloTempo); //non posso mettere solo il return perchè altrimenti poi riparte
                    funzioneInCorso=false;
                    if (!pausaCopia){ //serve per far ripartire il beep nel minor tempo possibile quando non si è in pausa
                        pausa=false;
                        emettiBeep(0);
                        pausaCopia=true;
                    }
                    return; //serve per non emettere il beep di troppo dopo il click
                }

                tempo+=intervalloBeep;
                str=document.getElementsByClassName('progressBar')[index].children[1].innerHTML;
                str=" /"+str.split('/')[1];
                if(str.split(' ')[str.split(' ').length-1]==="sec"){
                    str=tempo.toFixed(2)+str;
                } else {
                    str=(tempo/60).toFixed(2)+str;
                }              
                document.getElementsByClassName('progressBar')[index].children[1].innerHTML=str;

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
            secondi=delta;
            deltaPercentuale=100/recupero;
            percentuale=delta*deltaPercentuale;
            document.getElementsByClassName('progressBarFull')[index].style.width=percentuale+"%";
            let intervalloTempo=setInterval(function(){
                if (pausa){
                    audio2.play();
                    clearInterval(intervalloTempo); //non posso mettere solo il return perchè altrimenti poi riparte
                    funzioneInCorso=false;
                    if (!pausaCopia){
                        pausa=false;
                        emettiBeep(0);
                        pausaCopia=true;
                    }
                    return; //serve per non emettere il beep di troppo dopo il click
                }
                secondi++;
                str=document.getElementsByClassName('progressBar')[index].children[1].innerHTML;
                str=" /"+str.split('/')[1];
                if(str.split(' ')[str.split(' ').length-1]==="sec"){
                    str=secondi.toFixed(2)+str;
                } else {
                    str=(secondi/60).toFixed(2)+str;
                }
                document.getElementsByClassName('progressBar')[index].children[1].innerHTML=str;

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
    if (funzioneInCorso||!pausa){illumina(document.getElementsByTagName("button")[0],"rosso");}
    else {
        document.getElementsByTagName("button")[4]
        illumina(document.getElementsByTagName("button")[0],"verde");
        pausa=false;
        emettiBeep(deltaX);
        deltaX=0;
    }
}

pause = function (){
    if (funzioneInCorso||pausa){illumina(document.getElementsByTagName("button")[1],"rosso");}
    else {
        funzioneInCorso=true;
        pausa=true;
        illumina(document.getElementsByTagName("button")[1],"verde");
        if (traccia[index].length!==1){
            deltaX=beepIndex;
        } else {
            deltaX=secondi;
        } 
    }
}

restart = function (){
    if (funzioneInCorso || index===traccia.length){illumina(document.getElementsByTagName("button")[2],"rosso");}
    else {
        funzioneInCorso=true;
        pausaCopia=pausa;
        pausa=true;
        illumina(document.getElementsByTagName("button")[2],"verde");
        if (index===traccia.length){index--}
        str=document.getElementsByClassName('progressBar')[index].children[1].innerHTML;
        str="0.00 /"+str.split('/')[1];
        document.getElementsByClassName('progressBar')[index].children[1].innerHTML=str;
        document.getElementsByClassName('progressBarFull')[index].style.width="0%";
        deltaX=0;
        if (pausaCopia){
            funzioneInCorso=false;
        } 
    }
}

next = function (){
    if (funzioneInCorso || index===traccia.length){illumina(document.getElementsByTagName("button")[3],"rosso");}
    else {
        funzioneInCorso=true;
        pausaCopia=pausa;
        pausa=true;
        illumina(document.getElementsByTagName("button")[3],"verde");
        document.getElementsByClassName('progressBarFull')[index].style.width="100%";
        str=document.getElementsByClassName('progressBar')[index].children[1].innerHTML;

        if(str.split(' ')[str.split(' ').length-1]==="sec"){
            str=traccia[index][traccia[index].length-1].toFixed(2)+" /"+str.split('/')[1];
        } else {
            str=(traccia[index][traccia[index].length-1]/60).toFixed(2)+" /"+str.split('/')[1];
        }
        document.getElementsByClassName('progressBar')[index].children[1].innerHTML=str;
        index++;
        deltaX=0;
        if (pausaCopia){
            funzioneInCorso=false;
        } 
    }
}

previous = function (){
    if (funzioneInCorso){illumina(document.getElementsByTagName("button")[4],"rosso");}
    else {
        funzioneInCorso=true;
        pausaCopia=pausa;
        pausa=true;
        illumina(document.getElementsByTagName("button")[4],"verde");
        if (index===0){index++}
        index--;
        document.getElementsByClassName('progressBarFull')[index].style.width="0%";
        str=document.getElementsByClassName('progressBar')[index].children[1].innerHTML;
        str="0.00 /"+str.split('/')[1];
        document.getElementsByClassName('progressBar')[index].children[1].innerHTML=str;
        if (index!==traccia.length-1){
            document.getElementsByClassName('progressBarFull')[index+1].style.width="0%";
            str=document.getElementsByClassName('progressBar')[index+1].children[1].innerHTML;
            str="0.00 /"+str.split('/')[1];
            document.getElementsByClassName('progressBar')[index+1].children[1].innerHTML=str;
        }
        deltaX=0;
        if (pausaCopia){
            funzioneInCorso=false;
        } 
    }
}

reset = function (){
    illumina(document.getElementsByTagName("button")[5],"verde");
    location.reload(); 
}

if(stringa = window.location.href.split('?')[1].split('=')[1]){//controlla che il link contenga i dati che servono
    //Penso bisognerebbe controllarlo meglio in futuro tuttavia
    let input,article;
    article=document.getElementsByTagName("ul")[0];
    input=stringa.split(";")[0].split('-');
    article.children[0].innerHTML="I birilli sono "+input[0]+".";
    article.children[1].innerHTML="La pista è lunga "+input[1]+" "+input[2]+".";
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
            traccia.push(creaTracciaS(element,lunghezzaPista,numeroBirilli));
            creaSessione(element);
        } else if (element.split("-").length===2){
            traccia.push(creaTracciaR(element));
            creaRecupero(element);
        }
    }
    
    if (tempoTotale-60>0){
        document.getElementsByTagName("ul")[0].children[2].innerHTML="La durata totale è "+(tempoTotale/60).toFixed(2) + " min.";
    } else {
        document.getElementsByTagName("ul")[0].children[2].innerHTML="La durata totale è "+tempoTotale.toFixed(0) + " sec.";
    }
    if (lunghezzaTotale-1000>0){
        document.getElementsByTagName("ul")[0].children[3].innerHTML="La distanza totale è "+(lunghezzaTotale/1000).toFixed(2) + " km.";
    } else {
        document.getElementsByTagName("ul")[0].children[3].innerHTML="La distanza totale è "+lunghezzaTotale.toFixed(0) + " m.";
    }

    emettiBeep(0);
}

let traccia,index,audio,pausa,beepIndex,deltaX,secondi,funzioneInCorso,pausaCopia,lunghezzaTotale,tempoTotale;
index=0;
pausa=false;
audio = new Audio('assets/audio/beep-07a.mp3');
audio2 = new Audio('assets/audio/beep-09.mp3');
deltaX=0;
funzioneInCorso=false;
pausaCopia=true;
lunghezzaTotale=0;
tempoTotale=0;
