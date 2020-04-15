/** 1. Search */
var UI = {};

UI.loadPlaylist = function () {
    var sideBar = document.querySelector('.js-playlist');
    sideBar.innerHTML = localStorage.getItem('key');
}

UI.getInput = function () {
    var searchBar = document.querySelector('.js-search');
    searchBar.addEventListener('keyup', function (e) {

        if (e.which === 13) {
            SoundCloudAPI.getTrack(searchBar.value);
        }
    });
}

UI.clickSearch = function () {
    var searchIcon = document.querySelector('.js-submit');
    searchIcon.addEventListener('click', function () {
        var searchBar = document.querySelector('.js-search');
        // if (searchBar.value != null) {
        SoundCloudAPI.getTrack(searchBar.value);
        // }
    });
}


UI.resetPlaylist = function () {
    var resetBtn = document.querySelector('.resetPlaylist');
    resetBtn.addEventListener('click', function () {
        var sideBar = document.querySelector('.js-playlist');
        sideBar.innerHTML = '';
        localStorage.clear();
    });
}


UI.loadPlaylist();
UI.getInput();
UI.clickSearch();
UI.resetPlaylist();


/** 2. Query SoundCloud API */
var SoundCloudAPI = {};
//Our main object

SoundCloudAPI.init = function () {

    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });

}

SoundCloudAPI.init();

SoundCloudAPI.getTrack = function (inputValue) {

    // find all sounds of buskers licensed under 'creative commons share alike'
    SC.get('/tracks', {
        q: inputValue
    }).then(function (tracks) {
        //console.log(tracks);
        SoundCloudAPI.renderTracks(tracks);
    });

}

/** 3. Display the cards */

SoundCloudAPI.renderTracks = function (tracks) {

    var container = document.querySelector('.js-search-results');
    container.innerHTML = "";

    tracks.forEach(function (track) {

        var card = document.createElement('div');
        card.classList.add('card');
        container.appendChild(card);

        imageDiv = document.createElement('div');
        imageDiv.classList.add('image');
        card.appendChild(imageDiv);

        var image = document.createElement('img');
        image.classList.add('image_img');
        image.src = track.artwork_url || './images/soundcloud.png';
        imageDiv.appendChild(image);

        content = document.createElement('div');
        content.classList.add('content');
        card.appendChild(content);

        var header = document.createElement('div');
        header.classList.add('header');
        content.appendChild(header);

        var link = document.createElement('a');
        link.href = track.permalink_url;
        link.target = '_black';
        link.innerHTML = track.title;
        header.appendChild(link);

        var bottom = document.createElement('div');
        bottom.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');
        card.appendChild(bottom);

        var icon = document.createElement('i');
        icon.classList.add('add', 'icon');
        bottom.appendChild(icon);

        var addPlaylist = document.createElement('span');
        addPlaylist.innerHTML = 'Add to playlist';
        bottom.appendChild(addPlaylist);
        addPlaylist.addEventListener('click', function () {
            SoundCloudAPI.getEmbed(track.permalink_url);
        })

    });
}

/** 4. Add th playlist and play */

SoundCloudAPI.getEmbed = function (trackUrl) {
    SC.oEmbed(trackUrl, {
        auto_play: true
    }).then(function (embed) {
        console.log('oEmbed response: ', embed);

        var sideBar = document.querySelector('.js-playlist');

        var box = document.createElement('div');
        box.innerHTML = embed.html

        sideBar.insertBefore(box, sideBar.firstChild);

        localStorage.setItem('key', sideBar.innerHTML);
    });

}

