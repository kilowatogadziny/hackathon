import React from "react";
import "regenerator-runtime/runtime.js";
import {Badge} from "react-bootstrap";

function SongView({song}) {

    return (
        <div className="songview">
            <img src={song.cover_url} className="img-thumbnail"/>
            <h6>
                <Badge bg="secondary">Tytuł utworu:</Badge><p>{song.song_title}</p>
            </h6>
            <h6>
                <Badge bg="secondary">Tytuł albumu:</Badge><p>{song.album_title}</p>
            </h6>
            <h6>
                <Badge bg="secondary"> Artysta:</Badge><p>{song.artist_name}</p>
            </h6>

        </div>
    );
}

export default SongView;