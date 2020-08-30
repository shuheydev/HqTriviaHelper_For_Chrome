//chromeとbrowserの名前空間対策
if (!("browser" in window)) {
    window.browser = chrome;
}

var IsHighlight = false;

//EventHandler when page loaded.
async function initOnLoadCompleted(e) {
    //add handler to event that receive message from popup page.
    browser.runtime.onMessage.addListener((message) => {
        switch (message.command) {
            case 'search'://'search' button clicked.
                Highlight(message.target);
                IsHighlight = true;
                break;
            case 'clear'://'clear' button clicked.
                Highlight("");
                IsHighlight = false;
                break;
            case 'toggle'://'Shif+Alt+L'Shortcut
                if (IsHighlight) {
                    Highlight("");
                    IsHighlight = false;
                }
                else {
                    Highlight(message.target);
                    IsHighlight = true;
                }
                break;
            case 'toggle-highlight-on-googlesearch':
                chrome.storage.local.get("IsHighlightOnSearchEnabled", function (result) {
                    let isHighlightOnSearchEnabled = result.IsHighlightOnSearchEnabled;
                    if (isHighlightOnSearchEnabled) {
                        let inputElem = document.querySelector("input[name='q']");
                        if (inputElem == null)
                            return;

                        let searchText = inputElem.value;

                        //Extract strings surrounded by `"`.
                        let quotedString = ExtractQuotedString(searchText);
                        Highlight(quotedString);
                        IsHighlight = true;
                    }
                    else {
                        Highlight("");
                        IsHighlight = false;
                    }
                });
                break;
        }
    });

    //highlight after loadcompleted
    //this must be executed after the window is fully loaded
    if (document.readyState === 'complete') {
        const startTime = performance.now();

        console.log("load completed");

        // let inputElem = document.querySelector("input[name='q']");
        // if (inputElem == null)
        //     return;
        // let searchText = inputElem.value;

        let searchText = GetSearchText(document);
        console.log(searchText);

        //Extract Question string
        // let reQuestion = /^.+\(/i;
        // let question = reQuestion.exec(searchText);
        // let questionString = question[0];

        let questionString = GetQuestionString(searchText);
        let optionString = searchText.replace(questionString, "");

        questionString = questionString.substring(0, questionString.length - 1);

        console.log(questionString);

        //Extract Option string and execute google search.
        // let reOptions = /\".+?\"/gi;
        // let processes = [];
        // let optionIndex = 0;
        // while ((option = reOptions.exec(optionString)) != null) {
        //     let option = option[0];
        //     console.log(option);
        //     processes.push(await GoogleSearch(questionString, optionString, optionIndex++));
        // }

        let options = GetOptions(optionString);
        // let processes = [];
        // let optionIndex = 0;
        // for (i = 0; i < options.length; i++) {
        //     let option = options[i];
        //     console.log(option);
        //     processes.push(await GoogleSearch(questionString, option, optionIndex++));
        // }

        // //wait all completed.
        // let searchResults;
        // await Promise.all(processes).then((results) => searchResults = results);

        let searchResults = await SearchEveryOptionsAsync(options, questionString);
        console.log(searchResults);

        //send search result to background page
        // chrome.runtime.sendMessage({ command: "sendSearchResults", searchResults: SearchResults });

        const endTime = performance.now();
        console.log(endTime - startTime);
        console.log("all completed");
    }
}
window.addEventListener("load", initOnLoadCompleted, false);

async function SearchEveryOptionsAsync(options, questionString) {
    let processes = [];
    let optionIndex = 0;
    for (i = 0; i < options.length; i++) {
        let option = options[i];
        console.log(option);
        processes.push(await GoogleSearch(questionString, option, optionIndex++));
    }

    //wait all completed.
    let searchResults;
    await Promise.all(processes).then((results) => searchResults = results);

    return searchResults;
}

function GetSearchText(doc) {
    let inputElem = doc.querySelector("input[name='q']");
    if (inputElem == null)
        return;
    let searchText = inputElem.value;

    return searchText;
}
function GetQuestionString(searchText) {
    let reQuestion = /^.+\(/i;
    let question = reQuestion.exec(searchText);
    let questionString = question[0];

    return questionString;
}
function GetOptions(optionString) {
    let options = [];
    let reOptions = /\".+?\"/gi;
    while ((option = reOptions.exec(optionString)) != null) {
        options.push(option[0]);
    }

    return options;
}


const GoogleSearch = async function (question, option, optionIndex) {
    let result;
    await $.ajax({
        url: 'https://www.google.com/search?q=' + question + " " + option,
        type: 'GET',
        dataType: 'html'
    })
        .done((data) => {
            // console.log(data);
            // SearchResults[optionIndex] = { option: option, data: data, index: optionIndex };
            result = { option: option, data: data, index: optionIndex };
        });

    return result;
}

let SearchResults = {};

function ExtractQuotedString(inputText) {
    let reQuotedWord = /\".+?\"/gi;

    let result = "";
    //Get quoted string
    while ((m = reQuotedWord.exec(inputText)) != null) {
        let quotedWord = m[0];
        result += quotedWord;
        result += " ";
    }

    return result;
}

function AutoHighlight() {
    chrome.storage.local.get("IsAutoHighlightEnabled", function (result) {
        let isAutoHighlightEnabled = result.IsAutoHighlightEnabled;

        if (isAutoHighlightEnabled == false)
            return;

        chrome.storage.local.get("target", function (result) {
            let inputText = result.target;
            if (typeof inputText === "undefined")
                return;

            Highlight(inputText);
            IsHighlight = true;
        });
    });
}