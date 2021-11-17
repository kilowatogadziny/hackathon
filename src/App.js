import './App.css';
import {getFirestore, collection, addDoc, getDocs} from "firebase/firestore";
import {useEffect, useState} from "react";
import firebase from "firebase/compat/app";

const firebaseConfig = {
    apiKey: "AIzaSyCRPSk2Y5p-Yl6FHrf_3CBc-G30wb3x698",
    authDomain: "hackathon-fd9ef.firebaseapp.com",
    projectId: "hackathon-fd9ef",
    storageBucket: "hackathon-fd9ef.appspot.com",
    messagingSenderId: "792012328661",
    appId: "1:792012328661:web:e0f5f17401bbf404ecdc5c"
};

firebase.initializeApp(firebaseConfig);

function App() {
    const [variables, setField] = useState([{field1: "", field2: ""}]);
    // const [field2, setField2] = useState([{field2: ""}]);

    useEffect(() => {
        async function fetchData() {
            const db = getFirestore();
            const col = await getDocs(collection(db, "test-collection"));
            const data = [];
            col.forEach((e) => {
                data.push(e.data())
            });
            console.log(data);
            setField(data[0]);
        }

        fetchData();
    }, []);

    return (
        <div>
            <p>
                {variables.field1}
            </p>
            <p>
                {variables.field2}
            </p>
        </div>
    );
}

export default App;
