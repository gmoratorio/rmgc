$(document).ready(function() {

    // $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1ouyI7JWT2agLynYywzFkqnOzID8u9Q5FeSR1ZhPz1Rk?includeGridData=true&key=AIzaSyAW02DgWURAhAMVrDiDS13Rg7Nv-TG2e7Y")
    //feed options - list or cells
    $.getJSON("http://spreadsheets.google.com/feeds/cells/1ouyI7JWT2agLynYywzFkqnOzID8u9Q5FeSR1ZhPz1Rk/od6/public/basic?alt=json-in-script&callback=?")
        .done(function(data) {

            populatePage(data);

        })
        .fail(function(data) {
            console.log(data);
        });

    function populatePage(data) {
        // console.log(data.feed.entry);
        var title = data.feed.entry[6].content.$t;
        var image = data.feed.entry[7].content.$t;
        console.log(image);


        $main = $('main');
        $title = $("<h2>" + title + "</h2>");
        $image = $("<img src='" + image + "'/>");


        // console.log($main);
        $main.append($image);
        $main.append($title);

        for (var i = 9; i < 12; i++) {
            var text = data.feed.entry[i].content.$t;
            $p = $("<p>" + text + "</p>");
            $main.append($p);
        }

        // console.log(title + ": " + text);
    }


    // // use your spreadsheet id here
    // var SPREADSHEET_ID = '1ouyI7JWT2agLynYywzFkqnOzID8u9Q5FeSR1ZhPz1Rk'
    // $.googleSheetToJSON(SPREADSHEET_ID)
    //     .done(function(rows){
    //         // each row is a row of data from the spreadsheet
    //         console.log(rows[0]);
    //     })
    //     .fail(function(err){
    //         console.log('error!', err);
    //     });



});
