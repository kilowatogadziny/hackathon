import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import SongView from "./SongView";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./styles.css";

export default function InfoModal({ songDate, isVisible, closeModal }) {
  const [show, setShow] = useState(false);
  const handleClose = () => closeModal();
  const handleShow = () => setShow(true);

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

  useEffect(() => {
    async function fetchData() {
      let songOfDay = {};
      const snapshot = await getSnapshot();
      if (snapshot) {
        songOfDay = toSongOfDayObject(snapshot);
      } else {
        console.log("No such document!");
      }

      console.log(songOfDay);
      setSong(songOfDay);
    }

    fetchData();
  }, [songDate]);

  const getSnapshot = async () => {
    try {
      let data = [];
      const q = query(collection(db, "songs"), where("date", "==", songDate));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const toSongOfDayObject = (data) => {
    const song = {
      album_title: data.album_title,
      artist_name: data.artist_name,
      cover_url: data.cover_url,
      date: data.date,
      song_title: data.song_title,
      note: data.note,
    };
    return song;
  };

  return (
    <div className="modalSongView">
      <Button className="nextButton" onClick={handleShow}>
        Open Modal
      </Button>

      <Modal
        centered
        scrollable={true}
        show={isVisible}
        dialogClassName={"primaryModal"}
        onHide={handleClose}
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title className="modal-title">
            Piosenka z dnia: {song.date}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SongView song={song} />
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="dark" onClick={handleClose}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
