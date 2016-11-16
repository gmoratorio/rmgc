$(document).ready(function() {

    for (var i = 1; i < 6; i++) {
        $.getJSON("http://spreadsheets.google.com/feeds/cells/1ouyI7JWT2agLynYywzFkqnOzID8u9Q5FeSR1ZhPz1Rk/" + i + "/public/basic?alt=json-in-script&callback=?")
            .done(function(data) {

                var path = window.location.pathname;
                path = path.replace("/", "");
                path = path.replace("html", "");
                path = path.replace(".", "");
                var thisFeed = data.feed;
                var title = thisFeed.title.$t.toLowerCase();
                if ((path === title) || title === "master-template") {
                    populatePage(data);
                }


            })
            .fail(function(data) {
                console.log(data);
            });

    }


});

function populatePage(data) {
    var thisFeed = data.feed;
    var title = thisFeed.title.$t.toLowerCase();

    switch (title) {
        case "master-template":
            replace(thisFeed, title);
            break;

        case "events":
            newPosts(thisFeed, title);
            break;

        case "announcements":
            newPosts(thisFeed, title);
            break;

        case "membership":
            newPosts(thisFeed, title);
            break;

        case "officers":
            newPosts(thisFeed, title);
            break;



    }

}

function replace(feed, title) {
    var objArr = feed.entry;
    var summaryObject = returnSummaryObject(objArr);
    var workingObject = summaryObject.rowEntryArray[0];
    for (var key in workingObject) {
        var value = workingObject[key];
        var $thisElement = $("." + key)[0];


        if (key.indexOf("image") >= 0) {

            if (key.indexOf("background") >= 0) {
                $($thisElement).css("background-image", "url('" + value + "')");
            } else {
                $($thisElement).attr("src", value);
            }
        }

        if (key.indexOf("text") >= 0) {
            $($thisElement).text(value);
        }
    }


}

