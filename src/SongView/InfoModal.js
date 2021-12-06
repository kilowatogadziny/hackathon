import React, {useEffect, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import SongView from "./SongView";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebaseConfig";
import "./styles.css";
import Form from "../Form/Form";
import LinksView from "./LinksView";
import PodcastView from "../PodcastView/PodcastView";

export default function InfoModal({date, isVisible, closeModal}) {

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

    const [podcast, setPodcast] = useState([
        {
            episode_photo: "",
            episode_podcast: "",
            episode_slug: "",
            episode_title: "",
            date: "",
            note: "",
        },
    ]);

    function resetSongAndPodcast() {
        setSong([
            {
                album_title: "",
                artist_name: "",
                cover_url: "",
                date: "",
                song_title: "",
                note: "",
            },
        ])
        setPodcast([
            {
                episode_photo: "",
                episode_podcast: "",
                episode_slug: "",
                episode_title: "",
                date: "",
                note: "",
            },
        ])
    }

    useEffect(() => {
        async function getSnapshot() {
            try {
                let memoryData = await getMemorySnapshot();
                if (memoryData.length > 0) {
                    return memoryData[0];
                } else {
                    return "";
                }
            } catch (e) {
                return null;
            }
        }

        async function getMemorySnapshot() {
            let memoryData = [];
            const queryForMemories = query(collection(db, "memories"), where("date", "==", date));
            const queryMemorySnapshot = await getDocs(queryForMemories);
            queryMemorySnapshot.forEach((doc) => {
                memoryData.push(doc.data());
            });
            return memoryData;
        }

        async function fetchData() {
            let elementToBeDisplayed = {};
            const snapshot = await getSnapshot();
            if (snapshot && snapshot.type === "song") {
                elementToBeDisplayed = toSongOfDayObject(snapshot);
                setSong(elementToBeDisplayed);
            } else if (snapshot && snapshot.type === "podcast") {
                elementToBeDisplayed = toPodcastObject(snapshot);
                setPodcast(elementToBeDisplayed);
            } else {
                console.log("No such document!");
                resetSongAndPodcast();
            }
        }

        fetchData().catch(() => {
            console.log("Error fetching data")
        });
    }, [date]);

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

    const toPodcastObject = (data) => {
        return {
            episode_podcast: data.episode_podcast,
            episode_slug: data.episode_slug,
            episode_title: data.episode_title,
            episode_photo: data.episode_photo,
            date: data.date,
            note: data.note,
        };
    };

    const formatDate = (date) => {
        const dateToFormat = date.split("-");
        return dateToFormat[2] + "-" + dateToFormat[1] + "-" + dateToFormat[0];
    };

    const conditionalForm = () => {
        if (date) {
            const chosenDate = new Date(
                date.substring(0, 4),
                date.substring(5, 7) - 1,
                date.substring(8, 10)
            );
            if (!song.artist_name && !podcast.episode_title) {
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
            } else if (song.artist_name != null) {
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
            } else if (podcast.episode_title != null) {
                return (
                    <>
                        <Modal.Header closeButton className="modal-header">
                            <Modal.Title className="modal-title">
                                Podcast z dnia: {formatDate(podcast.date)}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PodcastView episode={podcast}/>
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
