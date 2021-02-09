var frequency = 0;

document.getElementById('set').addEventListener('click', setFreq, false);

function setFreq(){
    chrome.storage.local.get('frequency', (response) => {
    var F = document.getElementById("frequency");
    frequency = F.options[F.selectedIndex].value;
    chrome.storage.local.set({ frequency });    
    alert(frequency);
    })
}

/*
function probabillty(number){
    return Math.random()<=number;
}
*/