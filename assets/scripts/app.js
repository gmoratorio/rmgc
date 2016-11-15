$(document).ready(function() {

    for (var i = 1; i < 5; i++) {
        $.getJSON("http://spreadsheets.google.com/feeds/cells/1ouyI7JWT2agLynYywzFkqnOzID8u9Q5FeSR1ZhPz1Rk/" + i + "/public/basic?alt=json-in-script&callback=?")
            .done(function(data) {
                // console.log(data.feed);
                populatePage(data);

            })
            .fail(function(data) {
                console.log(data);
            });

        // populatePages();
    }


});

function populatePage(data) {
    var thisFeed = data.feed;
    var title = thisFeed.title.$t;

    switch (title) {
        case "Master-Template":
            createTemplate(thisFeed);
            break;

        case "Events":
            break;

        case "Announcements":
            break;

        case "Officers":
            break;



    }

}

function createTemplate(feed) {
    var objArr = feed.entry;
    var summaryObject = returnSummaryObject(objArr);
    console.log(summaryObject);
    var headerArr = summaryObject.headerArr;
    for (var i = 0; i < headerArr.length; i++) {
        var heading = headerArr[i];
        var $thisElement = $("." + heading)[0];




    }

}


function returnRow(title) {
    var rowCode = "";
    var row = 0;
    for (var i = 0; i < title.length; i++) {
        var thisCharCode = title.charCodeAt(i);
        if (thisCharCode >= 48 && thisCharCode <= 57) {
            rowCode += thisCharCode;
        }
    }

    row = String.fromCharCode(rowCode);
    row = parseInt(row);
    return row;
}


function returnColumn(title) {
    var columnLetter = "";
    for (var i = 0; i < title.length; i++) {
        var thisCharCode = title.charCodeAt(i);
        if (thisCharCode >= 65 && thisCharCode <= 90) {
            var letter = String.fromCharCode(thisCharCode);
            columnLetter += letter;
        }
    }
    return columnLetter;
}



function returnSummaryObject(objectArray) {
    var summaryObject = {};
    summaryObject.rowEntryArray = [];
    var headerRow = 0;
    var headerLength = 0;
    var headerArr = [];
    var countOfRows = 0;
    var row = 0;
    var lastRow = 0;
    var column = "";

    for (var i = 0; i < objectArray.length; i++) {
        row = 0;
        column = "";
        var thisObj = objectArray[i];
        var cellTitle = thisObj.title.$t;
        var cellContent = thisObj.content.$t;
        row = returnRow(cellTitle);
        column = returnColumn(cellTitle);
        if (i === 0) {
            headerRow = row;
            countOfRows += 1;
        }

        if (row === headerRow) {
            headerLength += 1;
            headerArr.push(cellContent);

        } else if (row !== lastRow) {
            countOfRows += 1;
            lastRow = row;
        }
    }



    summaryObject.headerArr = headerArr;
    summaryObject.countOfRows = countOfRows;
    summaryObject.countOfColumns = headerLength;

    // lastRow = 0;
    // for (var j = (summaryObject.countOfColumns); j < objectArray.length; j++) {
    //     row = 0;
    //     column = "";
    //     var thisObject = objectArray[i];
    //     var title = thisObject.title.$t;
    //     var content = thisObject.content.$t;
    //     row = returnRow(title);
    //     column = returnColumn(title);
    //     if(j === summaryObject.countOfColumns){
    //       lastRow = row;
    //     }
    // }
    
    row = 0;
    while(row < summaryObject.countOfRows ){

    }

    return summaryObject;
}
