import React from "react";
import "./styles.css";
import { useInput } from "../hooks/inputHook";
import { useState } from "react";
import { useEffect } from "react";

export default function Form() {
  // const { value: artist, bind: bindArtist, reset: resetArtist } = useInput("");
  const [artist, setArtist] = useState({ id: 0, name: "", slug: "" });
  const { value: song, bind: bindSong, reset: resetSong } = useInput("");
  const { value: day, bind: bindDay, reset: resetDay } = useInput("");
  const [artistList, setArtistList] = useState([]);

  const ARTISTS_URL = "http://newonce-api.herokuapp.com/artists";

  useEffect(() => {
    fetch(ARTISTS_URL, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            setArtistList(json.items);
          });
        } else {
          console.log("something went wrong");
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // resetArtist();
    resetSong();
    resetDay();
  };

  const chooseArtist = (chosenArtistId) => {
    const chosenArtist = artistList.filter(
      (artist) => artist.id === chosenArtistId
    )[0];
    setArtist(chosenArtist);
    console.log(chosenArtistId);
    console.log(chosenArtist);
    // fetch artist songs
  };

  return (
    <div className="form">
      Dodaj
      <form onSubmit={handleSubmit}>
        <label>Artysta:</label>
        <div>
          {/* <input type="text" {...bindArtist} /> */}
          <select onChange={(e) => chooseArtist(e.target.value)}>
            <option value="0" />
            {artistList.length > 0
              ? artistList.map((artist, key) => (
                  <option value={artist.id} key={key}>
                    {artist.name}
                  </option>
                ))
              : null}
          </select>
        </div>
        <label>Utwór:</label>
        <div>
          <input type="text" {...bindSong} />
        </div>
        <label>Dzień:</label>
        <div>
          <input type="text" {...bindDay} />
        </div>
        <input type="submit" value="Dodaj" />
      </form>
      <div className="test">
        <p>chosen artist: {artist.name}</p>
      </div>
      <p>
        {song} {day}
      </p>
    </div>
  );
}
