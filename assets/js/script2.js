aggiungiSessione = function (){//salva dati e aggiunge nella parte inferiore la sessione modificabile
    let var1, var2, var3, var4, p1, p2, form, t1, t2,dove,parte, button;
    form=document.getElementById("parte-1");
    var1=form.children[0].children[2].value;
    var2=form.children[0].children[3].value;
    if (var2==="m/s" || var2==="km/h"){t1=1}else if (var2==="sec" || var2==="min"){t1=2};
    var3=form.children[1].children[2].value;
    var4=form.children[1].children[3].value;
    if (var4==="sec" || var4==="min"){t2=3}else if (var4==="m" || var4==="km"){t2=4}else{t2=5};
    p1=form.children[0].children[0].innerHTML;
    p2=form.children[1].children[0].innerHTML;
    button=document.getElementsByTagName("button")[2];
    if (!var1 || !var3 || var1 < 0 || var3 < 0){
        illumina(button,"rosso");
        window.alert("Inserisci dei valori validi per la sessione.");
        return;
    }
    illumina(button,"verde");
    dove = document.getElementsByTagName("main")[0].children[4];
    parte=document.createElement('form');
    parte.className='parte';
    parte.id="parte"+i;
    parte.innerHTML=`
    <aside>
        <button class="freccia" onclick="sopra(${i},-1)">↑</button>
        <button class="freccia" onclick="sopra(${i},1)">↓</button>
    </aside>
    <section>
        <p>${p1}</p>
        <button class="cambia" onclick="cambiaS(${t1},${i})">↺</button>
        <input type="number" step=any value="${var1}">
        <select>
        </select>
    </section>
    <section>
        <p>${p2}</p>
        <button class="cambia" onclick="cambiaS(${t2},${i})">↺</button>
        <input type="number" step=any value="${var3}">
        <select>
        </select>
    </section>
    <button class="aggiungi" onclick="rimuoviSessione(${i})">-</button>
    `
    select=parte.getElementsByTagName("select");
    select[0].innerHTML=form.children[0].children[3].innerHTML;
    select[0].value=var2;
    select[1].innerHTML=form.children[1].children[3].innerHTML;
    select[1].value=var4;

    parte.onsubmit = (event) => { event.preventDefault() }

    dove.appendChild(parte);
    i+=1;
}

rimuoviSessione = function (posizione){ //rimuove la sessione 
    let sessione,j,button,div;
    sessione = document.getElementById("parte"+posizione);
    div=sessione.parentNode;
    button=sessione.getElementsByTagName("button")[4]
    illumina(button,"verde");
        setTimeout(function(){
            div.removeChild(sessione);
        },200)  
    i--;
    //se rimuovo una parte, devo cambiare gli indici di quelli che vengono dopo
    for (j=0;j<div.childElementCount;j++){
        cambiaIndice(div.children[j],j)
    }
};

aggiungiRecupero = function (){ //salva dati e aggiunge nella parte inferiore il recupero modificabile
    let form, var1, var2, dove, parte;
    form=document.getElementById("parte-2");
    var1=form.children[0].children[1].value;
    var2=form.children[0].children[2].value;
    button=document.getElementsByTagName("button")[3];
    if (!var1 || var1 < 0){
        illumina(button,"rosso");
        window.alert("Inserisci dei valori validi per il recupero.");
        return;
    }
    illumina(button,"verde");
    dove = document.getElementsByTagName("main")[0].children[4];
    parte=document.createElement('form');
    parte.className='parte';
    parte.id="parte"+i;
    parte.innerHTML=`
    <aside>
        <button class="freccia" onclick="sopra(${i},-1)">↑</button>
        <button class="freccia" onclick="sopra(${i},1)">↓</button>
    </aside>
    <section>
        <p>Recupero: </p>
        <input type="number" step=any value="${var1}">
        <select>
            <option>min</option>
            <option>sec</option>
        </select>
    </section>
    <button class="aggiungi" onclick="rimuoviSessione(${i})">-</button>
    `
    select=parte.getElementsByTagName("select");
    select[0].value=var2;

    parte.onsubmit = (event) => { event.preventDefault() }

    dove.appendChild(parte);
    i+=1;
}

