# SearchAndHighlight_For_Chrome
This is a tool for helping play HQ Trivia, a chrome extension.
When you search HQ Trivia's whole question text on Chrome browser, this extension search each combinations of Quesion and Option on `Google search`, then show you search results in 3 column then highlight each option.

![image](https://user-images.githubusercontent.com/43431002/91674649-8480f900-eb74-11ea-87e3-d2e22affb0ce.png)

This help you when you play HQ Trivia and check your answer is correct or not, in single execution of search.  

This is MIT license.

# Installation

First of all, clone or download this project to your computer.

Second, install to your Chrome browser through developer mode. 

1. Go to chrome://extensions/
2. Click `Load unpacked`
3. Select the folder then install wil begin.
4. Click this extension's icon on your Chrome browser, then enable `highlight` feature.
![clipboard_20200831010200](https://user-images.githubusercontent.com/43431002/91674920-8c8d6880-eb75-11ea-8574-e91c61a9c246.png)

That's all about install.

# How to Use

Copy Trivia question text, like below.

```
Which office has Vienna's ex-mayor Michael Häupl recently taken over? ("Chairman of the Vienna Farmers' Union" OR "President of Volkshilfe Wien" OR "City Councilor for Housing"
```

then, paste to your address bar on Chrome browser.
![image](https://user-images.githubusercontent.com/43431002/91675087-0faebe80-eb76-11ea-83d6-8cbddbb6d269.png)

then, press `Enter` key execute search.

Each combination of `Question` and `Option` will be searched using Google,forexample, in the case of using text above, 3 combinations will be created and searched.

```
Which office has Vienna's ex-mayor Michael Häupl recently taken over? "Chairman of the Vienna Farmers' Union"

Which office has Vienna's ex-mayor Michael Häupl recently taken over? "President of Volkshilfe Wien"

Which office has Vienna's ex-mayor Michael Häupl recently taken over? "City Councilor for Housing"
```

Results are below, 3 search results will be shown in 3 column.

![image](https://user-images.githubusercontent.com/43431002/91674649-8480f900-eb74-11ea-87e3-d2e22affb0ce.png)