function newPosts(feed, title) {

    var $parentSection = $("." + title)[0];
    var objArr = feed.entry;
    var summaryObject = returnSummaryObject(objArr);
    var entryArray = summaryObject.rowEntryArray;
    var workingObject = {};
    if ((title === "events") || (title === "announcements")) {
        for (var i = 0; i < entryArray.length; i++) {
            workingObject = summaryObject.rowEntryArray[i];

            var $media = $('<div class="media"></div>');
            var $mediaLeft = $('<div class="media-left "></div>');
            var $mediaImage = $('<img class="media-object" src="' + workingObject.image + '" alt="' + workingObject.title + '">');
            $mediaLeft.append($mediaImage);
            $media.append($mediaLeft);


            var $mediaBody = $('<div class="media-body"></div>');
            var $h3 = $('<h3 class="media-heading">' + workingObject.date + '</h3>');
            $mediaBody.append($h3);

            var $h2 = $('<h2 class="media-heading">' + workingObject.title + '</h2>');
            $mediaBody.append($h2);



            var contentArr = workingObject.content;
            for (var j = 0; j < contentArr.length; j++) {
                var thisContent = contentArr[j];
                var $p = $('<p>' + thisContent + '</p>');
                $mediaBody.append($p);
            }

            if (workingObject.venue && workingObject.address) {
                var $address = $('<address>' + '<a href="' + workingObject["venue-link"] + '" target="_blank">' + workingObject.venue + '</a> ' + workingObject.address + '</address>');
                $mediaBody.append($address);
            }


            if (workingObject['fb-link']) {
                var $facebook = $('<a href="' + workingObject['fb-link'] + '" target="_blank"><p>Click to RSVP on our Facebook event</p></a>');
                $mediaBody.append($facebook);

            }

            $media.append($mediaBody);
            // debugger;
            var $wellDiv = $('<div class = "well well-lg announcement"></div>');
            $wellDiv.append($media);
            // console.log($wellDiv[0]);

            $parentSection.append($wellDiv[0]);
        }
    } else if (title === "membership") {
        var count = 0;
        for (var k = 0; k < entryArray.length; k++) {
            workingObject = summaryObject.rowEntryArray[k];
            var $rowWell = $('<div class="row well flex"></div>');

            var $col8 = $('<div class="col-sm-8"></div>');
            var $h2Center = $('<h2 class="text-center">' + workingObject.title + '</h2>');
            var $divFlex = $('<div class="flex"></div>');
            var $aBtn = $('<a class="btn btn-primary" href="' + workingObject['btn-link'] + '" target="_blank" role="button">' + workingObject['btn-text'] + '</a>');
            $col8.append($h2Center);

            var textArr = workingObject.content;
            for (var l = 0; l < textArr.length; l++) {
                var content = textArr[l];
                var $pText = $('<p>' + content + '</p>');
                $col8.append($pText);
            }
            $divFlex.append($aBtn);
            $col8.append($divFlex);

            var $col4 = $('<div class="col-sm-4"></div>');
            var $img = $('<img class = "img-responsive center-block" src="' + workingObject.image + '"/>');
            $col4.append($img);
            if (count % 2 === 0) {
                $rowWell.append($col8);
                $rowWell.append($col4);
            } else {
                $rowWell.append($col4);
                $rowWell.append($col8);
            }
            count += 1;
            $parentSection.append($rowWell[0]);
        }

    } else if (title === "officers") {
      var $standardRow = $('<div class="row flex"></div>');
        for (var m = 0; m < entryArray.length; m++) {
            workingObject = summaryObject.rowEntryArray[m];


            var $col = $('<div class="col-sm-6 col-md-4 column"></div>');
            var $thumbnail = $('<div class="thumbnail flex"></div>');
            $col.append($thumbnail);

            var $h2Centered = $('<h2 class="text-center">' + workingObject.title + '</h2>');
            var $h3Centered = $('<h3 class="text-center">' + workingObject.name + '</h3>');
            var $officerImg = $('<img class = "img-responsive" src="' + workingObject['photo-link'] + '" alt="' + workingObject.name + '"/>');
            $thumbnail.append($h2Centered);
            $thumbnail.append($h3Centered);
            $thumbnail.append($officerImg);

            var $caption = $('<div class="caption"></div>');
            var $h4 = $('<h4>' + workingObject['fun-fact-heading'] + '</h4>');
            var $pFunFact = $('<p>' + workingObject['fun-fact'] + '</p>');
            $caption.append($h4);
            $caption.append($pFunFact);

            $thumbnail.append($caption);

            $standardRow.append($col);



        }
        $parentSection.append($standardRow[0]);

    }


}


function returnRow(title) {
    var rowCode = "";
    var row = 0;
    for (var i = 0; i < title.length; i++) {
        var thisCharCode = title.charCodeAt(i);
        if (thisCharCode >= 48 && thisCharCode <= 57) {
            rowCode += String.fromCharCode(thisCharCode).toString();
        }
    }
    row = parseInt(rowCode);
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
            summaryObject.dataType = cellContent;
        } else if (i === 1) {
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
    var rowCount = 2;
    var j = summaryObject.countOfColumns + 1;
    row = 0;
    lastRow = 0;
    column = 0;
    lastColumn = 0;
    var nextColumn = 0;


    while (rowCount < summaryObject.countOfRows) {
        var thisEntryObj = {};
        for (var k = 0; k < summaryObject.countOfColumns; j++, k++) {
            var thisEntry = objectArray[j];
            var title = thisEntry.title.$t;
            var content = thisEntry.content.$t;
            var header = summaryObject.headerArr[k];
            row = returnRow(title);
            column = returnColumn(title);
            if (column !== lastColumn) {

                thisEntryObj[header] = content;
                lastColumn = returnColumn(title);
            } else if (column === lastColumn) {
                var holdP = thisEntryObj[header];
                if (holdP.constructor === Array) {
                    thisEntryObj[header].push(content);
                } else {
                    thisEntryObj[header] = [holdP];
                    thisEntryObj[header].push(content);
                }
                rowCount += 1;
            }
            if (j < objectArray.length - 1) {
                nextColumn = returnColumn(objectArray[j + 1].title.$t);
                if (column === nextColumn) {
                    k--;
                }
            }

        }
        summaryObject.rowEntryArray.push(thisEntryObj);
        rowCount += 1;

    }

    return summaryObject;
}
