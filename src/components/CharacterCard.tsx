import React, {useState, useEffect} from 'react';
import {Character, Episode} from "../types/Types";
import {Button, Card, Modal, Col, Row, message} from "antd";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import request from "../api/GenRequest";

const {Meta} = Card;

type CharacterProps = {
    character: Character,
}


const CharacterCard = ({character}: CharacterProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [episode, setEpisode] = useState(false);
    const [episodesList, setEpisodeList] = useState<Array<Episode>>([])
    const [favorites, setFavorites] = useState<Array<number>>([])
    const getArray = JSON.parse(localStorage.getItem('favorites') || '0')
    const epList = episodesList.map((episode) =>
        <li key={character.id}>
            {episode.name}
        </li>
    );

    useEffect(() => {
        if (getArray !== 0) {
            setFavorites([...getArray])
        }
    }, []);

    useEffect(() => {
       request('get', 'episode', null).then((res) => {
            let arr = res.data.results;
            arr.map((item:any, key: number) => {

            })
                setEpisodeList(res.data.results);
            }
        )
    }, []);



    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const addFav = () => {
        let array = favorites;
        let addArray = true;
        array.map((item: any, key: number) => {
            if (item === character.id) {
                array.splice(key, 1);
                addArray = false;
                message.info('Removed from Favorites')
            }
        });
        if (addArray) {
            array.push(character.id);
            message.info('Added to Favorites')
        }
        setFavorites([...array])
        localStorage.setItem('favorites', JSON.stringify(favorites))

        let storage = localStorage.getItem('favItem' + (character.id) || '0')
        if (storage == null) {
            localStorage.setItem(('favItem' + (character.id)), JSON.stringify(character));
        } else {
            localStorage.removeItem('favItem' + (character.id));
        }
    }

    const seeEpisodes = () => {
        setEpisode(!episode);
    }


    return (
        <>
            <Card
                hoverable
                onClick={showModal}
                cover={<img alt="example" src={character.image}/>}
            >
                <Meta title={character.name}/>
                <Button type="link">See Detail</Button>
            </Card>
            <Modal
                title={character.name}
                open={isModalOpen}
                footer={null}
                width={350}
                onCancel={handleCancel}>
                <Row>
                    <Col span={24}>
                        <span id="fav">
                          {favorites.includes(character.id) ? (
                              <Button type="primary" onClick={addFav} shape="circle"
                                      icon={<HeartFilled/>}/>
                          ) : (
                              <Button type="default" onClick={addFav} shape="circle"
                                      icon={<HeartOutlined/>}/>
                          )}
                        </span>
                        <img alt="example" src={character.image}/>
                    </Col>
                    <Col span={24}>
                        <ul id="characterInfo">
                            <li><b>Status:</b> {character.status}</li>
                            <li><b>Species:</b> {character.species}</li>
                            <li><b>Gender:</b> {character.gender}</li>
                            <li><b>Origin:</b> {character.origin.name}</li>
                            <li><b>Location:</b> {character.location.name}</li>
                            <li style={{textAlign: "center", justifyContent: "center"}}>
                                {episode ? (<Button onClick={seeEpisodes} type="link">Hide list of episodes</Button>) : (
                                    <Button onClick={seeEpisodes} type="link">View list of episodes</Button>)}
                            </li>
                        </ul>
                    </Col>
                    {episode && (
                        <Col span={24}>
                            <ul id="characterInfo">
                                {epList}
                            </ul>
                        </Col>
                    )
                    }
                </Row>
            </Modal>
        </>
    );
};


export default CharacterCard;
