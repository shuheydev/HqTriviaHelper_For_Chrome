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

        let inputElem = document.querySelector("input[name='q']");
        if (inputElem == null)
            return;
        let searchText = inputElem.value;
        console.log(searchText);

        //Extract Question string
        let reQuestion = /^.+\(/i;
        let question = reQuestion.exec(searchText);
        let questionString = question[0];

        searchText = searchText.replace(questionString, "");

        questionString = questionString.substring(0, questionString.length - 1);

        console.log(questionString);

        //Extract Option string and execute google search.
        let reOptions = /\".+?\"/gi;
        let processes = [];
        while ((option = reOptions.exec(searchText)) != null) {
            let optionString = option[0];
            console.log(optionString);
            processes.push(await GoogleSearch(questionString, optionString));
        }
        //wait all completed.
        await Promise.all(processes);

        console.log(SearchResults);



        const endTime = performance.now();
        console.log(endTime - startTime);
        console.log("all completed");
    }
}
window.addEventListener("load", initOnLoadCompleted, false);

const GoogleSearch = async function (question, option) {
    await $.ajax({
        url: 'https://www.google.com/search?q=' + question + " " + option,
        type: 'GET',
        dataType: 'html'
    })
        .done((data) => {
            // console.log(data);
            SearchResults[option] = data;
        });
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