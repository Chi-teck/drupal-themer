chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'loading') {
        chrome.pageAction.show(tabId);
    }
});

var statuses = [];
chrome.pageAction.onClicked.addListener(function(tab) {

    var request = {status: !statuses[tab.id]};
    chrome.tabs.sendMessage(tab.id, request, checkResponse);

    function checkResponse(response) {
        statuses[tab.id] = response.status;
        chrome.pageAction.setIcon({
            tabId: tab.id,
            path: statuses[tab.id] ? 'images/32-enabled.png' : 'images/32-disabled.png'
        });

    }

});
