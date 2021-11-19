import "./App.css";
import Calendar from "./Calendar/Calendar";
import Form from "./Form/Form";
import SongView from "./SongView/SongView";

function App() {
  return (
    <div className="layout">
      <h1 className="layout__title">bardzo chwytliwa nazwa</h1>
      <section className="layout__view">
        <Calendar />
        <Form />
        <SongView />
      </section>

      <section className="layout__select">
        <button className="btn btn-outline-dark layout__select__button layout__select__active">
          add
        </button>
        <button className="btn btn-outline-dark layout__select__button">
          view
        </button>
      </section>
    </div>
  );
}

export default App;
