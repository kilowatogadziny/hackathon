import "./styles.css";
import React from "react";
import {Alert} from "react-bootstrap";

export default function FailureMessage() {

    return (
        <Alert variant="danger">
            <Alert.Heading>
                Błąd w czasie zapisu :(
            </Alert.Heading>
        </Alert>
    );
}
