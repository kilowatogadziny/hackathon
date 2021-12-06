import React from "react";
import "regenerator-runtime/runtime.js";
import {Badge} from "react-bootstrap";
import {Form} from "react-bootstrap";

function PodcastView({episode}) {
    return (
        <div className="episodeview">
            <img src={episode.episode_photo} alt="podcast cover" className="img-thumbnail"/>
            <h6>
                <Badge bg="dark"> Podcast:</Badge>{" "}
                <Form.Label>{episode.episode_podcast}</Form.Label>
            </h6>
            <h6>
                <Badge bg="dark">Tytuł odcinka:</Badge>{" "}
                <Form.Label>{episode.episode_title}</Form.Label>
            </h6>
            <Form.Label>{episode.note}</Form.Label>
        </div>
    );
}

export default PodcastView;
