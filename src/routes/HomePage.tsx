import React, {useState, useEffect} from 'react';
import request from '../api/GenRequest';
import {Character} from "../types/Types";
import {List, Grid, Input, Row, Col, Button, message, Divider} from "antd";
import CharacterCard from "../components/CharacterCard";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";

const {Search} = Input;

function HomePage() {
    const [characters, setCharacters] = useState<Character[] | []>([])
    const [loading, isLoading] = useState(false);
    const [favoritesShown, isFavshown] = useState(false);
    const [next, setNext] = useState<string>('')
    const [favorites, setFavorites] = useState<Array<any>>(() => {
        const getArray = JSON.parse(localStorage.getItem('favorites') || '0')
        if (getArray !== 0) {
            return [...getArray]
        }
        return []
    })

    const callback = (item: number[]) => {
        if(item.length > 0){
            setFavorites([...item]);
        }
        else {
            setFavorites([])
        }
    }


    const onSearch = (value: string) => {
        request('get', 'character', {name: value}).then((res) => {
                setCharacters(res.data.results);
            }
        )
    };

    useEffect(() => {
        request('get', 'character', null).then((res) => {
                setCharacters(res.data.results);
                setNext(res.data.info.next)
            }
        )
    }, []);

    const seeFav = () => {
        request('get', `character/${favorites}`, null).then((res) => {
                if (res.data[0]) {
                    setCharacters(res.data)
                } else {
                    let array = res.data;
                    setCharacters([array])
                }
                isFavshown(true)
            }
        )
    }

    const hideFav = () => {
        request('get', 'character', null).then((res) => {
                setCharacters(res.data.results);
                isFavshown(false)
            }
        )

    }

    const onLoadMore = () => {
        isLoading(true);
        fetch(next)
            .then(res => res.json())
            .then(res => {
                const newData = characters.concat(res.results);
                setCharacters(newData);
                setNext(res.info.next)
                isLoading(false);
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
        <div>
            <Row style={{justifyContent: "space-between"}}>
                <Col span="12">
                    <Search placeholder="Insert the name of the character you're looking for" allowClear
                            onSearch={onSearch} loading={loading} enterButton/>
                </Col>
                {favorites.length > 0 && (
                    <Col span="12" style={{justifyContent: "flex-end", flex: 0}}>
                        {favoritesShown ? (
                            <Button title="Hide Favorites" type="default" onClick={hideFav}
                                    icon={<HeartOutlined/>}> Hide Favorites</Button>


                        ) : (
                            <Button title="See Favorites" type="primary" onClick={seeFav}
                                    icon={<HeartFilled/>}> See Favorites </Button>
                        )}
                    </Col>
                )
                }
                <Col span={24}>
                    <Divider></Divider>
                </Col>
            </Row>
            <List
                itemLayout='horizontal'
                grid={{gutter: 16, column: 4, xs: 1, sm: 1}}
                dataSource={characters}
                loadMore={loadMore}
                renderItem={(item) => (
                    <List.Item key={item?.id}>
                        <CharacterCard character={item} parentCallback={callback}/>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default HomePage;
