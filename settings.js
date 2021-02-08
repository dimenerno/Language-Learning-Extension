var frequency = 0;

document.getElementById('set').addEventListener('click', setFreq, false);

function setFreq(){
    console.log("debug");
    var F = document.getElementById("frequency");
    frequency = F.options[F.selectedIndex].value;    
}

/*
function probabillty(number){
    return Math.random()<=number;
}
*/