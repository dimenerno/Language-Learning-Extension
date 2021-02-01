chrome.storage.local.get('favorites', (response) => {
    var $list = $('ul')
    console.log(response.favorites)
    $.each(response.favorites, function(i) {
        var li = $('<li>')
            .addClass('word-item')
            .text(response.favorites[i].eng + "\t" + response.favorites[i].kor)
            .appendTo($list);
    });
    $list.appendTo("body")
})