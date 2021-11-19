import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import SongView from "./SongView";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebaseConfig";

export default function InfoModal({songId}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [song, setSong] = useState([{
        album_title: "",
        artist_name: "",
        cover_url: "",
        date: "",
        song_title: ""
    }]);

    useEffect(() => {
        async function fetchData() {
            const documentId = songId;
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
        <div className="modalSongView">
            <Button className="nextButton" onClick={handleShow}>
                Open Modal
            </Button>

            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Piosenka z dnia: {song.date}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SongView song={song}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}