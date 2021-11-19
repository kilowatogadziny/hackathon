import "./App.css";
import firebase from "firebase/compat/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { NameForm } from "./NameForm";

const firebaseConfig = {
  apiKey: "AIzaSyCRPSk2Y5p-Yl6FHrf_3CBc-G30wb3x698",
  authDomain: "hackathon-fd9ef.firebaseapp.com",
  projectId: "hackathon-fd9ef",
  storageBucket: "hackathon-fd9ef.appspot.com",
  messagingSenderId: "792012328661",
  appId: "1:792012328661:web:e0f5f17401bbf404ecdc5c",
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [variable1, setVariable1] = useState({ field1: "" });
  const [variable2, setVariable2] = useState({ field2: "" });
  const [variables, setVariables] = useState([{ field1: "", field2: "" }]);

  useEffect(() => {
    async function fetchData() {
      const db = getFirestore();
      const col = await getDocs(collection(db, "test-collection"));
      const data = [];
      col.forEach((e) => {
        data.push(e.data());
      });
      console.log(data);
      setVariable1(data[0]);
      setVariable2(data[0]);
      setVariables(data[0]);
    }

    fetchData();
  }, []);

  return (
    <div>
      <p>{variable1.field1}</p>
      <p>{variable2.field2}</p>
      <p>{JSON.stringify(variables)}</p>

      <NameForm />
    </div>
  );
}

export default App;
