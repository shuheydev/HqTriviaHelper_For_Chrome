//chromeとbrowserの名前空間対策
if (!("browser" in window)) {
    window.browser = chrome;
}

var IsHighlight = false;

//EventHandler when page loaded.
async function initOnLoadCompleted(e) {
    const startTime = performance.now();
    //execute if switch is ON.
    chrome.storage.local.get("IsHqTriviaHelperEnabled", async function (result) {
        let isHqTriviaHelperEnabled = result.IsHqTriviaHelperEnabled;

        if (!isHqTriviaHelperEnabled)
            return;

        let searchText = GetSearchText(document);
        console.log(searchText);

        //Extract Question string
        let questionString = GetQuestionString(searchText);

        //Extract Question string
        let optionString = GetOpsionString(searchText, questionString);

        console.log(questionString);

        //Extract Option string
        let options = GetOptions(optionString);

        //wait all completed.
        let searchResults = await SearchEveryOptionsAsync(options, questionString);
        // console.log(searchResults);

        //Reconstruct page
        ReConstrucPage(document, searchResults);

        let quotedString = options.join(' ');
        Highlight(quotedString);
        IsHighlight = true;

        const endTime = performance.now();
        console.log(endTime - startTime);
        console.log("all completed");
    });

}
window.addEventListener("load", initOnLoadCompleted, false);

function ReConstrucPage(doc, searchResults) {
    let bodyElem = doc.querySelector('body');
    //clear Body
    bodyElem.innerHTML = "";

    //Add each option's search result
    for (i = 0; i < searchResults.length; i++) {
        InsertSearchResult(bodyElem, searchResults[i]);
    }
}
function InsertSearchResult(bodyElem, searchResult) {
    let index = searchResult.index + 1;

    //parse search result html
    let parser = new DOMParser();
    let optionHtml = searchResult.data;
    let optionDoc = parser.parseFromString(optionHtml, 'text/html');

    //remove search form from search result
    optionDoc.querySelector('#searchform').remove();

    //prepare the element that insert option's search result to
    let optionBody = optionDoc.querySelector('body');
    bodyElem.insertAdjacentHTML('beforeend', `<div id="option${index}" style="width: 33.3333%; float: left;overflow:scroll;"><div>option${index}</div></div>`);

    //then insert option' search result
    let insertPosition = bodyElem.querySelector(`#option${index} div`);
    insertPosition.insertAdjacentHTML('afterbegin', optionBody.innerHTML);

    //add option' name for information.
    let option = searchResult.option;
    insertPosition.insertAdjacentHTML('beforebegin', `<div style="font-size: x-large;">${option}</div>`);
}

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
    questionString = questionString.substring(0, questionString.length - 1);

    return questionString;
}
function GetOpsionString(searchText, questionString) {
    let optionString = searchText.replace(questionString, "");

    return optionString;
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
            result = { option: option, data: data, index: optionIndex };
        });

    return result;
}

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