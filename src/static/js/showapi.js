var seriesID = $('meta[name=id]').attr('content')

if($('meta[name=progtype]').attr('content') == 'show') {  // auth for the m3u8 is adapted from here: https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/abc.py
    var sig = $('meta[name=sig]').attr('content')
    var path = $('meta[name=dir]').attr('content')
    
    tokenXhr = new XMLHttpRequest();
    tokenXhr.onreadystatechange = function() {
        if(tokenXhr.readyState == XMLHttpRequest.DONE) {
            token = tokenXhr.response
            apiXhr = new XMLHttpRequest();
            apiXhr.onreadystatechange = function() {
                if(apiXhr.readyState == XMLHttpRequest.DONE) {
                    formats = JSON.parse(apiXhr.response)._embedded.playlist
                    for(var i = 0; i < formats.length; i++)
                    {
                        if(formats[i].type == 'program') {
                            if('720' in formats[i].streams.hls) {
                                var m3u8 = formats[i].streams.hls['720'] + `&hdnea=${token}`
                            }
                            else {
                                var m3u8 = formats[i].streams.hls.sd + `&hdnea=${token}`
                            }
                            console.log(m3u8)
                            $('.video-container').html(
                                `<video id="show-vid" class="video-js vjs-default-skin" controls>
                                    <source src="${m3u8}" type="application/x-mpegURL">
                                </video>
                                <script>
                                var player = videojs('show-vid');
                                player.src({
                                    src: "${m3u8}",
                                    type: "application/x-mpegURL",
                                    withCredentials: true,
                                    html5: {
                                        vhs: {
                                            withCredentials: true
                                        }
                                    }
                                })
                                player.play();
                                </script>`
                            )
                        }
                    }
                }
            }
            apiXhr.open('GET', `https://api.iview.abc.net.au/v2/video/${seriesID}`)
            apiXhr.send()
        }
    }
    tokenXhr.open('GET', `https://iview.abc.net.au${path}&sig=${sig}`)
    tokenXhr.send()
} else {
    var seriesXhr = new XMLHttpRequest();
    seriesXhr.onreadystatechange = function() {
        if(seriesXhr.readyState == XMLHttpRequest.DONE) {
            var seriesNameID = JSON.parse(seriesXhr.response).slug
            var episodeXhr = new XMLHttpRequest();

            // We need to get the episode list, to do that we have to get the series's name ID (not the numeric ID)
            episodeXhr.onreadystatechange = function() { 
                if(episodeXhr.readyState == XMLHttpRequest.DONE) {
                    jsonEpList = JSON.parse(episodeXhr.response)[0]._embedded.videoEpisodes
                    for(var i = 0; i < jsonEpList.length; i++) {
                        $('.episode-list').append(`<p><a href="/show?id=${jsonEpList[i].id}">${jsonEpList[i].title}</a></p>`)
                    }
                }
            }

            episodeXhr.open("GET", `https://api.iview.abc.net.au/v2/series/${seriesNameID}`, true);
            episodeXhr.send();
        }
    }
    seriesXhr.open("GET", `https://api.iview.abc.net.au/v2/show/${seriesID}`, true);
    seriesXhr.send();
}