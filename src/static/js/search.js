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
            // filter response results, dont include anything without an id or a title
            jsonReturn = jsonReturn.filter((item) => typeof item.id !== 'undefined')
            jsonReturn = jsonReturn.filter((item) => typeof item.title !== 'undefined')
            // dont include anything that isnt a 'VideoEpisode'
            jsonReturn = jsonReturn.filter((item) => item.docType == 'VideoEpisode')
            for(var i = 0; i < jsonReturn.length; i++) {
                $('.searchresponse').append(`<p><a href="/show?id=${jsonReturn[i].id}">${jsonReturn[i].title}</a></p>`)
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