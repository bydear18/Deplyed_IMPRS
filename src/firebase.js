import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBTFoXlCEQgrvlFpwyzC4NmjPrKArmXN7c",
    authDomain: "imps-2199c.firebaseapp.com",
    projectId: "imps-2199c",
    storageBucket: "imps-2199c.appspot.com",
    messagingSenderId: "851764140471",
    appId: "1:851764140471:web:a774cf0ead8857eb9a3032"
};

firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
export default storage;