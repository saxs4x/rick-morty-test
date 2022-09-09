import React, {useState, useEffect} from 'react';
import {Character, Episode} from "../types/Types";
import {Button, Card, Modal, Col, Row, message, List} from "antd";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import request from "../api/GenRequest";

const {Meta} = Card;

type CharacterProps = {
    character: Character,
    parentCallback: any;
}

const count = 3;


const CharacterCard = ({character, parentCallback}: CharacterProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCModalOpen, setIsCModalOpen] = useState(false);
    const [episodesList, setEpisodeList] = useState<Array<Episode>>([])
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [favorites, setFavorites] = useState<Array<number>>([])
    const getArray = JSON.parse(localStorage.getItem('favorites') || '0')
    const [next, setNext] = useState<string>('')

    useEffect(() => {
        if (getArray !== 0) {
            setFavorites([...getArray])
        }
    }, []);

    const showModal = () => {
        setIsModalOpen(true);
    };



    const showCModal = () => {
        request('get', 'episode', null).then((res) => {
                let arr = res.data.results;
                setNext(res.data.info.next)
                arr.map((item: Episode) => {
                    if (item.characters.includes(character.url)) {
                        setEpisodeList(current => [...current, item])
                    }
                })
            }
        )
        setIsCModalOpen(true);
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleCCancel = () => {
        setIsCModalOpen(false);
    };

    const addFav = () => {
        let array = favorites;
        let addArray = true;
        array.map((item: any, key: number) => {
            if (item === character.id) {
                array.splice(key, 1);
                addArray = false;
                message.info('Removed from Favorites')
                parentCallback(favorites)
            }
        });
        if (addArray) {
            array.push(character.id);
            message.info('Added to Favorites')
            parentCallback(favorites)
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

    const onLoadMore = () => {
        setLoading(true);
        fetch(next)
            .then(res => res.json())
            .then(res => {
                const newData = episodesList.concat(res.results);
                setEpisodeList(newData);
                setNext(res.info.next)
                setLoading(false);
                // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                // In real scene, you can using public method of react-virtualized:
                // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                window.dispatchEvent(new Event('resize'));
            });
    };


    const loadMore = next ? (
        <div
            style={{
                textAlign: 'center',
                marginTop: 12,
                height: 32,
                lineHeight: '32px',
            }}
        >
            <Button onClick={onLoadMore}>loading more</Button>
        </div>) : null


    return (
        <>
             <span id="fav">
                          {favorites.includes(character.id) ? (
                              <Button type="primary" onClick={addFav} shape="circle"
                                      icon={<HeartFilled/>}/>
                          ) : (
                              <Button type="default" onClick={addFav} shape="circle"
                                      icon={<HeartOutlined/>}/>
                          )}
                        </span>
            <Card
                hoverable
                cover={<img alt="example" src={character.image}/>}
            >
                <Meta title={character.name}/>
                <Button onClick={showModal} type="link">See Detail</Button>
                <Button onClick={showCModal} type="link">List of Episodes</Button>
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
                        <ul className="modalList">
                            <li><b>Status:</b> {character.status}</li>
                            <li><b>Species:</b> {character.species}</li>
                            <li><b>Gender:</b> {character.gender}</li>
                            <li><b>Origin:</b> {character.origin.name}</li>
                            <li><b>Location:</b> {character.location.name}</li>
                        </ul>
                    </Col>
                </Row>
            </Modal>
            <Modal
                title={character.name + '\'s list of episodes'}
                open={isCModalOpen}
                footer={null}
                width={350}
                onCancel={handleCCancel}>
                <List
                    className="modalList"
                    size="small"
                    loadMore={loadMore}
                    dataSource={episodesList}
                    renderItem={item => (
                        <List.Item>
                            {item.name}
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};


export default CharacterCard;
