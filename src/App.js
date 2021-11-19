import "./App.css";
import Calendar from "./Calendar/Calendar";
import Form from "./Form/Form";
import React from "react";
import Modal from "./SongView/InfoModal";

function App() {

    return (
        <div>
            <Calendar/>
            <Form/>
            <Modal songId={"1"}/>
        </div>
    );
}

export default App;
