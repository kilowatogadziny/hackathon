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
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("pl", pl);

export default function Form({ defaultDate }) {
  const [artist, setArtist] = useState({ id: 0, name: "", slug: "" });
  const [album, setAlbum] = useState({
    id: 0,
    name: "",
    slug: "",
    cover_url: "",
  });
  const [song, setSong] = useState("");
  const { value: note, bind: bindNote, reset: resetNote } = useInput("");
  const [date, setDate] = useState(defaultDate ? defaultDate : new Date());
  const [isAlert, setIsAlert] = useState(0);
  const [artistsReleases, setArtistsReleases] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [songsList, setSongsList] = useState([]);

  const ARTISTS_URL = "https://newonce-api.herokuapp.com/artists";
  const RELEASES_URL = "https://newonce-api.herokuapp.com/releases?search_query=";
  const SONGS_URL = "https://newonce-api.herokuapp.com/releases/";

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
    let apiUrl = RELEASES_URL.concat(
      chosenArtist.name.toString(),
      "&page=1&per_page=5"
    );
    console.log(apiUrl);
    await getArtistAlbums(apiUrl);
  };

  const getArtistAlbums = async (apiUrl) => {
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

    await getAlbumSongs(chosenAlbum.album_slug);
  };

  const getAlbumSongs = async (albumSlug) => {
    let apiUrl = SONGS_URL + albumSlug;
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
        date: moment(date).format("YYYY-MM-DD"),
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
    setDate(new Date());
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
      <h2 className="form__title">Co najlepszego dziś usłyszałeś/aś?</h2>
      <h5 className="form__subtitle">Opisz, co Ci dzisiaj chodzi po głowie!</h5>
      <fieldset className="form__field">
        <label>Wybierz dzień:</label>
        {/* <input type="text" {...bindDate} /> */}
        <DatePicker
          selected={date}
          dateFormat="dd/MM/yyyy"
          locale="pl"
          onChange={(date) => setDate(date)}
          className="form-control form__field__input"
        />
      </fieldset>
      <form onSubmit={handleSubmit}>
        <fieldset className="form__field">
          <label>Artysta:</label>
          <select
            className="form-select form__field__input"
            onChange={(e) => chooseArtist(e.target.value)}
            value={artist ? artist.id : 0}
          >
            <option value="0" />
            {artistList.length > 0
              ? artistList.map((artist, key) => (
                  <option
                    value={artist.id}
                    key={key}
                  >
                    {artist.name}
                  </option>
                ))
              : null}
          </select>
        </fieldset>

        <fieldset className="form__field">
          <label>Album:</label>
          <select
            className="form-select form__field__input"
            onChange={(e) => chooseAlbum(e.target.value)}
          >
            <option value="0" />
            {artistsReleases.length > 0
              ? artistsReleases.map((release, key) => (
                  <option value={release.album_id} key={key}>
                    {release.album_name}
                  </option>
                ))
              : null}
          </select>
        </fieldset>

        <fieldset className="form__field">
          <label>Utwór:</label>
          <select
            className="form-select form__field__input"
            onChange={(e) => chooseSong(e.target.value)}
          >
            <option value="0" />
            {songsList.length > 0
              ? songsList.map((song, key) => (
                  <option value={song.title} key={key}>
                    {song.title}
                  </option>
                ))
              : null}
          </select>
        </fieldset>

        <fieldset className="form__field">
          <label>Notatka:</label>
          <textarea
            className="form-control form__field__note"
            type="text"
            {...bindNote}
          />
        </fieldset>

        <input
          className="btn btn-primary form__submit-button"
          type="submit"
          value="Dodaj wpis"
        />
        <div>{returnAlert()}</div>
      </form>
    </div>
  );
}
