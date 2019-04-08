# CS 180 Starter Project

This starter project is intended to give you some very basic
familiarity with [NodeJS](https://nodejs.org/en/),
[React](https://reactjs.org/), and
[Firebase](https://firebase.google.com/).  We provide most of the code
for a simple movie search web app; you need to get it running and add
a bit of functionality, following the steps below.  Our hope is that
the starter project will be a helpful kickstart for your team
projects.

## Installations and data import

First, download the `React-StarterProject.zip` file from iLearn and unzip it.  This zip contains the stub web application code that you will complete.  This document is included in the zip as the README.md file.

#### Node.js

Install NodeJS on your System from https://nodejs.org.  Please install
the LTS version, 10.15.3.  Then, `cd` into the root directory of the
project (the directory created by unzipping `React-StarterProject.zip`) and run `npm install`.  This will download and install the necessary dependencies for the project in a `node_modules` folder.

#### Create Firebase Project
Login to your Google account (or create one if you don't have one).
Goto : https://console.firebase.google.com and create a Firebase
Project by clicking "Add project."  The default options should work
fine.

Once you have created the project, click the "Develop" menu on the
left and choose "Database."  Scroll down on the page until you see "Or
choose Realtime Database," and click the "Create database" button.  In
the "Security rules for Realtime Database" prompt, choose "Start in
test mode" and click "Enable".

#### Update firebase.js for your Firebase app

Go back to the Project Overview for your project.  You should see a
message "Get started by adding Firebase to your app" near the top.
Click the web app icon, shown below:

![Web app icon](web-app-icon.png?raw=true)

This should show some JavaScript code for adding Firebase to your web
app.  Copy the section of the script inside the second `<script>`
tag.  It should look like the following (with `"XXXXXX"` replaced with real values):

```javascript
  // Initialize Firebase
  var config = {
    apiKey: "XXXXXXX",
    authDomain: "XXXXX",
    databaseURL: "XXXXXX",
    projectId: "XXXXXXX",
    storageBucket: "XXXXXXX",
    messagingSenderId: "XXXXXXX"
  };
  firebase.initializeApp(config);
```

Paste this code into the `src/firebase.js` file at the point indicated.

#### Import the provided IMDB data provided as JSON to Firebase. 

Download the IMDB data from this link and unzip somewhere *outside your project directory*:

https://www.cs.ucr.edu/~ufaro001/courses/cs180/imdb/imdb_data.zip

To import the data into Firebase, use the following NPM package:

https://github.com/FirebaseExtended/firebase-import

The README at the link above describes how to install the tool, obtain a private key for your Firebase account, and then import JSON files using the `firebase-import` command.  The `--database_url` parameter value appears in the JavaScript code that you copy-pasted in the previous step.

The JSON files to be imported are `ratings.json` and `title_basics_2000_2020.json` from the zip file. **Note: You will need to import the JSON files separately.**  Also note that importing `ratings.json` will take several minutes.

Use following collection names while importing to Firebase (these are the values to pass as `--path` for `firebase-import`):
***title_basics_2000_2020.json -> /title_basics***

***ratings.json -> /title_ratings***

Structure of title_basics_2000_2020.json looks like
```JS
[	
	{
		endYear: "\\N",
		genres: "Action,Adventure,Romance",
		isAdult: 0,
		originalTitle: "Alita: Battle Angel",
		primaryTitle: "Alita: Battle Angel",
		runtimeMinutes:"122",
		startYear: "2019",
		tconst: "tt0437086",
		titleType: "movie"
	}	
]

```
And structure of ratings.json looks like
```JS
[
	{
		averageRating: "7.9",
		numVotes: "397",
		tconst: "tt0437086"
	}
]
```

Once you're done, you should be able to see all the data under the Database view on the Firebase web console for the project.

### Get API Key for The Movie DB
Create an account on https://www.themoviedb.org/ and create an API key by going to https://www.themoviedb.org/settings/api (the address and phone number information they ask for is not validated).
Once you get the API Key (you want the value for "API Key (v3 auth)"), Open `src/MovieDetails.js` and replace value of themoviedbAPIKey variable value ("YOUR_API_KEY") with the API key. 

#### React Developer Tools (Optional)
Install The ReactJS developer tools
[for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi/related?hl=en)
or
[for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/).
These tools can make understanding and debugging the web app UI easier.


## Run Project

If you have completed the previous steps successully, you should be able to locally run the app and use it from a browser.  Execute `npm start`.  It will start the localhost and open up a browser (this can take several seconds).
On Search field Enter "Alita", and Press Submit. 
It will fetch results from Firebase, display in a ListView and a success message will also appear. 
Click on the any search result and details page will open up.  All the "Todo" texts are your tasks to complete.

Note that the search is case sensitive (usually movie titles are capitalized) and only searches for a prefix match of the movie title (so searching for a word in the middle of a movie title won't succeed).

## Programming Tasks

Complete the following programming tasks.  For these tasks, partial solutions are commented out in the relevant source files.  You will need to uncomment these solutions and complete them.

1. Show a failure message when a search fails to find any movies or errors out.  This requires modifying `src/App.js` to provide an implementation of the `handleFailedClose` callback and manage the state of the `failedOpen` variable.  Search for three appearances of `Todo` in the source file, uncomment, and complete the code as directed.

2. Show Movie data on Movie Details page.  Once you click on a search results it shows **Todo** text placeholders. You need to need assign values to variables in Firebase callback, after the details are retrieved from the server.  Search for the two instances of `Todo2` in `src/MovieDetails.js` and complete the required code.  Note that movie ratings only display in the UI after a delay of several seconds, due to an unoptimized implementation and a large number of ratings.

3. Show Movie cast memebers on Movie Details page.  This requires completing the two `Todo3` items in `src/MovieDetails.js`.  You can see the API details here: https://developers.themoviedb.org/3/movies/get-movie-credits

### Turn In Your Project

When you are ready to turn in your project, do so with the following steps.

1. In the root directory of the project, either delete the `node_modules` directory or move it somewhere else on your file system.  If you delete `node_modules` you can restore it after turning in your project by running `npm install` again.

2. Create a `.zip` file of your completed project directory.  This `.zip` file should be less than 1MB.  Make sure the downloaded IMDB data is not included in the zip.

3. Upload the zip file to iLearn, and rename it to `yourStudentId.zip` (something like `86xxxxxx.zip`).
