var click = true;

$(document).ready(function() {
    chrome.storage.local.get('isTranslating', (response) => {
        if (response.isTranslating) $('.checkbox').prop("checked", true);
        else $('.checkbox').prop("checked", false);
    })
});

document.getElementById('translate').addEventListener('click', onToggle, false);

function onToggle() {
    if (click) {
        click = !click;

        chrome.storage.local.get('isTranslating', (response) => {
            var isTranslating = !response.isTranslating;
            chrome.storage.local.set({ isTranslating })
        })

        setTimeout(function() {
            click = true;
        }, 300)


        chrome.tabs.query({},
            function(tabs) {
                for (var i = 0; i < tabs.length; ++i) {
                    chrome.tabs.sendMessage(tabs[i].id, null);
                }
            })
    }
}