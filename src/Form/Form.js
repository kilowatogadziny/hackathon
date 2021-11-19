import React, {useEffect, useState} from "react";
import "./styles.css";
import {useInput} from "../hooks/inputHook";

export default function Form() {
    const {value: artist, bind: bindArtist, reset: resetArtist} = useInput("");
    const [artistsReleases, setArtistsReleases] = useState([]);
    const {value: song, bind: bindSong, reset: resetSong} = useInput("");
    const {value: day, bind: bindDay, reset: resetDay} = useInput("");

    const handleSubmit = (event) => {
        event.preventDefault();
        resetArtist();
        resetSong();
        resetDay();
    };

    useEffect(() => {
        async function fetchData() {
            const response = await getArtistAlbums("Pezet");
        }

        fetchData();
    }, []);

    const getArtistAlbums = async (artistName) => {


        let apiUrl = "http://newonce-api.herokuapp.com/releases?search_query=" + artistName;
        let responseFromApi = {};
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

    const responseFromArtistsOk = (response) => {
        console.log("responseFromArtistsOk")
        response.json().then((json) => {
            let releases = [];
            let releasesFromApi = json.items;
            console.log("items")
            console.log(releasesFromApi)
            for (const release of releasesFromApi) {
                let newRelease = {
                    album_name: release.name
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
                <input type="submit" value="Dodaj"/>
            </form>
        </div>
    );
}
