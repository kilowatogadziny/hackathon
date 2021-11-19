import {initializeApp} from 'firebase/app';
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCRPSk2Y5p-Yl6FHrf_3CBc-G30wb3x698",
    authDomain: "hackathon-fd9ef.firebaseapp.com",
    projectId: "hackathon-fd9ef",
    storageBucket: "hackathon-fd9ef.appspot.com",
    messagingSenderId: "792012328661",
    appId: "1:792012328661:web:e0f5f17401bbf404ecdc5c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};
