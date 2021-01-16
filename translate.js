function getIndicesOf(searchStr, str) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }

    var startIndex = 0,
        index, indices = [];

    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();

    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

var flag = 0;
var boxPresent = 0;

function removeBox(e) {
    console.log(boxPresent);
    if (!document.getElementById('box').contains(e.target)) {
        if (boxPresent == 0) {
            boxPresent = 1
        } else {
            document.getElementById('box').remove();
            document.removeEventListener("click", removeBox);
            boxPresent = 0;
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (flag % 2 == 0) {
        replaceWithHighlight("공급", "supply");
        replaceWithHighlight("지적", "point out");
        replaceWithHighlight("접종", "inoculation");
        replaceWithHighlight("추산", "estimate");
        addWindow("공급", "supply");
        addWindow("지적", "point out");
        addWindow("접종", "inoculation");
        addWindow("추산", "estimate");
    } else {
        replaceNoHighlight("공급", "supply");
        replaceNoHighlight("지적", "point out");
        replaceNoHighlight("접종", "inoculation");
        replaceNoHighlight("추산", "estimate");
    }
    flag++;

    function replaceWithHighlight(textToFind, textToReplace) {
        var innerHTML = document.body.innerHTML;
        var indexes = getIndicesOf(textToFind, innerHTML);
        var offset = textToReplace.length - textToFind.length + ("<span class=\"highlight " + textToReplace + "\">").length + "</span>".length;

        sendResponse({ count: indexes.length });

        for (var i = 0; i < indexes.length; i++) {
            var index = indexes[i];
            if (index >= 0) {
                innerHTML = innerHTML.substring(0, index + i * offset) + ("<span class=\"highlight " + textToReplace + "\">") + textToReplace + "</span>" + innerHTML.substring(index + textToFind.length + i * offset);
                document.body.innerHTML = innerHTML;
            }
        }
    }

    function addWindow(textToFind, textToReplace) {
        var $star = $('<img>');
        $star
            .attr("src", chrome.extension.getURL("/media/star.png"))
            .addClass("star")
            .on("click", function() {
                $(this).css("opacity", 1).css("filter", "grayscale(0%)");
            });

        var $cross = $('<img>');
        $cross
            .attr("src", chrome.extension.getURL("/media/cross.png"))
            .addClass("cross")
            .on("click", function() {
                var win = window.open("https://en.dict.naver.com/#/search?query=" + textToReplace, '_blank');
                win.focus();
            });

        $("." + textToReplace).on("click", function() {
            var $box = $('<div>').attr("id", "box");

            $box.html("<h3>" + textToReplace + "</h3><p>" + textToFind + "</p>")
                .css("left", $(this).offset().left)
                .css("top", $(this).offset().top + $(this).height())
                .addClass("explanation")
                .appendTo("body");

            $box.find("h3").append($star).append($cross);
            document.addEventListener("click", removeBox);
        });
    }

    function replaceNoHighlight(textToReplace, textToFind) {
        var innerHTML = document.body.innerHTML;
        var indexes = getIndicesOf(textToFind, innerHTML);
        var offset = textToReplace.length - textToFind.length - ("<span class=\"highlight " + textToFind + "\">").length - "</span>".length;
        var prefix = "<span class=\"highlight " + textToFind + "\">";
        var suffix = "</span>";

        sendResponse({ count: indexes.length });

        for (var i = 0; i < indexes.length; i++) {
            var index = indexes[i];
            if (index >= 0) {
                innerHTML = innerHTML.substring(0, index + i * offset - prefix.length) + textToReplace + innerHTML.substring(index + textToFind.length + i * offset + suffix.length);
                document.body.innerHTML = innerHTML;
            }
        }
    }
})