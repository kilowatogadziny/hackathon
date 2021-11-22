import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import SongView from "./SongView";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";
import "./styles.css";
import Form from "../Form/Form";
import LinksView from "./LinksView";

export default function InfoModal({songDate, isVisible, closeModal}) {

    const handleClose = () => closeModal();

    const [song, setSong] = useState([
        {
            album_title: "",
            artist_name: "",
            cover_url: "",
            date: "",
            song_title: "",
            note: "",
        },
    ]);

    var artistName;

    useEffect(() => {
        async function getSnapshot() {
            try {
                let data = [];
                const q = query(collection(db, "songs"), where("date", "==", songDate));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                });
                return data[0];
            } catch (e) {
                return null;
            }
        };

        async function fetchData() {
            let songOfDay = {};
            const snapshot = await getSnapshot();
            if (snapshot) {
                songOfDay = toSongOfDayObject(snapshot);
            } else {
                console.log("No such document!");
            }
            console.log(songOfDay)
            artistName=songOfDay.artist_name;
            setSong(songOfDay);
        }

        fetchData().catch(() => {
            console.log("Error fetching data")
        });
    }, [songDate]);

    const toSongOfDayObject = (data) => {
        return {
            album_title: data.album_title,
            artist_name: data.artist_name,
            cover_url: data.cover_url,
            date: data.date,
            song_title: data.song_title,
            note: data.note,
        };
    };

    const formatDate = (date) => {
        const dateToFormat = date.split("-");
        return dateToFormat[2] + "-" + dateToFormat[1] + "-" + dateToFormat[0];
    };

    const conditionalForm = () => {
        if (songDate) {
            const chosenDate = new Date(
                songDate.substring(0, 4),
                songDate.substring(5, 7) - 1,
                songDate.substring(8, 10)
            );
            if (!song.artist_name) {
                return (
                    <>
                        <Modal.Header closeButton className="modal-header"/>
                        <Form defaultDate={chosenDate}/>
                        <Modal.Footer className="modal-footer">
                            <Button variant="dark" onClick={handleClose}>
                                Zamknij
                            </Button>
                        </Modal.Footer>
                    </>
                );
            } else {
                return (
                    <>
                        <Modal.Header closeButton className="modal-header">
                            <Modal.Title className="modal-title">
                                Piosenka z dnia: {formatDate(song.date)}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <SongView song={song}/>
                            <LinksView artistName={song.artist_name}/>
                        </Modal.Body>
                        <Modal.Footer className="modal-footer">
                            <Button variant="dark" onClick={handleClose}>
                                Zamknij
                            </Button>
                        </Modal.Footer>
                    </>
                );
            }
        }
    };

    return (
        <div className="modalSongView">
            <Modal
                centered
                scrollable={true}
                show={isVisible}
                dialogClassName={"primaryModal"}
                onHide={handleClose}
            >
                {conditionalForm()}
            </Modal>
        </div>
    );
}
