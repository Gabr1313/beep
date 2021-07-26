// Evita che la pagina sia ricaricata quando si clicca "invio" dentro al campo di input
// e specifica a button type="button"
let form = document.getElementsByTagName("form")[0];
form.onsubmit = (event) => { event.preventDefault() }

comandiNext = function (){
    //salva dati
    let numeroBirilli=document.getElementById("numeroBirilli").value;
    let lunghezzaGiro=document.getElementById("lunghezzaGiro").value;
    let lunghezzaGiroUM=document.getElementById("lunghezzaGiroUM").value;
    let button=document.getElementsByTagName("button")[0];
    if (!lunghezzaGiro || !numeroBirilli || lunghezzaGiro < 0 || numeroBirilli < 0){
        illumina(button,"rosso");
        setTimeout(function(){
            window.alert("Inserisci i dati validi.");
        },200)      
    } else {
        //carica pagina2 passando i parametri
        illumina(button,"verde");
        setTimeout(function(){
            window.location.href = 'index2.html?stringa='+numeroBirilli+'-'+lunghezzaGiro+'-'+lunghezzaGiroUM;
        },200)
    }
}




