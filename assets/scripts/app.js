$(document).ready(function() {

    $.getJSON("http://spreadsheets.google.com/feeds/cells/1ouyI7JWT2agLynYywzFkqnOzID8u9Q5FeSR1ZhPz1Rk/od6/public/basic?alt=json-in-script&callback=?")
        .done(function(data) {

            populatePage(data);

        })
        .fail(function(data) {
            console.log(data);
        });

    // $(window).scroll(function() {
    //     var $brand = $(".navbar-brand")[0];
    //     var $navRight = $(".navbar-right")[0];
    //     if ($(document).scrollTop() > 50) {
    //         $($brand).addClass('shrink');
    //         $($navRight).addClass('shrink');
    //     } else {
    //         $($brand).removeClass('shrink');
    //         $($navRight).removeClass('shrink');
    //     }
    // });

    var $eventsChildren = $("div.events").children().children().children();
    $($eventsChildren).hover(
        function() {
            $($eventsChildren).addClass("hover");
        },
        function() {
            $($eventsChildren).removeClass("hover");
        }
    );

});

function populatePage(data) {
    // var title = data.feed.entry[6].content.$t;
    // var image = data.feed.entry[7].content.$t;
    // console.log(image);
    //
    //
    // $main = $('main');
    // $title = $("<h2>" + title + "</h2>");
    // $image = $("<img src='" + image + "'/>");
    //
    //
    // $main.append($image);
    // $main.append($title);
    //
    // for (var i = 9; i < 12; i++) {
    //     var text = data.feed.entry[i].content.$t;
    //     $p = $("<p>" + text + "</p>");
    //     $main.append($p);
    // }

}