cambiaS = function (tipo,posizione){//fa lo switch tra le varie tipologie di immissione dati  
    let button,delta;
    let form=document.getElementById("parte"+posizione);
    let j=0;

    delta=0;
    if (posizione>=0){delta=2} //quando ci sono le freccine
    if (tipo===1 || tipo===2){button= form.getElementsByTagName("button")[0+delta]}
    else {button= form.getElementsByTagName("button")[1+delta]}
    console.log(button)
    illumina(button,"verde");

    if (form.children[0].tagName!="SECTION"){j=1} //quando ci sono le freccine
    if (tipo===1){
        let section = form.children[0+j];
        let p = section.children[0];
        let button = section.children[1];
        let input = section.children[2];
        let select = section.children[3];
        p.innerHTML = 'Tempo al giro: ';
        button.onclick = () => cambiaS(2,posizione) ;
        input.placeholder = 'Tempo al giro';
        input.setAttribute("type", "number");
        input.step="any";
        select.innerHTML= `
        <option>sec</option>
        <option>min</option>
        `
    }
    if (tipo===2){
        let section = form.children[0+j];
        let p = section.children[0];
        let button = section.children[1];
        let input = section.children[2];
        let select = section.children[3];
        p.innerHTML = 'Velocità: ';
        button.onclick = () => cambiaS(1,posizione) ;
        input.placeholder = 'Velocità';
        input.setAttribute("type", "number");
        input.step="any";
        select.innerHTML= `
        <option>km/h</option>
        <option>m/s</option>
        `
    }
    if (tipo===3){
        let section = form.children[1+j];
        let p = section.children[0];
        let button = section.children[1];
        let input = section.children[2];
        let select = section.children[3];
        p.innerHTML = 'Distanza fase: ';
        button.onclick = () => cambiaS(4,posizione) ;
        input.placeholder = 'Distanza Fase';
        input.setAttribute("type", "number");
        input.step="any";
        select.innerHTML= `
        <option>km</option>
        <option>m</option>
        `
    }
    if (tipo===4){
        let section = form.children[1+j];
        let p = section.children[0];
        let button = section.children[1];
        let input = section.children[2];
        let select = section.children[3];
        p.innerHTML = 'Numero giri: ';
        button.onclick = () => cambiaS(5,posizione) ;
        input.placeholder = 'Numero giri';
        input.setAttribute("type", "number");
        input.step="any";
        select.id = 'numeroGiriUM';
        select.innerHTML= `
        `
    }
    if (tipo===5){
        let section = form.children[1+j];
        let p = section.children[0];
        let button = section.children[1];
        let input = section.children[2];
        let select = section.children[3];
        p.innerHTML = 'Tempo fase: ';
        button.onclick = () => cambiaS(3,posizione) ;
        input.placeholder = 'Tempo fase';
        input.setAttribute("type", "number");
        input.step="any";
        select.innerHTML= `
        <option>min</option>
        <option>sec</option>
        `
    }
}

cambiaIndice = function(form, posizione){//cambia l'indice di una sessione o di un recupero per chiamare le funzioni in maniera adeguata
    form.id='parte'+posizione;
    if (form.children[1].children[0].innerHTML==="Recupero: "){
        form.children[0].children[0].onclick= () => sopra(posizione,-1);
        form.children[0].children[1].onclick= () => sopra(posizione,1);
        form.children[2].onclick = () => rimuoviSessione(posizione);
    } else {
        form.children[0].children[0].onclick= () => sopra(posizione,-1);
        form.children[0].children[1].onclick= () => sopra(posizione,1);
        if (form.children[1].children[3].value=="m/s"){
            form.children[1].children[1].onclick = () => cambiaS(1,posizione)
        } else {
            form.children[1].children[1].onclick = () => cambiaS(2,posizione)
        };
        if (form.children[2].children[3].value=="s"){
            form.children[2].children[1].onclick = () => cambiaS(3,posizione)
        } else {
            form.children[2].children[1].onclick = () => cambiaS(4,posizione)
        };
        form.children[3].onclick = () => rimuoviSessione(posizione);
    };
    return form;
}

sopra = function(posizione1, delta){//sposta sopra o sotto le sessioni/i recuperi
    //se delta=-1 --> sopra, se delta=1 -->sotto
    let form1, posizione2, form2, t, j;
    posizione2=posizione1+delta;
    if (posizione2===-1 || posizione2===i) {//non posso anticipare il primo o posticipare l'ultimo
        window.alert("non puoi!")
        return;
    }; 
    if (delta===-1){
        t=posizione1;
        posizione1=posizione2;
        posizione2=t;
    }
    form1=document.getElementById("parte"+posizione1);
    form2=document.getElementById("parte"+posizione2);
    vecchioDiv=form1.parentNode;
    form1 = cambiaIndice(form1,posizione2);
    form2 = cambiaIndice(form2,posizione1);
    nuovoDiv=document.createElement("div");
    j=0;
    while(vecchioDiv.childElementCount>0){
        if (j!==posizione1){
            nuovoDiv.appendChild(vecchioDiv.children[0])
        } else {
            nuovoDiv.appendChild(form2);
            nuovoDiv.appendChild(form1);
        }
        j++;
    }
    vecchioDiv.parentNode.appendChild(nuovoDiv);
    vecchioDiv.parentNode.removeChild(vecchioDiv);
}

