import React from "react";
import "regenerator-runtime/runtime.js";
import {doc, getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db} from "./firebaseConfig"

export default function SongView({id}) {

    const [song, setSong] = useState([{
        album_title: "",
        artist_name: "",
        cover_url: "",
        date: "",
        song_title: ""
    }]);

    useEffect(() => {
        async function fetchData() {
            const documentId = id;
            let songOfDay = {};
            await getSnapshot(documentId).then((snapshot) => {
                if (snapshot.exists()) {
                    songOfDay = toSongOfDayObject(snapshot);
                } else {
                    console.log("No such document!" + documentId);
                }

            })
            console.log(songOfDay);
            setSong(songOfDay);
        }
        fetchData();
    }, []);

    const getSnapshot = async (id) => {
        const songsRef = doc(db, "songs", id);
        return await getDoc(songsRef);
    }

    const toSongOfDayObject = (snapshot) => {
        const data = snapshot.data();
        const song = {
            album_title: data.album_title,
            artist_name: data.artist_name,
            cover_url: data.cover_url,
            date: data.date,
            song_title: data.song_title
        }
        return song;
    }

    return (
        <div>
            <p>{song.date}</p>
            <p>{song.album_title}</p>
            <img src={song.cover_url}/>
            <p>{song.artist_name}</p>
            <p>{song.album_title}</p>
            <p>{song.song_title}</p>
        </div>
    );
}
