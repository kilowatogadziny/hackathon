import React, { useState } from "react";
import "./styles.css";
import { useInput } from "../hooks/inputHook";

export default function Form() {
  const { value: artist, bind: bindArtist, reset: resetArtist } = useInput("");
  const { value: song, bind: bindSong, reset: resetSong } = useInput("");
  const { value: day, bind: bindDay, reset: resetDay } = useInput("");

  const handleSubmit = (event) => {
    event.preventDefault();
    resetArtist();
    resetSong();
    resetDay();
  };

  return (
    <div className="form">
      Dodaj
      <form onSubmit={handleSubmit}>
        <label>Artysta:</label>
        <div>
          <input type="text" {...bindArtist} />
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
    </div>
  );
}
