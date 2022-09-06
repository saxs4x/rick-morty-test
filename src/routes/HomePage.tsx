import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import request from '../api/GenRequest';
import {Character} from "../types/Types";
import {AxiosResponse} from "axios";
import {List, Grid} from "antd";
import CharacterCard from "../components/CharacterCard";

const { useBreakpoint } = Grid;
function HomePage() {

    const [characters, setCharacters] = useState<Character[] | []>([])
    const [grid, setGrid] = useState({gutter: 16, column: 4});
    const screens = useBreakpoint();

    useEffect(() => {
        if(screens.xs === true || screens.lg === false || screens.md === false){
           setGrid({gutter: 16, column: 1})
        }
    });


    useEffect(() => {
        request('get', 'character', null).then((res) => {
                setCharacters(res.data.results);
            }
        )
    }, [characters]);

    return (
        <div>
            <List
                itemLayout='horizontal'
                grid={grid}
                dataSource={characters}
                renderItem={(item) => (
                    <List.Item>
                        <CharacterCard character={item} />
                    </List.Item>
                )}
            />
        </div>
    );
}

export default HomePage;
