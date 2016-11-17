$(document).ready(function() {
    for (var i = 2; i < 8; i++) {
        $.getJSON("https://spreadsheets.google.com/feeds/cells/1ouyI7JWT2agLynYywzFkqnOzID8u9Q5FeSR1ZhPz1Rk/" + i + "/public/basic?alt=json-in-script&callback=?")
            .done(function(data) {
                var path = window.location.pathname;

                path = path.replace("html", "");
                path = path.replace(".", "");
                if (path === "/") {
                    path = "index";
                }
                path = path.replace("/", "");
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


    importTemplate(thisFeed, title);

    if (title !== "master-template") {
        newPosts(thisFeed, title);
    }

}

function importTemplate(feed, title) {
    var objArr = feed.entry;
    var summaryObject = returnSummaryObject(objArr, "template");
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

    var parentSection = $("." + title)[0];
    var objArr = feed.entry;
    var summaryObject = returnSummaryObject(objArr, "append");
    var entryArray = summaryObject.rowEntryArray;
    var workingObject = {};
    var source = null;
    var template = null;
    var context = {};
    var html = null;
    var $templateContainer = null;
    var i = 0;



    if ((title === "events") || (title === "announcements")) {
        source = $("#" + title + "-entry-template").html();
        template = Handlebars.compile(source);


        for (i = 0; i < entryArray.length; i++) {
            workingObject = summaryObject.rowEntryArray[i];
            context = workingObject;
            html = template(context);
            parentSection.append($(html)[0]);

        }

    } else if (title === "membership") {
        var count = 0;
        for (i = 0; i < entryArray.length; i++) {
            workingObject = summaryObject.rowEntryArray[i];
            $templateContainer = $('<div class="row well flex"></div>');

            source4 = $("#" + title + "-4-entry-template").html();
            source8 = $("#" + title + "-8-entry-template").html();
            template4 = Handlebars.compile(source4);
            template8 = Handlebars.compile(source8);
            context = workingObject;

            html4 = template4(context);
            html8 = template8(context);

            if (count % 2 === 0) {
                $templateContainer.append(html8);
                $templateContainer.append(html4);
            } else {
                $templateContainer.append(html4);
                $templateContainer.append(html8);
            }
            count += 1;

            parentSection.append($templateContainer[0]);
        }

    } else if (title === "officers") {
        $templateContainer = $('<div class="row flex"></div>');
        for (i = 0; i < entryArray.length; i++) {
            workingObject = summaryObject.rowEntryArray[i];

            source = $("#" + title + "-entry-template").html();
            template = Handlebars.compile(source);
            context = workingObject;
            html = template(context);

            $templateContainer.append(html);

        }

        parentSection.append($templateContainer[0]);
    } else if (title === "index") {
        $templateContainer = $('<div class="row"></div>');
        source = $("#" + title + "-entry-template").html();
        template = Handlebars.compile(source);

        for (i = 0; i < entryArray.length; i++) {
            workingObject = summaryObject.rowEntryArray[i];
            context = workingObject;
            html = template(context);

            $templateContainer.append(html);

        }
        parentSection.append($templateContainer[0]);
    }


    var $activeTag = $(".activate-me");
    $activeTag.addClass("active");

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




function returnSummaryObject(objectArray, type) {
    var summaryObject = {};
    summaryObject.rowEntryArray = [];
    var headerRow = 0;
    var headerLength = 0;
    var headerArr = [];
    var countOfRows = 0;
    var countOfTemplateRows = 0;
    var row = 0;
    var lastRow = 0;
    var column = "";
    var start = 0;
    var end = 0;
    var endTemplateIndex = 0;
    for (var h = 0; h < objectArray.length; h++) {
        var currentCell = objectArray[h];
        var currentContent = currentCell.content.$t;
        var currentTitle = currentCell.title.$t;
        row = returnRow(currentTitle);

        if (row !== lastRow) {
            countOfTemplateRows += 1;
            lastRow = row;
        }

        if (currentContent === "end-template") {
            endTemplateIndex = h;
            break;
        }
    }


    if (type === "template") {
        start = 0;
        end = endTemplateIndex + 1;
    } else {
        start = endTemplateIndex + 1;
        end = objectArray.length;

    }


    lastRow = 0;
    for (var i = start; i < end; i++) {
        row = 0;
        column = "";
        var thisObj = objectArray[i];
        var cellTitle = thisObj.title.$t;
        var cellContent = thisObj.content.$t;
        row = returnRow(cellTitle);
        column = returnColumn(cellTitle);

        if (i === start) {
            summaryObject.dataType = cellContent;
        } else if (i === start + 1) {
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
    var rowCount = 3;
    var j = start + summaryObject.countOfColumns + 1;
    row = 0;
    lastRow = 0;
    column = 0;
    lastColumn = 0;
    var nextColumn = 0;


    while (rowCount < summaryObject.countOfRows + 1) {
        var thisEntryObj = {};
        thisEntryObj.contentIsString = true;
        for (var k = 0; k < summaryObject.countOfColumns; j++, k++) {
            var thisEntry = objectArray[j];
            var title = thisEntry.title.$t;
            var content = thisEntry.content.$t;
            if (content === "end-template") {
                break;
            }
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
                    thisEntryObj.contentIsString = false;
                    k--;
                }
            }

        }

        summaryObject.rowEntryArray.push(thisEntryObj);
        rowCount += 1;

    }
    return summaryObject;

}
