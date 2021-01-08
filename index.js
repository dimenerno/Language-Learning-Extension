var click = true;
document.addEventListener('DOMContentLoaded', function(e) {
    document.getElementById('translate').addEventListener('click', onToggle, false);

    function onToggle() {
        if (click) {
            click = !click;

            setTimeout(function() {
                click = true;
            }, 200)

            chrome.tabs.query({ currentWindow: true, active: true },
                function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, 'hi', setCount);
                })
        }
    }

    function setCount(res) {
        const div = document.createElement('div');
        div.textContent = `${res.count} words translated`;
        document.body.appendChild(div);
    }
}, false);