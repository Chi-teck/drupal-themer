chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {


    if (changeInfo.status != 'loading') {
        return;
    }

    chrome.pageAction.show(tabId);


});


var enabled = false;
console.log(typeof enabled);
chrome.pageAction.onClicked.addListener(function(tab) {

    //console.log('Global tab is ', tabId);
    console.log('Send message to #', tab.id);

    var request = {status: !enabled};
    chrome.tabs.sendMessage(tab.id, request, checkResponse);

    function checkResponse(response) {

        console.log(request, 'request');
        enabled = response.status;

        console.log(response, 'response');

        //console.log('Set action icon to', status ? 'images/64-enabled.png' : 'images/64-disabled.png');
        chrome.pageAction.setIcon({
            tabId: tab.id,
            path: enabled ? 'images/64-enabled.png' : 'images/64-disabled.png'
        });

    }


    //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //
    //
    //    console.log(tabs);
    //
    //});
});


