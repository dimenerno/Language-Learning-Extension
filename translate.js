var wordlist = [{
        "eng": "apple",
        "kor": "사과"
    },
    {
        "eng": "point out",
        "kor": "지적"
    },
    {
        "eng": "inoculation",
        "kor": "접종"
    },
    {
        "eng": "estimate",
        "kor": "추산"
    }
];

var favorites = [];

/**
 * Removes the helper box when the user clicks outside the box
 * @param {*} e 
 */
function removeBox(e) {
    console.log(boxPresent);
    if (e == null || !document.getElementById('box').contains(e.target)) {
        var $box = $('#box');
        if (boxPresent == 0) {
            boxPresent = 1;
        } else {
            $box.animate({ opacity: 0 }, 500);
            setTimeout(() => { document.getElementById('box').remove(); }, 500);
            document.removeEventListener("click", removeBox);
            boxPresent = 0;
        }
    }
}

function arrayRemove(arr, value) {

    return arr.filter(function(ele) {
        return ele != value;
    });
}


/**
 * When the helper box is present, the value is 1. If not, 0.
 */
var boxPresent = 0;

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function replaceAll(str, term, replacement) {
    return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
}

function changeToEng(korWord, engWord) {
    var innerHTML = document.body.innerHTML;
    var engWordFormatted = ("<span class=\"highlight " + engWord.replace(/\s/g, "") + "\">") + engWord + "</span>"
    document.body.innerHTML = replaceAll(innerHTML, korWord, engWordFormatted);
}

function addWindow(korWord, engWord) {
    /* Start of jQuery element creation */
    var $star = $('<img>');
    $star
        .attr("src", chrome.extension.getURL("/media/star.png"))
        .addClass("star")
        .on("click", function() {
            if (favorites.some(favorites => favorites['kor'] === korWord)) {
                // If the word is already added(the star is lit)
                // and the user clicked the star,
                // dim the star and remove the word from favorites  
                $(this).css("opacity", 0.5).css("filter", "grayscale(100%)");
                favorites = favorites.filter(function(el) { return el.kor != korWord; });
            } else {
                // If the word hadn't been added(the star is dim)
                // and the user clicked the star,
                // lit the star and add the word to favorites
                $(this).css("opacity", 1).css("filter", "grayscale(0%)");
                favorites.push({ "kor": korWord, "eng": engWord });
            }

            console.log(favorites);
        });

    var $cross = $('<img>');
    $cross
        .attr("src", chrome.extension.getURL("/media/cross.png"))
        .addClass("cross")
        .on("click", function() {
            var win = window.open("https://en.dict.naver.com/#/search?query=" + engWord, '_blank');
            win.focus();
        });
    /* End of jQuery element creation */

    $("." + engWord.replace(/\s/g, "")).on("click", function() {
        /* Start of box creation */
        if (boxPresent == 1) {
            removeBox();
            boxPresent = 0;
        }
        var $box = $('<div>').attr("id", "box");

        $box.html("<h3>" + engWord + "</h3><p>" + korWord + "</p>")
            .css("left", $(this).offset().left)
            .css("top", $(this).offset().top + $(this).height())
            .addClass("explanation")
            .appendTo("body");

        $box.find("h3").append($star).append($cross);
        /* End of box creation */

        // Listen for removeBox event
        document.addEventListener("click", removeBox);
    });
}


function changeToKor(korWord, engWord) {
    var innerHTML = document.body.innerHTML;
    var engWordFormatted = ("<span class=\"highlight " + engWord.replace(/\s/g, "") + "\">") + engWord + "</span>"
    document.body.innerHTML = replaceAll(innerHTML, engWordFormatted, korWord);
}

function main() {
    chrome.storage.local.get('isTranslating', (response) => {
        if (response.isTranslating) {
            for (var i = 0; i < wordlist.length; i++) {
                changeToEng(wordlist[i].kor, wordlist[i].eng);
            }
            for (var i = 0; i < wordlist.length; i++) {
                addWindow(wordlist[i].kor, wordlist[i].eng);
            }
        } else {
            for (var i = 0; i < wordlist.length; i++) {
                changeToKor(wordlist[i].kor, wordlist[i].eng);
            }
        }
    })
}

main()

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) { main() })