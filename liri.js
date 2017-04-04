var Twitter = require("twitter"),
    spotify = require("spotify"),
    request = require("request"),
    keys = require(".././keys.js");

var twitterClient = new Twitter ({
  consumer_key: keys.TWITTER.CONSUMER_KEY,
  consumer_secret: keys.TWITTER.CONSUMER_SECRET,
  access_token_key: keys.TWITTER.ACCESS_TOKEN_KEY,
  access_token_secret: keys.TWITTER.ACCESS_TOKEN_SECRET
});

var command = process.argv[2];
var arg = process.argv[3];

if (command === "my-tweets") {
  var params = {
    count: 20
  }

  twitterClient.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (error) {
      throw error;
    }
    console.log("================================================");
    console.log("Last 20 tweets:");
    for (i = 0; i < tweets.length; i++) {
      console.log(tweets[i].text);
    }
    console.log("================================================");
  });
}

if (command === "spotify-this-song") {
  if (arg !== undefined) {
    spotify.search({type: "track", query: arg}, function(error, response) {
      if (error) {
        throw error;
      }
      var track = response.tracks.items[0];
      var title = track.name;
      var album = track.album.name;
    // Is there a better way to do this?==============================
      var artists = [];
      var getArtists = function() {
        for (i = 0; i < track.artists.length; i++) {
          artists.push(" " + track.artists[i].name);
        }
      };
      getArtists();
    //================================================================
      var previewURL = track.preview_url;
      console.log("================================================");
      console.log("Title: " + title);
      console.log("Album: " + album);
      console.log("Artist(s):" + artists);
      console.log("Preview: " + previewURL);
      console.log("================================================");
    });
  }
  else {
    console.log("================================================");
    console.log("You didn't input a song so we chose one for you.");
    console.log("================================================");
    console.log("Title: The Sign");
    console.log("Album: The Sign (1993)");
    console.log("Artist(s): Ace of Base");
    console.log("Preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=null");
    console.log("================================================");
  }

  
}

if (command === "movie-this") {

}

if (command === "do-what-it-says") {

}
