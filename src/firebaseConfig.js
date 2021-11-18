import {initializeApp} from 'firebase/app';
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB7bBYMcFoFQRDLmdc5MnDS_RrnsN6xGPo",
    authDomain: "fun-food-friends-7d9d3.firebaseapp.com",
    projectId: "fun-food-friends-7d9d3",
    storageBucket: "fun-food-friends-7d9d3.appspot.com",
    messagingSenderId: "29947101203",
    appId: "1:29947101203:web:a67e03beb807395f253fe6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
