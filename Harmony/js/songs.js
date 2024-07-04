$(document).ready(function() {
    function fetchLikedSongs() {
        $.ajax({
            url: '../php/likedSongs.php',
            type: 'GET',
            data: { fetchdetails: true },
            success: function(response) {
                console.log('Liked songs response:', response);
                var results = JSON.parse(response);
                displayResults(results);
                getRecommendations(results);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching liked songs:', error);
            }
        });
    }

    function displayResults(songs) {
        var resultsDiv = $('#songGrid');
        resultsDiv.empty(); // Clear previous results if any

        for (var i = 0; i < songs.length; i++) {
            var item = songs[i];
            var card = $('<div class="song-card"></div>');
            card.append('<h5 class="card-title">' + item.name + '</h5>');
            card.append('<p class="card-artist">' + item.artists[0].name + '</p>');
            card.append('<img class="card-image" src="' + item.album.images[0].url + '" alt="' + item.name + '">');
            card.append('<audio controls class="audio-controls"><source src="' + item.preview_url + '" type="audio/mpeg">Your browser does not support the audio element.</audio>');

            var likeButton = $('<button class="like-button"><i class="fa-sharp fa-thin fa-star"></i></button>');
            if (item.liked) {
                likeButton.addClass('active');
            }

            card.append(likeButton);
            resultsDiv.append(card);
        }
    }

    function getRecommendations(likedSongs) {
        var trackIds = likedSongs.map(song => song.id).join(',');

        // Get the access token from search.php
        $.ajax({
            url: '../php/search.php',
            type: 'GET',
            data: {
                searchQuery: 'access_token', // Specific query to get the token
                isGenre: false,
                isCountry: false
            },
            success: function(response) {
                console.log('Access token response:', response);
                var parsedResponse = JSON.parse(response);
                var accessToken = parsedResponse.access_token;

                // Use the access token to fetch recommendations
                $.ajax({
                    url: 'https://api.spotify.com/v1/recommendations',
                    type: 'GET',
                    data: {
                        seed_tracks: trackIds,
                        limit: 10
                    },
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    },
                    success: function(recommendationsResponse) {
                        console.log('Recommendations response:', recommendationsResponse);
                        displayRecommendations(recommendationsResponse.tracks);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error fetching recommendations:', xhr.responseText);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching access token:', xhr.responseText);
            }
        });
    }

    function displayRecommendations(songs) {
        var resultsDiv = $('#recommendationGrid');
        resultsDiv.empty();

        songs.forEach(function(item) {
            var card = $('<div class="song-card"></div>');
            card.append('<h5 class="card-title">' + item.name + '</h5>');
            card.append('<p class="card-artist">' + item.artists[0].name + '</p>');
            card.append('<img class="card-image" src="' + item.album.images[0].url + '" alt="' + item.name + '">');
            card.append('<audio controls class="audio-controls"><source src="' + item.preview_url + '" type="audio/mpeg">Your browser does not support the audio element.</audio>');

            var likeButton = $('<button class="like-button"><i class="fa-sharp fa-thin fa-star"></i></button>');

            likeButton.click(function() {
                console.log('Recommended song ' + item.name + ' liked');
            });

            card.append(likeButton);
            resultsDiv.append(card);
        });
    }

    fetchLikedSongs();
});
