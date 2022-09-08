import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import request from '../api/GenRequest';
import {Character} from "../types/Types";
import {AxiosResponse} from "axios";
import {List, Grid} from "antd";
import CharacterCard from "../components/CharacterCard";


function HomePage() {

    const [characters, setCharacters] = useState<Character[] | []>([])

    useEffect(() => {
        request('get', 'character', null).then((res) => {
                setCharacters(res.data.results);
            }
        )
    }, []);

    return (
        <div>
            <List
                itemLayout='horizontal'
                grid={{gutter: 16, column: 4, xs: 1, sm: 1}}
                dataSource={characters}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <CharacterCard character={item}/>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default HomePage;
