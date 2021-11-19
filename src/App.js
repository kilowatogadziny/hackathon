import { useState } from "react";
import "./App.css";
import Calendar from "./Calendar/Calendar";
import Form from "./Form/Form";
import SongView from "./SongView/SongView";

function App() {
  const [isFormActive, setIsFormActive] = useState(true);
  const [isCalActive, setIsCalActive] = useState(false);

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
      <h1 className="layout__title">bardzo chwytliwa nazwa</h1>
      <section className="layout__view">
        {isFormActive ? <Form /> : null}
        {isCalActive ? <Calendar /> : null}
        {/* <SongView /> */}
      </section>

      <section className="layout__select">
        <button
          className={`btn btn-outline-dark layout__select__button ${
            isFormActive ? "layout__select__active" : ""
          }`}
          onClick={selectForm}
        >
          add
        </button>
        <button
          className={`btn btn-outline-dark layout__select__button ${
            isCalActive ? "layout__select__active" : ""
          }`}
          onClick={selectCal}
        >
          view
        </button>
      </section>
    </div>
  );
}

export default App;
