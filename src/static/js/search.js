$(document).ready(function(){
    var searchBox = $('#searchbox')
    searchBox.on('input',function(e){
        callSearch(searchBox.val())
    });
})

// This function sends a POST request to the API that handles iView searches, that we you can find shows.
// I excluded any analytics from this request that is usually used in the search bar.
function callSearch(text) {
    $('.searchresponse').html('')
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var jsonReturn = JSON.parse(xhr.response).results[0].hits
            for(var i = 0; i < jsonReturn.length; i++) {
                // skip episodes that dont contain an id
                if (typeof jsonReturn[i].id === "undefined")
                    continue
                var title = jsonReturn[i].title
                if(title != 'undefined') {
                    $('.searchresponse').append(`<p><a href="/show?id=${jsonReturn[i].id}">${title}</a></p>`)
                }
            }
        }
    }
    xhr.open("POST", 'https://y63q32nvdl-dsn.algolia.net/1/indexes/*/queries?x-algolia-api-key=bcdf11ba901b780dc3c0a3ca677fbefc&x-algolia-application-id=Y63Q32NVDL', true);
    xhr.send(JSON.stringify({
        "requests": [
            {
                "indexName": "ABC_production_iview_web",
                "params": "query=" + text
            }
        ]
    }));
}