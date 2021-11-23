import "./styles.css";
import React from "react";
import {useState} from "react";
import DatePicker from "react-datepicker";
import {registerLocale} from "react-datepicker";
import pl from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";
import SongForm from "./SongForm";
import PodcastForm from "./PodcastForm";

registerLocale("pl", pl);

export default function Form({defaultDate}) {

    const [date, setDate] = useState(defaultDate ? defaultDate : new Date());


    const [stuffType, setStuffType] = useState('');

    const chooseTypeOfStuff = (selectedStuffType) => {
        setStuffType(selectedStuffType)
    };

    const conditionalForm = () => {
        if (stuffType === "podcast") {
            return (
                <PodcastForm/>
            );
        } else if (stuffType === "song") {
            return (
                <SongForm/>
            );
        } else {
            return (""
            );
        }
    };

    return (
        <div className="form">
            <h2 className="form__title">Co najlepszego dziś usłyszałeś/aś?</h2>
            <h5 className="form__subtitle">Opisz, co Ci dzisiaj chodzi po głowie!</h5>
            <fieldset className="form__field">
                <label>Wybierz dzień:</label>
                <DatePicker
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    locale="pl"
                    onChange={(date) => setDate(date)}
                    className="form-control form__field__input"
                />
            </fieldset>
            <fieldset className="form__field">
                <label>Co chcesz dodać?</label>
                <select
                    className="form-select form__field__input"
                    onChange={(e) => chooseTypeOfStuff(e.target.value)}
                    value={stuffType ? stuffType : ""}
                >
                    <option value=""></option>
                    <option value="song">Piosenkę</option>
                    <option value="podcast">Podcast</option>
                </select>
                {conditionalForm()}
            </fieldset>

        </div>
    );

}
