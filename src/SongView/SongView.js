import React from "react";
import "regenerator-runtime/runtime.js";
import { Badge } from "react-bootstrap";
import { Form } from "react-bootstrap";

function SongView({ song }) {
  return (
    <div className="songview">
      <img src={song.cover_url} alt="release cover" className="img-thumbnail" />
      <h6>
        <Badge bg="dark"> Artysta:</Badge>{" "}
        <Form.Label>{song.artist_name}</Form.Label>
      </h6>
      <h6>
        <Badge bg="dark">Tytuł albumu:</Badge>{" "}
        <Form.Label>{song.album_title}</Form.Label>
      </h6>
      <h6>
        <Badge bg="dark">Tytuł utworu:</Badge>{" "}
        <Form.Label>{song.song_title}</Form.Label>
      </h6>
      <Form.Label>{song.note}</Form.Label>
    </div>
  );
}

export default SongView;
