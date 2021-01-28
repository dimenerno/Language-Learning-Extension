var click = true;

$(document).ready(function() {
    chrome.storage.local.get('isTranslating', (response) => {
        console.log(response.isTranslating);
        if (response.isTranslating) $('.checkbox').prop("checked", true);
        else $('.checkbox').prop("checked", false);
    })
});

document.getElementById('translate').addEventListener('click', onToggle, false);

function onToggle() {
    if (click) {
        click = !click;

        chrome.storage.local.get('isTranslating', (response) => {
            console.log(response.isTranslating);
            var isTranslating = !response.isTranslating;
            chrome.storage.local.set({ isTranslating })
        })

        setTimeout(function() {
            click = true;
        }, 200)

        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, null, null);
                // chrome.tabs.sendMessage(tabs[0].id, 'hi', setCount);
            })
    }
}