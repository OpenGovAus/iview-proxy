$(document).ready(function(){
    var searchBox = $('#searchbox')
    searchBox.on('input',function(e){
        callSearch(searchBox.val())
    });
})

// This function sends a POST request to the API that handles iView searches, that we you can find shows.
// I excluded any analytics from this request that is usually used in the search bar.
function callSearch(text, page, fromLoadMore) {
    if(!page || text.length == 0) {
        page = 0
    }
    if(fromLoadMore != true) {
        $('.searchresponse').html('')
    }
    $('#loadMore').remove()
    let globalPage = page
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            let jsonReturn = JSON.parse(xhr.response).results[0].hits
            // filter response results, don't include anything without an id or a title
            jsonReturn = jsonReturn.filter((item) => typeof item.id !== 'undefined' && typeof item.title !== 'undefined')
            // Only get series/episodes
            filters = [{label: 'docType', value: 'Program'}, {label: 'docType', value: 'VideoEpisode'}]
            jsonReturn = jsonReturn.filter(candidate => candidate.docType == 'Program' || candidate.docType == 'VideoEpisode')
            for(var i = 0; i < jsonReturn.length; i++) {
                $('.searchresponse').append(`<p class="result"><a href="/show?id=${jsonReturn[i].id}">${jsonReturn[i].title}</a></p>`)
            }
            var titleList = []
            $('.searchresponse').children().each( function() {
                if(titleList.includes($(this).text())) {
                    $(this).remove()
                }
                else {
                    titleList.push($(this).text())
                }
            })
            globalPage++
            $('.searchresponse').append(`<button id="loadMore" onclick="callSearch(\'${text}\', ${globalPage}, true);">Load more</button>`)
        }
    }
    xhr.open("POST", 'https://y63q32nvdl-dsn.algolia.net/1/indexes/*/queries?x-algolia-api-key=bcdf11ba901b780dc3c0a3ca677fbefc&x-algolia-application-id=Y63Q32NVDL', true);
    xhr.send(JSON.stringify({
        "requests": [
            {
                "indexName": "ABC_production_iview_web",
                "params": "query=" + text,
                "hitsPerPage": 25,
                "page": page
            }
        ]
    }));
}