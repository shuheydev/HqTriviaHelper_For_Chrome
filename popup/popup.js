(function () {

    //chromeとbrowserの名前空間対策
    if (!("browser" in window)) {
        window.browser = chrome;
    }

    // //send message to contentScript for start highlight.
    // function sendSearchMessage(tabs) {
    //     let targetTextArea = document.querySelector("#textAreaTarget");
    //     let targetString = targetTextArea.value;

    //     localStorage.setItem('target', targetString);
    //     chrome.storage.local.set({ 'target': targetString }, () => {
    //     });

    //     browser.tabs.sendMessage(tabs[0].id, { command: "search", target: targetString });
    // }
    // //Set Eventhandler to 'Search' button.
    // let replaceButton = document.querySelector("#buttonSearch");
    // replaceButton.addEventListener('click', (e) => {
    //     console.log('search')
    //     browser.tabs.query({ active: true, currentWindow: true }, sendSearchMessage);
    // });
    // //send message to contentScript for remove highlight
    // function sendClearMessage(tabs) {
    //     browser.tabs.sendMessage(tabs[0].id, { command: "clear" });
    // }
    // //Set Eventhandler to 'Search' button.
    // let clearButton = document.querySelector("#buttonClear");
    // clearButton.addEventListener('click', (e) => {
    //     console.log('clear')
    //     browser.tabs.query({ active: true, currentWindow: true }, sendClearMessage);
    // });

    // let textArea = document.querySelector("#textAreaTarget");
    // textArea.addEventListener('keyup', (e) => {
    //     if (e.keyCode === 13) {
    //         browser.tabs.query({ active: true, currentWindow: true }, sendSearchMessage);
    //     }
    // });

    // let toggleAutoHighlight = document.querySelector('#toggle_auto_highlight');
    // toggleAutoHighlight.addEventListener('click', (e) => {
    //     chrome.storage.local.set({ 'IsAutoHighlightEnabled': toggleAutoHighlight.checked }, () => {
    //     });
    // });

    function sendToggleHqTriviaMessage(tabs) {
        browser.tabs.sendMessage(tabs[0].id, { command: "toggle-hqTrivia" });
    }
    let toggleHqTrivia = document.querySelector('#toggle_hqTrivia');
    toggleHqTrivia.addEventListener('click', (e) => {
        chrome.storage.local.set({ 'IsHqTriviaHelperEnabled': toggleHqTrivia.checked }, () => {
        });
        browser.tabs.query({ active: true, currentWindow: true }, sendToggleHqTriviaMessage);
    });

    // //Restore previous input words to textarea when popup shown.
    // let targetTextArea = document.querySelector("#textAreaTarget");
    // chrome.storage.local.get("target", function (result) {
    //     targetTextArea.value = result.target;
    //     target.focus();
    // });

    // chrome.storage.local.get("IsAutoHighlightEnabled", function (result) {
    //     let isAutoHighlightEnabled = result.IsAutoHighlightEnabled;
    //     toggleAutoHighlight.checked = isAutoHighlightEnabled;
    // });

    chrome.storage.local.get("IsHqTriviaHelperEnabled", function (result) {
        let isHqTriviaHelperEnabled = result.IsHqTriviaHelperEnabled;
        toggleHqTrivia.checked = isHqTriviaHelperEnabled;
    });
})();




