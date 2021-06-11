aggiungiSessione = function (){
    //salva dati
    let var1, var2, var3, var4, p1, p2, form, t1, t2;
    form=document.getElementById("parte-1");
    var1=form.children[0].children[2].value;
    var2=form.children[0].children[3].value;
    if (var2==="m/s"){t1=1}else{t1=2};
    var3=form.children[1].children[2].value;
    var4=form.children[1].children[3].value;
    if (var2==="s"){t2=3}else{t2=4};
    p1=form.children[0].children[0].innerHTML;
    p2=form.children[1].children[0].innerHTML;
    if (!var1 || !var3 || var1 < 0 || var3 < 0){
        window.alert("Inserisci dei valori validi per la sessione.");
        return;
    }
    let dove = document.getElementsByTagName("main")[0].children[3];
    let parte=document.createElement('form');
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
        <input type="number" value="${var1}">
        <select>
            <option>m/s</option>
            <option>km/h</option>
        </select>
    </section>
    <section>
        <p>${p2}</p>
        <button class="cambia" onclick="cambiaS(${t2},${i})">↺</button>
        <input type="number" value="${var3}">
        <select>
            <option>s</option>
            <option>m</option>
        </select>
    </section>
    <button class="aggiungi" onclick="rimuoviSessione(${i})">-</button>
    `
    select=parte.getElementsByTagName("select");
    select[0].value=var2;
    select[1].value=var4;

    parte.onsubmit = (event) => { event.preventDefault() }

    dove.appendChild(parte);
    i+=1;
}

rimuoviSessione = function (posizione){
    let sessione,j;
    sessione = document.getElementById("parte"+posizione);
    div=sessione.parentNode;
    div.removeChild(sessione);
    i--;
    //se rimuovo una parte, devo cambiare gli indici di quelli che vengono dopo
    for (j=0;j<div.childElementCount;j++){
        cambiaIndice(div.children[j],j)
    }
};

aggiungiRecupero = function (){
    //salva dati
    let form, var1, var2;
    form=document.getElementById("parte-2");
    var1=form.children[0].children[1].value;
    var2=form.children[0].children[2].value;  
    if (!var1 || var1 < 0){
        window.alert("Inserisci dei valori validi per il recupero.");
        return;
    }
    let dove = document.getElementsByTagName("main")[0].children[3];
    let parte=document.createElement('form');
    parte.className='parte';
    parte.id="parte"+i;
    parte.innerHTML=`
    <aside>
        <button class="freccia" onclick="sopra(${i},-1)">↑</button>
        <button class="freccia" onclick="sopra(${i},1)">↓</button>
    </aside>
    <section>
        <p>Recupero: </p>
        <input type="number" value="${var1}">
        <select>
            <option>s</option>
            <option>m</option>
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

cambiaS = function (tipo,posizione){
    //manca la conversione dei dati! MA NON PENSO MAI LA METTERò 
    //perchè comunque non potrei scegliere e quale dei 2 valori arrivare ecc.
    
    //fa lo switch tra le varie tipologie di immissione dati
    let form=document.getElementById("parte"+posizione);
    let j=0;
    if (form.children[0].tagName!="SECTION"){j=1} //quando ci sono le freccine
    if (tipo===1){
        let section = form.children[0+j];
        let p = section.children[0];
        let button = section.children[1];
        let input = section.children[2];
        let select = section.children[3];
        p.innerHTML = 'Tempo al giro: ';
        button.onclick = () => cambiaS(2,posizione) ;
        input.id = 'tempoAlGiro';
        input.placeholder = 'Tempo al giro'
        select.id = 'tempoAlGiroUM'
        select.innerHTML= `
        <option>s</option>
        <option>m</option>
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
        input.id = 'velocità';
        input.placeholder = 'Velocità'
        select.id = 'velocitàUM'
        select.innerHTML= `
        <option>m/s</option>
        <option>km/h</option>
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
        input.id = 'distanzaFase';
        input.placeholder = 'Distanza Fase'
        select.id = 'distanzaFaseUM'
        select.innerHTML= `
        <option>m</option>
        <option>km</option>
        `
    }
    if (tipo===4){
        let section = form.children[1+j];
        let p = section.children[0];
        let button = section.children[1];
        let input = section.children[2];
        let select = section.children[3];
        p.innerHTML = 'Tempo fase: ';
        button.onclick = () => cambiaS(3,posizione) ;
        input.id = 'tempoFase';
        input.placeholder = 'Tempo fase'
        select.id = 'tempoFaseUM'
        select.innerHTML= `
        <option>s</option>
        <option>m</option>
        `
    }
}

cambiaIndice = function(form, posizione){
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

sopra = function(posizione1, delta){
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

comandiStart = function (){
    //passa alla pagina successiva
    //prima creo la stringa, poi il resto va bene (vedi in basso il come)
    let contenitore,j,form, conferma, durata, lunghezza;

    contenitore=document.getElementsByTagName("div")[0];
    for (j=0;j<contenitore.childElementCount;j++){
        form=contenitore.children[j];
        if (form.children[1].children[0].innerHTML==="Recupero: "){
            stringa=stringa+';'+form.children[1].children[1].value+'-'+form.children[1].children[2].value;
        } else {
            stringa=stringa+';'+form.children[1].children[2].value+'-'+form.children[1].children[3].value+'-'+form.children[2].children[2].value+'-'+form.children[2].children[3].value;
        };
    }
    if (stringa.split(';').length<=1){
        window.alert("Inserisci almeno una sessione.");
        return;
    }
    durata="***";
    lunghezza="***";
    conferma= window.confirm('La durata della prova è: '+durata+'.\nLa lunghezza della prova è: '+lunghezza+'.\nQuando vuoi iniziare premi su OK.')
        if (conferma){
            window.location.href = 'pagina3.html?stringa=' + stringa;
        }
}

// Evita che la pagina sia ricaricata quando si clicca "invio" dentro al campo di input
// e specifica a button type="button"
let form = document.getElementsByTagName("form");
form[0].onsubmit = (event) => { event.preventDefault() }
form[1].onsubmit= (event) => { event.preventDefault() }


let stringa;
//come è strutturata la stringa
// nB-lG-lGUM;v-vUM-tS-tSUM;r-rUM
//  <--3-->  ;     <--4-->     ; <--2-->
//poi smisto la tipologia in base alla lunghezza e all'unità di misura

if(stringa = window.location.href.split('?')[1].split('=')[1]){
    let input,article;
    article=document.getElementsByTagName("article")[0];
    input=stringa.split('-');
    article.children[0].innerHTML="I birilli sono "+input[0];
    article.children[1].innerHTML="La pista è lunga "+input[1]+input[2];
} else {
    window.alert("Torna alla pagina precedente, non hai ancora inserito i dati della pista!");
    window.location.href = 'pagina1.html';
}

let i=0;

