//chromeとbrowserの名前空間対策
if (!("browser" in window)) {
    window.browser = chrome;
}

//設定されているショートカットをすべて出力する。
//テスト用。
// var gettingAllCommands = browser.commands.getAll();
// gettingAllCommands.then((commands) => {
//     for (let command of commands) {
//         console.log(command);
//     }
// });



//popup.jsと同じようにcontentにメッセージを送ってハイライトさせる。
//ただし、こちらはtextareaを持っていないので、LocalStorageから引っ張ってくること。
function sendSearchMessage(tabs) {
    let targetString = localStorage.getItem('target');
    browser.tabs.sendMessage(tabs[0].id, { command: "toggle", target: targetString });
}
browser.commands.onCommand.addListener(function (command) {
    if (command === "command_toggleHighlightNow") {
        browser.tabs.query({ active: true, currentWindow: true }, sendSearchMessage);
    }
});

