//Access node modules and import external js
var Twitter = require("twitter"),
    spotify = require("spotify"),
    request = require("request"),
    keys = require("./keys.js"),
    fs = require("fs");

//Store twitter keys
var twitterClient = new Twitter ({
  consumer_key: keys.TWITTER.CONSUMER_KEY,
  consumer_secret: keys.TWITTER.CONSUMER_SECRET,
  access_token_key: keys.TWITTER.ACCESS_TOKEN_KEY,
  access_token_secret: keys.TWITTER.ACCESS_TOKEN_SECRET
});

//Store user request and declare variables
var command = process.argv[2],
    arg = process.argv[3],
    requestMsg = "",
    responseMsg = "";

//Console log and append file user request and data respones
function logAndAppend(input, output) {
  console.log(output);
  fs.appendFile("log.txt", input + "\n" + output, function(error) {
    if (error) {
      throw error;
    }
  })
}

//Create function to execute user request
function runCommand() {
  //If user requests "my-tweets"...
  if (command === "my-tweets") {
    twitterClient.get("statuses/user_timeline", function(error, tweets, response) {
      if (error) {
        throw error;
      }
      var tweetsArr = [];
      for (i = 0; i < tweets.length; i++) {
        tweetsArr.push(tweets[i].text);
      }
      requestMsg = "COMMAND: " + command;
      responseMsg = "================================================\n" +
                    "Last 20 tweets:\n" + tweetsArr.join("\n") + "\n\n";
      logAndAppend(requestMsg, responseMsg);
    });
  }
  //If user requests "spotify-this song"...
  if (command === "spotify-this-song") {
    if (arg === undefined) {
      requestMsg = "COMMAND: " + command;
      responseMsg = "================================================\n" +
                    "Title: The Sign\n" + "Album: The Sign (1993)\n" +
                    "Artist(s): Ace of Base\n" +
                    "Preview: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=null\n\n";
      logAndAppend(requestMsg, responseMsg);
      return;
    }
    spotify.search({type: "track", query: arg.trim()}, function(error, response) {
      if (error) {
        throw error;
      }
      var track = response.tracks.items[0];
      var title = track.name;
      var album = track.album.name;
      //Is there a better way to do this?==============================
      var artists = [];
      var getArtists = function() {
        for (i = 0; i < track.artists.length; i++) {
          artists.push(" " + track.artists[i].name);
        }
      };
      getArtists();
      //================================================================
      var previewURL = track.preview_url;
      requestMsg = "COMMAND: " + command + "," + arg;
      responseMsg = "================================================\n" +
                    "Title: " + title + "\n" + "Album: " + album + "\n" +
                    "Artist(s):" + artists + "\n" + "Preview: " + previewURL + "\n\n";
      logAndAppend(requestMsg, responseMsg);
    });
  }
  //If user requests "movie-this"...
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
      requestMsg = "COMMAND: " + command;
      responseMsg = "================================================\n" +
                    "Title: " + title + "\n" + "Year: " + year + "\n" +
                    "IMDB Rating: " + imdbRating + "\n" +
                    "Rotten Tomatoes Rating: " + rottenTomatoes + "\n" +
                    "Country: " + country + "\n" + "Language: " + language + "\n" +
                    "Actors: " + actors + "\n" + "Synopsis: " + plot + "\n\n";
      logAndAppend(requestMsg, responseMsg);
    });
  }
}

//If user requests "do-what-it-says"...
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