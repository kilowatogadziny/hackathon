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

    const PODCASTS_URL = "https://api.newonce.me/api/v1/portals/net/podcasts/";
    const EPISODES_URL = "https://api.newonce.me/api/v1/portals/net/podcasts/xxx/episodes";

    const [podcastsList, setPodcastsList] = useState([]);

    useEffect(() => {
        fetch(PODCASTS_URL, {
            method: "GET",
            headers: {
                mode: 'no-cors'
            },
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((json) => {
                        console.log(json.items);
                        setPodcastsList(json.items);
                    });
                } else {
                    console.log("something went wrong");
                }
            })
            .catch((error) => console.log(error));
    }, []);


    const [podcast, setPodcast] = useState({id: 0, title: "", slug: ""});

    const choosePodcast = async (chosenPodcastId) => {
        console.log(chosenPodcastId);
        const chosenPodcast = podcastsList.filter(
            (podcast) => podcast.id.toString() === chosenPodcastId
        )[0];
        let apiUrl = EPISODES_URL.replace("xxx", chosenPodcast.slug.toString());
        console.log(apiUrl);
        await getPodcastEpisodes(apiUrl);
        console.log(episodesList)
        setPodcast(chosenPodcast);
    };

    const [episodesList, setEpisodesList] = useState([]);
    const [episode, setEpisode] = useState({
        episode_id: "",
        episode_title: "",
        episode_slug: "",
        episode_photo: "",
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
            const docRef = await addDoc(collection(db, "podcasts"), {
                episode_id: episode.episode_id,
                episode_title: episode.episode_title,
                episode_slug: episode.episode_slug,
                date: moment(dateToBeSaved).format("YYYY-MM-DD"),
                episode_photo: episode.episode_photo,
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
        });
    };

    return (
        <div className="form">
            <form onSubmit={handlePodcastSubmit}>
                <fieldset className="form__field">
                    <label>Podcast:</label>
                    <select
                        className="form-select form__field__input"
                        onChange={(e) => choosePodcast(e.target.value)}
                        value={podcast ? podcast.id : 0}
                    >
                        <option value="0"/>
                        {podcastsList.length > 0
                            ? podcastsList.map((podcast, key) => (
                                <option
                                    value={podcast.id}
                                    key={key}
                                >
                                    {podcast.title}
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