import "./styles.css";
import React from "react";
import {Alert} from "react-bootstrap";

export default function SuccessMessage({stuffType}) {

    return (
        <Alert variant="success">
            <Alert.Heading>
                Zapisano {stuffType}!
            </Alert.Heading>
        </Alert>
    );
}
