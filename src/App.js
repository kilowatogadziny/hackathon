import {useState} from "react";
import "./App.css";
import Form from "./Form/Form";
import NewCalendar from "./Calendar/NewCalendar";
import dayjs from "dayjs";
import React from "react";

function App() {
    require("dayjs/locale/pl");
    dayjs.locale("pl");

    const [isFormActive, setIsFormActive] = useState(false);
    const [isCalActive, setIsCalActive] = useState(true);

    const selectForm = () => {
        setIsFormActive(true);
        setIsCalActive(false);
    };

    const selectCal = () => {
        setIsFormActive(false);
        setIsCalActive(true);
    };

    return (
        <div className="layout">
            <h1 className="text-primary layout__title">Muzyczne odkrycie dnia</h1>
            <section className="layout__view">
                {isFormActive ? <Form/> : null}
                {isCalActive ? <NewCalendar/> : null}
            </section>

            <section className="layout__select">
                <button
                    className={`btn btn-outline-dark layout__select__button ${
                        isFormActive ? "layout__select__active" : ""
                    }`}
                    onClick={selectForm}
                >
                    Dodaj utwór
                </button>
                <button
                    className={`btn btn-outline-dark layout__select__button ${
                        isCalActive ? "layout__select__active" : ""
                    }`}
                    onClick={selectCal}
                >
                    Kalendarz
                </button>
            </section>
        </div>
    );
}

export default App;
