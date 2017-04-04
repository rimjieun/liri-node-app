var Twitter = require("twitter"),
    spotify = require("spotify"),
    request = require("request"),
    keys = require("./keys.js"),
    fs = require("fs");

var twitterClient = new Twitter ({
  consumer_key: keys.TWITTER.CONSUMER_KEY,
  consumer_secret: keys.TWITTER.CONSUMER_SECRET,
  access_token_key: keys.TWITTER.ACCESS_TOKEN_KEY,
  access_token_secret: keys.TWITTER.ACCESS_TOKEN_SECRET
});

var command = process.argv[2],
    arg = process.argv[3];

function runCommand() {
  if (command === "my-tweets") {
    // How does node know what user I am? Are the twitter keys linked to my account?
    // What if I want to get someone else's tweets?

    twitterClient.get("statuses/user_timeline", function(error, tweets, response) {
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

    if (arg === undefined) {
      console.log("================================================");
      console.log("You didn't input a song so we chose one for you.");
      console.log("================================================");
      console.log("Title: The Sign");
      console.log("Album: The Sign (1993)");
      console.log("Artist(s): Ace of Base");
      console.log("Preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=null");
      console.log("================================================");
    }

    spotify.search({type: "track", query: arg.trim()}, function(error, response) {
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

  if (command === "movie-this") {

    if (arg === undefined) {
      arg = "Mr. Nobody";
    }

    var omdbURL = "http://www.omdbapi.com/?t=" + arg.trim();
    
    request(omdbURL, function(error, response, body) {
      if (error) {
        throw error;
      }
      var movie = JSON.parse(body);
      var title = movie.Title;
      var year = movie.Year;
      var imdbRating = movie.imdbRating;
      var country = movie.Country;
      var language = movie.Language;
      var plot = movie.Plot;
      var actors = movie.Actors;
      var rottenTomatoes = movie.Ratings[1].Value;

      console.log("================================================");
      console.log("Title: " + title);
      console.log("Year: " + year);
      console.log("IMDB Rating: " + imdbRating);
      console.log("Rotten Tomatoes Rating: " + rottenTomatoes);
      console.log("Country: " + country);
      console.log("Language: " + language);
      console.log("Actors: " + actors);
      console.log("Synopsis: " + plot);
      console.log("================================================");
    });
  }
}

if (command === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var dataArr = data.split(",");
    command = dataArr[0];
    arg = dataArr[1];
    runCommand();
  });
}
else {
  runCommand();
}