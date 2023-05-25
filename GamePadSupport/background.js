
chrome.action.onClicked.addListener((tab) => {

    if (!tab.url.includes('chrome://')) {
        chrome.scripting
        .executeScript({
            target: { tabId: tab.id },
            files: ["script.js"],
        })
        .then(() => console.log("script injected"));
    }
});
