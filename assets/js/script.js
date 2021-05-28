// Evita che la pagina sia ricaricata quando si clicca "invio" dentro al campo di input
// e specifica a button type="button"
var form = document.getElementsByTagName("form")[0];
form.onsubmit = (event) => { event.preventDefault() }

//definisco l'oggetto sessione
function sessione (lunghezzaPista,lunghezzaPistaUM,velocità,velocitàUM,tempoSessione,tempoSessioneUM,numeroBirilli){
    if (lunghezzaPistaUM=="m"){
        this.lunghezzaPista=lunghezzaPista;
    } else if (lunghezzaPistaUM=="km"){
        this.lunghezzaPista=lunghezzaPista*1000;
    }
    if (velocitàUM=="m/s"){
        this.velocità=velocità;
    } else if (velocitàUM=="km/h"){
        this.velocità=velocità/3.6;
    }
    if (tempoSessioneUM=="s"){
        this.tempoSessione=tempoSessione;
    } else if (tempoSessioneUM=="m"){
        this.tempoSessione=tempoSessione*60;
    } else if(tempoSessioneUM=="h"){
        this.tempoSessione=tempoSessione*3600;
    }
    this.numeroBirilli=numeroBirilli
    this.tempoAlGiro = function (){
        //crea il tag dello studente nella stampa dei gruppi
        return this.lunghezzaPista/this.velocità;   
    }
    this.intervalloBeep= function(){
        return this.tempoAlGiro()/this.numeroBirilli;
    }
    this.numeroBeep= function(){
        return this.tempoSessione/this.intervalloBeep();
    }
}

//genera il Beep
startBeep = function(){
    //riempio l'oggetto sessione
    lunghezzaPista=document.getElementById("lunghezzaPista").value;
    lunghezzaPistaUM=document.getElementById("lunghezzaPistaUM").value;
    velocità=document.getElementById("velocità").value;
    velocitàUM=document.getElementById("velocitàUM").value;
    tempoSessione=document.getElementById("tempoSessione").value;
    tempoSessioneUM=document.getElementById("tempoSessioneUM").value;
    numeroBirilli=document.getElementById("numeroBirilli").value;
    sessione1=new sessione(lunghezzaPista,lunghezzaPistaUM,velocità,velocitàUM,tempoSessione,tempoSessioneUM,numeroBirilli);

    //prendo la traccai audio
    var audio = new Audio('assets/audio/beep-07a.mp3');
    intervalloBeep=sessione1.intervalloBeep()*1000
    for (i=0; i<sessione1.numeroBeep(); i++) {  
        setTimeout(function(){audio.play()}, intervalloBeep*i);
      } 
}



//cosa succede quando clicco sui bottoni
document.getElementById("Start").onclick = () => startBeep();



