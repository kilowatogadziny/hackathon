import "./styles.css";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import moment from "moment";
import { useInput } from "../hooks/inputHook";
import SuccessMessage from "./SuccessMessage";
import FailureMessage from "./FailureMessage";

export default function Form() {
  const [artist, setArtist] = useState({ id: 0, name: "", slug: "" });
  const [album, setAlbum] = useState({
    id: 0,
    name: "",
    slug: "",
    cover_url: "",
  });
  const [artistsReleases, setArtistsReleases] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [song, setSong] = useState("");
  const [songsList, setSongsList] = useState([]);
  const { value: note, bind: bindNote, reset: resetNote } = useInput("");
  const {
    value: date,
    bind: bindDate,
    reset: resetDate,
  } = useInput(moment(new Date()).format("YYYY-MM-DD"));
  const [isAlert, setIsAlert] = useState(0);

  const ARTISTS_URL = "http://newonce-api.herokuapp.com/artists";
  const RELEASES_URL =
    "http://newonce-api.herokuapp.com/releases?search_query=";
  const SONGS_URL = "http://newonce-api.herokuapp.com/releases/";

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

  const chooseArtist = async (chosenArtistId) => {
    const chosenArtist = artistList.filter(
      (artist) => artist.id.toString() === chosenArtistId
    )[0];
    setArtist(chosenArtist);
    console.log(chosenArtistId);
    console.log(chosenArtist);
    // fetch artist songs
    await getArtistAlbums(artist.name);
  };

  const getArtistAlbums = async (artistName) => {
    let apiUrl = RELEASES_URL + artistName;
    fetch(apiUrl, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          responseFromArtistsOk(response);
        } else {
          responseFromArtistsNotOk();
        }
      })
      .catch((error) => console.log(error));
  };

  const chooseAlbum = async (chosenAlbumId) => {
    const chosenAlbum = artistsReleases.filter(
      (release) => chosenAlbumId === release.album_id.toString()
    )[0];
    setAlbum({
      id: chosenAlbumId,
      name: chosenAlbum.album_name,
      slug: chosenAlbum.album_slug,
      cover_url: chosenAlbum.album_cover_url,
    });
    console.log("chosen album slug");
    console.log(chosenAlbum.album_name);

    await getAlbumSongs(chosenAlbum.album_slug);
  };

  const getAlbumSongs = async (albumSlug) => {
    let apiUrl = SONGS_URL + albumSlug;
    console.log(apiUrl);
    fetch(apiUrl, {
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((json) => {
            console.log(json);
            setSongsList(json.tracklist);
          });
        } else {
          console.log("not okay");
        }
      })
      .catch((error) => console.log(error));
  };

  const chooseSong = (chosenSong) => {
    setSong(chosenSong);
  };

  const responseFromArtistsOk = (response) => {
    response.json().then((json) => {
      let releases = [];
      let releasesFromApi = json.items;
      for (const release of releasesFromApi) {
        let newRelease = {
          album_id: release.id,
          album_name: release.name,
          album_slug: release.slug,
          album_cover_url: release.image.url,
        };
        releases.push(newRelease);
      }
      setArtistsReleases(releases);
    });
  };

  const responseFromArtistsNotOk = () => {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "songs"), {
        artist_name: artist.name,
        album_title: album.name,
        song_title: song,
        date: date,
        cover_url: album.cover_url,
        note: note,
      });
      console.log("Document written with ID: ", docRef.id);
      setIsAlert(1);
    } catch (error) {
      console.log("Error during saving to db");
      setIsAlert(-1);
    }
    resetFields();
  };

  const returnAlert = () => {
    if (isAlert === 1) {
      return <SuccessMessage />;
    } else if (isAlert === -1) {
      return <FailureMessage />;
    } else {
      return null;
    }
  };

  const resetFields = () => {
    resetNote();
    resetDate();
    setArtist();
    setArtist({ id: 0, name: "", slug: "" });
    setAlbum({
      id: 0,
      name: "",
      slug: "",
      cover_url: "",
    });
    setArtistsReleases([]);
    setSong("");
    setSongsList([]);
  };

  return (
    <div className="form">
      Dodaj
      <form onSubmit={handleSubmit}>
        <label>Artysta:</label>
        <div>
          {/* <input type="text" {...bindArtist} /> */}
          <select onChange={(e) => chooseArtist(e.target.value)}>
            <option value="0"></option>
            {artistList.length > 0
              ? artistList.map((artist, key) => (
                  <option value={artist.id} key={key}>
                    {artist.name}
                  </option>
                ))
              : null}
          </select>
        </div>
        <label>Album:</label>
        <div>
          <select onChange={(e) => chooseAlbum(e.target.value)}>
            <option value="0"></option>
            {artistsReleases.length > 0
              ? artistsReleases.map((release, key) => (
                  <option value={release.album_id} key={key}>
                    {release.album_name}
                  </option>
                ))
              : null}
          </select>
        </div>

        <label>Utwór:</label>
        <div>
          <select onChange={(e) => chooseSong(e.target.value)}>
            <option value="0"></option>
            {songsList.length > 0
              ? songsList.map((song, key) => (
                  <option value={song.title} key={key}>
                    {song.title}
                  </option>
                ))
              : null}
          </select>
        </div>
        <label>Notatka:</label>
        <div>
          <input type="text" {...bindNote} />
        </div>
        <label>Dzień (yyyy-mm-dd):</label>
        <div>
          <input type="text" {...bindDate} />
        </div>
        <input type="submit" value="Dodaj" />
        <div>{returnAlert()}</div>
      </form>
    </div>
  );
}
