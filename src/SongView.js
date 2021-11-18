import React from "react";
import "regenerator-runtime/runtime.js";
import {collection, addDoc, doc, getDoc} from "firebase/firestore";
import {db} from "./firebaseConfig"

export default function SongView({songOfDay}) {

    const saveSong = async (song) => {
        const docRef = await addDoc(collection(db, "songs"), {
            artist: song.artist,
            album: song.album,
            song: song.title,
            date: new Date().getDate(),
        });
        console.log("Document written with ID: ", docRef.id);
    }

    return (
        <div>
            <p>{songOfDay.date}</p>
            <p>{songOfDay.album_title}</p>
            <img src={songOfDay.cover_url}/>
            <p>{songOfDay.artist_name}</p>
            <p>{songOfDay.album_title}</p>
            <p>{songOfDay.song_title}</p>
        </div>
    );
}
