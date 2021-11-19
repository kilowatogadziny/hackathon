//this function eables to save data in firestore
//todo set proper id if possible?
import {addDoc, collection} from "firebase/firestore";
import {db} from "../firebaseConfig";

const saveSong = async (song) => {
    const docRef = await addDoc(collection(db, "songs"), {
        artist: song.artist,
        album: song.album,
        song: song.title,
        date: new Date().getDate(),
    });
    console.log("Document written with ID: ", docRef.id);
}