import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../firebaseConfig";
import moment from "moment";
import {useInput} from "../hooks/inputHook";
import SuccessMessage from "./SuccessMessage";
import FailureMessage from "./FailureMessage";

export default function PodcastForm({dateToBeSaved}) {

    const ARTISTS_URL = "https://newonce-api.herokuapp.com/artists?page=1&per_page=50";
    const PODCASTS_URL = "https://newonce-api.herokuapp.com/related/podcast_episodes?search_query=xxx&page=1&per_page=5";

    const [artistList, setArtistList] = useState([]);

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

    const [artist, setArtist] = useState({id: 0, name: "", slug: ""});

    const chooseArtist = async (chosenArtistId) => {
        const chosenArtist = artistList.filter(
            (artist) => artist.id.toString() === chosenArtistId
        )[0];
        let apiUrl = PODCASTS_URL.replace("xxx", encodeURIComponent(chosenArtist.name.toString()));
        await getArtistPodcasts(apiUrl);
        setArtist(chosenArtist);
    };

    const [podcastsList, setPodcastsList] = useState([]);

    const getArtistPodcasts = async (apiUrl) => {
        fetch(apiUrl, {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((json) => {
                        setPodcastsList(json.items);
                    });
                } else {
                    console.log("something went wrong");
                }
            })
            .catch((error) => console.log(error));
    };

    const [podcast, setPodcast] = useState({id: 0, title: "", slug: ""});

    const choosePodcast = async (chosenPodcastId) => {
        const chosenPodcast = podcastsList.filter(
            (podcast) => podcast.id.toString() === chosenPodcastId
        )[0];
        let apiUrl = PODCASTS_URL.replace("xxx", chosenPodcast.slug.toString());
        await getPodcastEpisodes(apiUrl);
        setPodcast(chosenPodcast);
    };

    const [episodesList, setEpisodesList] = useState([]);
    const [episode, setEpisode] = useState({
        episode_id: "",
        episode_title: "",
        episode_slug: "",
        episode_photo: "",
        episode_podcast: "",
    });

    const getPodcastEpisodes = async (apiUrl) => {
        fetch(apiUrl, {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    responseFromEpisodesOk(response);
                } else {
                    responseFromEpisodesNotOk();
                }
            })
            .catch((error) => console.log(error));
    };

    const responseFromEpisodesOk = (response) => {
        response.json().then((json) => {
            let episodes = [];
            let episodesFromApi = json.items;
            for (const episode of episodesFromApi) {
                let newRelease = {
                    episode_id: episode.id,
                    episode_podcast: episode.podcast.title,
                    episode_title: episode.title,
                    episode_slug: episode.slug,
                    episode_photo: episode.picture,
                };
                episodes.push(newRelease);
            }
            setEpisodesList(episodes);
        });
    };

    const responseFromEpisodesNotOk = () => {
    };

    const chooseEpisode = async (episodeId) => {
        const chosenEpisode = episodesList.filter(
            (episode) => episodeId === episode.episode_id.toString()
        )[0];
        setEpisode({
            episode_id: chosenEpisode.episode_id,
            episode_podcast: chosenEpisode.episode_podcast,
            episode_title: chosenEpisode.episode_title,
            episode_slug: chosenEpisode.episode_slug,
            episode_photo: chosenEpisode.episode_photo,
        });
    };

    const {value: note, bind: bindNote, reset: resetNote} = useInput("");

    const [isAlert, setIsAlert] = useState(0);

    const returnAlert = () => {
        if (isAlert === 1) {
            return <SuccessMessage stuffType="podcast"/>;
        } else if (isAlert === -1) {
            return <FailureMessage/>;
        } else {
            return null;
        }
    };

    const handlePodcastSubmit = async (event) => {
        event.preventDefault();
        try {
            const docRef = await addDoc(collection(db, "memories"), {
                episode_id: episode.episode_id,
                episode_podcast: episode.episode_podcast,
                episode_title: episode.episode_title,
                episode_slug: episode.episode_slug,
                date: moment(dateToBeSaved).format("YYYY-MM-DD"),
                episode_photo: episode.episode_photo,
                type: "podcast",
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

    const resetFields = () => {
        resetNote();
        setPodcast({id: 0, title: "", slug: ""});
        setEpisodesList([])
        setEpisode({
            episode_id: "",
            episode_title: "",
            episode_slug: "",
            episode_photo: "",
            episode_podcast: "",
        });
    };

    return (
        <div className="form">
            <form onSubmit={handlePodcastSubmit}>
                <fieldset className="form__field">
                    <label>Artysta:</label>
                    <select
                        className="form-select form__field__input"
                        onChange={(e) => chooseArtist(e.target.value)}
                        value={artist ? artist.id : 0}
                    >
                        <option value="0"/>
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
                    <label>Podcast:</label>
                    <select
                        className="form-select form__field__input"
                        onChange={(e) => choosePodcast(e.target.value)}
                        value={podcast ? podcast.id : 0}
                    >
                        <option value="0"/>
                        {podcastsList.length > 0
                            ? podcastsList.map((podcastEl, key) => (
                                <option
                                    value={podcastEl.id}
                                    key={key}
                                >
                                    {podcastEl.podcast.title}
                                </option>
                            ))
                            : null}
                    </select>
                </fieldset>

                <fieldset className="form__field">
                    <label>Odcinek:</label>
                    <select
                        className="form-select form__field__input"
                        onChange={(e) => chooseEpisode(e.target.value)}
                    >
                        <option value="0"/>
                        {episodesList.length > 0
                            ? episodesList.map((episode, key) => (
                                <option value={episode.episode_id} key={key}>
                                    {episode.episode_title}
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
                    value="Dodaj podcast do kalendarza!"
                />
                <div>{returnAlert()}</div>
            </form>
        </div>
    );
}