import "./styles.css";
import React from "react";
import {useInput} from "../hooks/inputHook";
import {useState} from "react";
import {useEffect} from "react";

export default function Form() {
    // const { value: artist, bind: bindArtist, reset: resetArtist } = useInput("");
    const [artist, setArtist] = useState({id: 0, name: "", slug: ""});
    const [album, setAlbumSlug] = useState({id: 0, name: "", slug: ""});
    const [artistsReleases, setArtistsReleases] = useState([]);
    const {value: song, bind: bindSong, reset: resetSong} = useInput("");
    const {value: day, bind: bindDay, reset: resetDay} = useInput("");
    const [artistList, setArtistList] = useState([]);

    const ARTISTS_URL = "http://newonce-api.herokuapp.com/artists";
    const RELEASES_URL = "http://newonce-api.herokuapp.com/releases?search_query=";

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

    const chooseArtist = async (chosenArtistId) => {
        const chosenArtist = artistList.filter(
            (artist) => artist.id == chosenArtistId
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

    }

    const chooseAlbum = async (chosenAlbumId) => {
        const chosenAlbum = artistsReleases.filter(
            (release) => chosenAlbumId === release.album_id.toString()
        )[0];
        setAlbumSlug(chosenAlbum.album_slug);
        console.log("chosen album slug")
        console.log(chosenAlbum.album_slug)

    };

    const responseFromArtistsOk = (response) => {
        response.json().then((json) => {
            let releases = [];
            let releasesFromApi = json.items;
            for (const release of releasesFromApi) {
                let newRelease = {
                    album_id: release.id,
                    album_name: release.name,
                    album_slug: release.slug
                }
                releases.push(newRelease)
            }
            setArtistsReleases(releases);
        });
    };

    const responseFromArtistsNotOk = () => {

    }

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
                    <input type="text" {...bindSong} />
                </div>
                <label>Dzień:</label>
                <div>
                    <input type="text" {...bindDay} />
                </div>
                <input type="submit" value="Dodaj"/>
            </form>
            <div className="test">
                <p>chosen artist: {artist.name}</p>
            </div>
        </div>
    );
}
