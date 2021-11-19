import React from "react";
import "regenerator-runtime/runtime.js";
import {doc, getDoc} from "firebase/firestore";
import {useEffect, useState} from "react";
import {db} from "../firebaseConfig"
import Modal from "./Modal";

function SongView({id}) {

    const [song, setSong] = useState([{
        album_title: "",
        artist_name: "",
        cover_url: "",
        date: "",
        song_title: ""
    }]);

    const state = {
        show: false
    };

    showModal = e => {
        this.setState({
            show: true
        });
    };

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
        <div className="songview">
            <p>{song.date}</p>
            <p>{song.album_title}</p>
            <img src={song.cover_url}/>
            <p>{song.artist_name}</p>
            <p>{song.album_title}</p>
            <p>{song.song_title}</p>
            <button
                className="toggle-button"
                id="centered-toggle-button"
                onClick={e => {
                    this.showModal(e);
                }}
            >
                {" "}
                show Modal{" "}
            </button>

            <Modal onClose={this.showModal} show={this.state.show}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis
                deserunt corrupti, ut fugit magni qui quasi nisi amet repellendus non
                fuga omnis a sed impedit explicabo accusantium nihil doloremque
                consequuntur.
            </Modal>
        </div>
    );
}

export default SongView;