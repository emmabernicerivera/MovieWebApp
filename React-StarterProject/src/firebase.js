// src/firebase.js
import firebase from 'firebase';

// PASTE FIREBASE CODE HERE (before "export default firebase;")
// It should look similar to the following:
// // Initialize Firebase
var config = {
	apiKey: 'AIzaSyAhVhyBQ7-3rZe_gRHzNKBapG6VwzplGuI',
	authDomain: 'cs180-starter-project-55b8c.firebaseapp.com',
	databaseURL: 'https://cs180-starter-project-55b8c.firebaseio.com',
	projectId: 'cs180-starter-project-55b8c',
	storageBucket: '',
	messagingSenderId: '740047736192',
};
firebase.initializeApp(config);

export default firebase;
