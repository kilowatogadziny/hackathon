import React, {useEffect, useState} from "react";
import "regenerator-runtime/runtime.js";
import {Badge} from "react-bootstrap";
import {Form} from "react-bootstrap";
import {indexOf} from "ramda";

export default function LinksView({artistName}) {

    const ARTICLES_LINK = "https://newonce-api.herokuapp.com/related/articles?search_query=";
    const ARTICLE_BASE_LINK = "https://newonce.net/artykul"

    const [articleLinks, setArticleLinks] = useState([]);

    useEffect(() => {
        fetch(ARTICLES_LINK + artistName + "&page=1&per_page=3", {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((json) => {
                        let items = json.items;
                        let link_data = [];
                        for (let i = 0; i < items.length; i++) {
                            link_data.push({
                                    link: ARTICLE_BASE_LINK + items[i].slug,
                                    title: items[i].title
                                }
                            )
                        }
                        setArticleLinks(link_data);
                    });
                } else {
                    console.log("something went wrong");
                }
            })
            .catch((error) => console.log(error));
    }, []);


    return (
        <div className="linksView">
            <Form.Label>Przeczytaj w newonce!</Form.Label>
            <p/>
            {articleLinks.length > 0
                ? articleLinks.map((song, key) => (
                    <a href={articleLinks[articleLinks.indexOf(song)].link}
                       target="_blank">{articleLinks[articleLinks.indexOf(song)].title}<p/>
                    </a>
                ))
                : null}
        </div>
    );
}
