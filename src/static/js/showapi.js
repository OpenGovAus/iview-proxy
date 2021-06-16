var seriesID = $('meta[name=id]').attr('content')

function isInteger(value) {
    return /^\d+$/.test(value);
}

if($('meta[name=progtype]').attr('content') == 'show') {  // auth for the m3u8 is adapted from here: https://github.com/yt-dlp/yt-dlp/blob/master/yt_dlp/extractor/abc.py
    var sig = $('meta[name=sig]').attr('content')
    var path = $('meta[name=dir]').attr('content')
    
    if(isInteger(seriesID)) { // This is a placeholder API ID, and not the show's true iView ID (or something like that)
        getIDXhr = new XMLHttpRequest();
        getIDXhr.onreadystatechange = function() {
            if(getIDXhr.readyState == XMLHttpRequest.DONE) {
                apiJson = JSON.parse(getIDXhr.response)
                if(apiJson.unavailableMessage == 'This program is not currently available in iview. You might like similar programs to this, shown below. Learn more in iview Support.') {
                    $('.video-container').html('<h3 class="removed-msg">This show appears to have been removed from iView.</h3>')
                } else {
                    window.location = `/show?id=${apiJson._embedded.highlightVideo.id}`
                }
            }
        }
        getIDXhr.open('GET', `https://api.iview.abc.net.au/v2/show/${seriesID}`)
        getIDXhr.send()
    } else {
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
                                    if(formats[i].streams.hls['720'].slice(-1) == '8')
                                    {
                                        _queryChar = '?'
                                    }
                                    else {
                                        _queryChar = '&'
                                    }
                                    var m3u8 = formats[i].streams.hls['720'] + `${_queryChar}hdnea=${token}`
                                }
                                else {
                                    if(formats[i].streams.hls.sd.slice(-1) == '8')
                                    {
                                        _queryChar = '?'
                                    }
                                    else {
                                        _queryChar = '&'
                                    }
                                    var m3u8 = formats[i].streams.hls.sd + `${_queryChar}hdnea=${token}`
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
    }
} else {
    var seriesXhr = new XMLHttpRequest();
    seriesXhr.onreadystatechange = function() {
        if(seriesXhr.readyState == XMLHttpRequest.DONE) {
            var jsonResponse = JSON.parse(seriesXhr.response)
            if(jsonResponse.unavailableMessage == 'This program is not currently available in iview. You might like similar programs to this, shown below. Learn more in iview Support.') {
                $('.video-container').html('<h3 class="removed-msg">This show appears to have been removed from iView.</h3>')
            } else {
                var seriesNameID = jsonResponse.slug
                var episodeXhr = new XMLHttpRequest();
    
                // We need to get the episode list, to do that we have to get the series's name ID (not the numeric ID)
                episodeXhr.onreadystatechange = function() { 
                    if(episodeXhr.readyState == XMLHttpRequest.DONE) {
                        try {
                            JSON.parse(episodeXhr.response).forEach(x => x._embedded.videoEpisodes.reverse().forEach(episode => {
                                $('.episode-list').append(`<p><a href="/show?id=${episode.id}">${episode.title}</a></p>`)
                            }))
                        }
                        catch(err) {
                            JSON.parse(episodeXhr.response)._embedded.videoEpisodes.reverse().forEach(episode => {
                                $('.episode-list').append(`<p><a href="/show?id=${episode.id}">${episode.title}</a></p>`)
                            })
                        }
                    }
                }
    
                episodeXhr.open("GET", `https://api.iview.abc.net.au/v2/series/${seriesNameID}`, true);
                episodeXhr.send();
            }
            }
            
    }
    seriesXhr.open("GET", `https://api.iview.abc.net.au/v2/show/${seriesID}`, true);
    seriesXhr.send();
}