comandiStart = function (){//prima creo la stringa, poi calcolo lunghezza e durata, chiedo conferma e passo alla pagina successiva
    let stringa,contenitore,j,form, conferma, durata, lunghezza, tempo, lunghezzaPista,distanza,velocità,tempoAlGiro, button;
    button=document.getElementsByTagName("button")[document.getElementsByTagName("button").length-1]
    stringa = window.location.href.split('?')[1].split('=')[1]
    contenitore=document.getElementsByTagName("div")[0];
    for (j=0;j<contenitore.childElementCount;j++){
        form=contenitore.children[j];
        if (form.children[1].children[0].innerHTML==="Recupero: "){
            stringa=stringa+';'+form.children[1].children[1].value+'-'+form.children[1].children[2].value;
        } else {
            stringa=stringa+';'+form.children[1].children[2].value+'-'+form.children[1].children[3].value+'-'+form.children[2].children[2].value+'-'+form.children[2].children[3].value;
        };
    //come è strutturata la stringa
    // nB-lG-lGUM;v-vUM-tS-tSUM;r-rUM
    //  <--3-->  ;   <--4-->   ; <--2-->
    //poi smisto la tipologia in base alla lunghezza e all'unità di misura
    }
    if (stringa.split(';').length<=1){
        illumina(button,"rosso");
        window.alert('Inserisci almeno una sessione. Prova cliccando sul "+"');
        return;
    }
    illumina(button,"verde");
    durata=0;
    lunghezza=0;
    if (stringa.split(";")[0].split("-")[2]==="m"){
        lunghezzaPista=parseFloat(stringa.split(";")[0].split("-")[1])
    } else {
        lunghezzaPista=parseFloat(stringa.split(";")[0].split("-")[1])*1000
    }
    for (elem of stringa.split(";")){
        tempo=0;
        distanza=0;
        velocità=0;
        tempoAlGiro=0;
        numeroGiri=0;
        dati=elem.split("-");
        if (dati.length===4){//se abbiamo una sessione
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
        } else if (dati.length===2) {//se abbiamo un recupero
            if (dati[1]==="sec"){
                tempo=parseFloat(dati[0]);
            } else if (dati[1]==="min"){
                tempo=parseFloat(dati[0]*60);
            }
        };
        lunghezza+=distanza;
        durata+=tempo;
    };
    if (durata-60>0){
        durata=((parseFloat(durata)/60).toFixed(2))+" min";
    } else {
        durata=(parseFloat(durata).toFixed(0))+" sec";
    }
    if (lunghezza-1000>0){
        lunghezza=((parseFloat(lunghezza)/1000).toFixed(2))+" km";
    } else {
        lunghezza=(parseFloat(lunghezza).toFixed(0))+" m";
    }
    conferma= window.confirm('La durata totale della prova è poco più di '+durata+'.\nLa lunghezza totale della prova è poco più di '+lunghezza+'.\nSe vuoi passare alla pagina successiva premi su OK.')
        if (conferma){
            window.location.href = 'index3.html?stringa=' + stringa;
        }
}

// Evita che la pagina sia ricaricata quando si clicca "invio" dentro al campo di input
// e specifica a button type="button"
let form = document.getElementsByTagName("form");
form[0].onsubmit = (event) => { event.preventDefault() }
form[1].onsubmit= (event) => { event.preventDefault() }

if(stringa = window.location.href.split('?')[1].split('=')[1]){//controlla che il link contenga i dati che servono
    //Penso bisognerebbe controllarlo meglio in futuro tuttavia
    let input,article;
    article=document.getElementsByTagName("article")[0];
    input=stringa.split('-');
    article.children[0].innerHTML="I birilli sono "+input[0]+".";
    article.children[1].innerHTML="La pista è lunga "+input[1]+input[2]+".";
} else {
    window.alert("Torna alla pagina precedente, non hai ancora inserito i dati della pista!");
    window.location.href = 'index.html';
}

//una variabile globale che mi serve per le varie funzioni, in particolare per riconoscere sessioni/recuperi
let i=0;