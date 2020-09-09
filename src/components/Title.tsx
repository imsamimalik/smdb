import React, { useState, useReducer, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import useWindowDimensions from "../hooks/useWindowDimensions";
import titleReducer from "../store/title/titleReducer";
import { useFetchTitle } from "../store/title/titleActions";
import { sliceOverview } from "../helpers";
import ImdbImg from "../assets/imdb.png";
import StarImg from "../assets/star.png";
import Spinner from "./layout/Spinner";
import TitleBackdrop from "./title/TitleBackdrop";
import TitlePoster from "./title/TitlePoster";
import TitleCast from "./title/TitleCast";
import TitleButtons from "./title/TitleButtons";
import {
    Container,
    OuterDiv,
    InnerDiv,
    Heading,
    Overview,
    Info,
    Rating,
    Imdb,
    Star,
    Rank,
    Row,
    OuterSimRow,
    SimRow,
    ReleaseDate,
    NotFound,
} from "./TitleStyles";
import { Link } from "./list/ListPosterStyles";
import { IMAGE_BASE_URL } from "../config";

interface Props {
    userId: string | null;
}

const Title: React.FC<Props> = ({ userId }) => {
    const [similar, setSimilar] = useState<any[]>([]);
    const [showSimilar, setShowSimilar] = useState<number>(0);
    const [data, dataDispatch] = useReducer(titleReducer, {
        title: {
            title: "",
            name: "",
            backdrop_path: null,
            poster_path: null,
            overview: "",
            vote_average: 0,
        },
        cast: [],
        videos: [],
        error: false,
        release_date: "",
    });

    const { url } = useRouteMatch<{ url: string }>();
    const [, mediaType, titleId] = url.split("/");
    useFetchTitle(mediaType, titleId, dataDispatch);

    const {
        title: {
            title,
            name,
            backdrop_path,
            poster_path,
            overview,
            vote_average,
        },
        cast,
        videos,
        release_date,
        error,
    } = data;

    const { width } = useWindowDimensions();
    const heading: string = title || name;
    useEffect(() => {
        const fetchSimilar = async () => {
            await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${titleId}/similar?api_key=4a61e96a6e6cf693c5c03e6595ece16d`
            )
                .then((res) => res.json())
                .then((data) => {
                    setSimilar(data.results?.slice(0, 6));
                    setShowSimilar(data.total_results);
                    return console.log(data.results?.slice(0, 6));
                });
        };
        fetchSimilar();
    }, [mediaType, titleId]);
    return (
        <React.Fragment>
            {heading && (
                <Container>
                    <TitleBackdrop
                        title={heading}
                        backdropPath={backdrop_path}
                    />
                    <OuterDiv>
                        <InnerDiv>
                            {width >= 991.98 && (
                                <TitlePoster
                                    title={heading}
                                    posterPath={poster_path}
                                />
                            )}

                            <Info>
                                <Heading>{heading}</Heading>
                                <Overview>
                                    {width >= 991.98
                                        ? sliceOverview(overview)
                                        : overview}
                                </Overview>
                                <Overview>
                                    <h3>
                                        Release Date:{" "}
                                        <ReleaseDate>
                                            {release_date}
                                        </ReleaseDate>
                                    </h3>
                                </Overview>
                                <Rating>
                                    <Imdb src={ImdbImg} alt="imdb" />
                                    <Rank>{vote_average}/10</Rank>
                                    <Star src={StarImg} alt="star" />
                                </Rating>

                                <Row>
                                    {cast.length > 0 &&
                                        cast
                                            .filter(
                                                (person, index) => index < 4
                                            )
                                            .map((person) => (
                                                <TitleCast
                                                    profilePath={
                                                        person.profile_path
                                                    }
                                                    name={person.name}
                                                    id={person.id}
                                                    key={person.credit_id}
                                                />
                                            ))}
                                </Row>
                                <TitleButtons
                                    title={heading}
                                    userId={userId}
                                    id={titleId}
                                    mediaType={mediaType}
                                    posterPath={poster_path}
                                    video={videos.length ? videos[0].key : null}
                                />
                            </Info>
                        </InnerDiv>

                        <OuterSimRow>
                            {!error && showSimilar > 0 ? (
                                <>
                                    <h1>Similar Movies</h1>
                                    <SimRow>
                                        {similar?.map((similarmovie) => (
                                            <Link
                                                to={`/${mediaType}/${similarmovie?.id}`}
                                                key={similarmovie.id}
                                            >
                                                <img
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                    loading="lazy"
                                                    alt={
                                                        similarmovie?.original_title
                                                    }
                                                    title={
                                                        similarmovie?.original_title
                                                    }
                                                    src={`${IMAGE_BASE_URL}w154/${similarmovie?.poster_path}`}
                                                />
                                            </Link>
                                        ))}
                                    </SimRow>
                                </>
                            ) : (
                                <h1>No Similar Content Found.</h1>
                            )}
                        </OuterSimRow>
                    </OuterDiv>
                </Container>
            )}
            {!error && !heading && <Spinner />}
            {error && <NotFound>NOT FOUND 404</NotFound>}
        </React.Fragment>
    );
};

export default Title;
