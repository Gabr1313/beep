illumina = function (elemento,colore) {
    elemento.style.outline= "3px solid #eaad5a";
    if (colore==="verde"){elemento.style.backgroundColor="rgb(48, 204, 0)";}
    else if (colore==="rosso"){elemento.style.backgroundColor="rgb(204, 48, 0)";}
    elemento.style.textShadow= "-1px 0 #ffffff, 0 1px #ffffff, 1px 0 #ffffff, 0 -1px #ffffff";
    elemento.style.border= "4px solid #5f1d21";
    setTimeout(function(){
        elemento.onmouseover = () => BGGiallo(elemento);
        elemento.onmouseout = () => BGBianco(elemento); //c'è qualche problema a far partire questa funzione dopo con il cambio di tipologia
        elemento.style.outline= "none";
        elemento.style.backgroundColor="#eaad5a";
        elemento.style.textShadow= "none";
        elemento.style.border= "2px solid #5f1d21";
    },150);
}

BGGiallo = function (elemento) {
    elemento.style.backgroundColor = "rgb(255, 217, 0)";
}

BGBianco = function (elemento) {
    elemento.style.backgroundColor = "#eaad5a";
}
