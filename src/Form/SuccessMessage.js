import "./styles.css";
import React from "react";
import {Alert} from "react-bootstrap";

export default function SuccessMessage() {

    return (
        <Alert variant="success">
            <Alert.Heading>
                Zapisano utwór!
            </Alert.Heading>
        </Alert>
    );
}
