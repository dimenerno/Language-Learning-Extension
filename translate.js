var wordlist = [{
        "eng": "a veces",
        "kor": ["가끔", "가끔씩"],
        "part": "adv"
    },
    {
        "eng": "afuera",
        "kor": ["밖"],
        "part": "adv"
    },
    {
        "eng": "ahora",
        "kor": ["지금"],
        "part": "adv"
    },
    {
        "eng": "amigo",
        "kor": ["친구"],
        "part": "n"
    },
    {
        "eng": "amar",
        "kor": ["사랑하다"],
        "part": "v"
    },
    {
        "eng": "antes de",
        "kor": ["전에", "이전"],
        "part": "adv"
    },
    {
        "eng": "aquí",
        "kor": ["여기"],
        "part": "adv"
    },
    {
        "eng": "arriba",
        "kor": ["위에", "위쪽에"],
        "part": "adv"
    },
    {
        "eng": "así",
        "kor": ["이렇게", "저렇게"],
        "part": "adv"
    },
    {
        "eng": "aún",
        "kor": ["아직", "아직도"],
        "part": "adv"
    },
    {
        "eng": "casi",
        "kor": ["거의"],
        "part": "adv"
    },
    {
        "eng": "cómo",
        "kor": ["처럼"],
        "part": "prep"
    },
    {
        "eng": "cual",
        "kor": ["어느"],
        "part": "adj"
    },
    {
        "eng": "cuando",
        "kor": ["언제"],
        "part": "adv"
    },
    {
        "eng": "debajo",
        "kor": ["밑", "아래"],
        "part": "prep"
    },
    {
        "eng": "decir",
        "kor": ["말하다"],
        "part": "v"
    },
    {
        "eng": "después de",
        "kor": ["전에", "이전"],
        "part": "adv"
    },
    {
        "eng": "durante",
        "kor": ["동안"],
        "part": "adv"
    },
    {
        "eng": "él",
        "kor": ["그가", "그는"],
        "part": "n"
    },
    {
        "eng": "ella",
        "kor": ["그녀가", "그녀는"],
        "part": "n"
    },
    {
        "eng": "ellos",
        "kor": ["그들이", "그들은"],
        "part": "n"
    },
    {
        "eng": "en",
        "kor": ["안에"],
        "part": "prep"
    },
    {
        "eng": "este",
        "kor": ["이것"],
        "part": "n"
    },
    {
        "eng": "feliz",
        "kor": ["행복한", "기쁜"],
        "part": "adj"
    },
    {
        "eng": "gente",
        "kor": ["사람들"],
        "part": "n"
    },
    {
        "eng": "grande",
        "kor": ["큰", "크다"],
        "part": "adj"
    },
    {
        "eng": "hacer",
        "kor": ["하다", "만들다"],
        "part": "v"
    },
    {
        "eng": "ir",
        "kor": ["가다"],
        "part": "v"
    },
    {
        "eng": "muchas veces",
        "kor": ["종종", "자주"],
        "part": "adv"
    },
    {
        "eng": "mismo",
        "kor": ["같은", "같다"],
        "part": "adj"
    },
];

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
            $box.animate({ opacity: 0 }, 300);
            setTimeout(() => { document.getElementById('box').remove(); }, 300);
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
    var innerText = document.body.innerText;
    var engWordFormatted = ("<span class=\"highlight " + engWord.replace(/\s/g, "") + "\">") + engWord + "</span>"
    for (var i = 0; i < korWord.length; i++) {
        document.body.innerText = replaceAll(innerText, korWord[i], engWordFormatted);
    }
}

function addWindow(korWord, engWord) {
    /* Start of jQuery element creation */
    var $star = $('<img>');
    chrome.storage.local.get('favorites', (response) => {
        var favorites = response.favorites
        if (favorites.some(favorites => favorites['eng'] === engWord)) {
            $star
                .attr("src", chrome.extension.getURL("/media/star.png"))
                .addClass("star-lit")
                .on("click", function() {
                    // If the word is already added(the star is lit)
                    // and the user clicked the star,
                    // dim the star and remove the word from favorites 
                    $(this).addClass("star-dim").removeClass("star-lit")
                    favorites = favorites.filter(function(el) { return el.eng != engWord; });
                    chrome.storage.local.set({ favorites });
                });
        } else {
            $star
                .attr("src", chrome.extension.getURL("/media/star.png"))
                .addClass("star-dim")
                .on("click", function() {
                    // If the word hadn't been added(the star is dim)
                    // and the user clicked the star,
                    // lit the star and add the word to favorites
                    $(this).addClass("star-lit").removeClass("star-dim")
                    favorites.push({ "kor": korWord, "eng": engWord });
                    chrome.storage.local.set({ favorites });
                });
        }

    })


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
    var innerText = document.body.innerText;
    var engWordFormatted = ("<span class=\"highlight " + engWord.replace(/\s/g, "") + "\">") + engWord + "</span>"
    document.body.textContent = replaceAll(innerText, engWordFormatted, korWord);
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