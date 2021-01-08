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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(flag);
    if (flag % 2 == 0) replaceWithHighlight("사과", "apple");
    else replaceNoHighlight("apple", "사과");
    flag++;

    function replaceWithHighlight(textToFind, textToReplace) {
        var innerHTML = document.body.innerHTML;
        var indexes = getIndicesOf(textToFind, innerHTML);
        var offset = textToReplace.length - textToFind.length + "<span style='background-color: yellow;'>".length + "</span>".length;

        sendResponse({ count: indexes.length });

        for (var i = 0; i < indexes.length; i++) {
            var index = indexes[i];
            if (index >= 0) {
                innerHTML = innerHTML.substring(0, index + i * offset) + "<span style='background-color: yellow;'>" + textToReplace + "</span>" + innerHTML.substring(index + textToFind.length + i * offset);
                document.body.innerHTML = innerHTML;
            }
        }
    }

    function replaceNoHighlight(textToFind, textToReplace) {
        var innerHTML = document.body.innerHTML;
        var indexes = getIndicesOf(textToFind, innerHTML);
        var offset = textToReplace.length - textToFind.length - "<span style='background-color: yellow;'>".length - "</span>".length;
        var prefix = "<span style='background-color: yellow;'>";
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