import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgr8txGiKUZFVJA3DoaxwROuRll29fEeo",
  authDomain: "maikuu-c3715.firebaseapp.com",
  databaseURL: "https://maikuu-c3715.firebaseio.com",
  projectId: "maikuu-c3715",
  storageBucket: "maikuu-c3715.appspot.com",
  messagingSenderId: "391962098334",
  appId: "1:391962098334:web:435721a536776580f8d98f",
  measurementId: "G-4318VVRNP7",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
