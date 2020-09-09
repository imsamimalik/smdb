import React, { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Spinner from "./layout/Spinner";
import PosterPng from "../assets/poster.png";
import personReducer from "../store/person/personReducer";
import { useFetchPerson } from "../store/person/personActions";
import { IMAGE_BASE_URL, API_URL, TINY_POSTER_SIZE } from "../config";
import {
    Wrapper,
    Heading,
    Row,
    Placeholder,
    Img,
    Span,
    Bio,
    Info,
} from "./PersonStyles";

const Person: React.FC = () => {
    const [pic, setPic] = useState<string>("");
    const [bio, setBio] = useState<string>("");

    const [state, dispatch] = useReducer(personReducer, {
        name: "",
        profile_path: "",
        titles: [],
        error: false,
    });

    const { personId } = useParams<{ personId: string }>();
    useFetchPerson(personId, dispatch);

    const { name, titles, error } = state;
    useEffect(() => {
        const fetchImg = async () => {
            fetch(
                `${API_URL}person/${personId}?api_key=4a61e96a6e6cf693c5c03e6595ece16d`
            )
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setPic(data.profile_path);
                    setBio(data.biography);
                });
        };
        fetchImg();
    }, [personId]);
    return (
        <>
            {name && (
                <Wrapper>
                    <Heading>{name}</Heading>
                    <Bio>
                        <img
                            style={{
                                width: "150px",
                                objectFit: "contain",
                                marginRight: "20px",
                            }}
                            alt="Person"
                            src={`${IMAGE_BASE_URL}${TINY_POSTER_SIZE}/${pic}`}
                        />
                        <Info>{bio}</Info>
                    </Bio>
                    {titles.map((title) => (
                        <Link
                            to={`/${title.media_type}/${title.id}`}
                            key={title.id}
                        >
                            <Row>
                                <Placeholder>
                                    <Img
                                        alt="Person"
                                        src={
                                            title.poster_path
                                                ? `${IMAGE_BASE_URL}${TINY_POSTER_SIZE}${title.poster_path}`
                                                : PosterPng
                                        }
                                    />
                                </Placeholder>
                                <Span>{title.name || title.title}</Span>
                            </Row>
                        </Link>
                    ))}
                </Wrapper>
            )}
            {!error && !name && <Spinner />}
            {error && "NOT FOUND 404"}
        </>
    );
};

export default Person;
