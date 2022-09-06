import React, {useState} from 'react';
import {Character} from "../types/Types";
import {Button, Card, Modal, Col, Row} from "antd";

const { Meta } = Card;

type CharacterProps = {
    character: Character
}

const CharacterCard = ({character}: CharacterProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const setFav = (id: number) => {

    }

    return (
        <>
        <Card
            hoverable
            onClick={showModal}
            cover={<img alt="example" src={character.image} />}
        >
            <Meta  title={character.name} />
            <Button type="link">See Detail</Button>
        </Card>
            <Modal title={character.name} open={isModalOpen} onOk={handleOk} width={500} onCancel={handleCancel} okText={"Set as Favorite"}>
                <Row>
                    <Col span={12}>
                        <img alt="example" src={character.image} />
                    </Col>
                    <Col span={12}>
                        <ul>
                            <li><b>Status:</b> {character.status}</li>
                            <li><b>Species:</b> {character.species}</li>
                            <li><b>Gender:</b> {character.gender}</li>
                            <li><b>Origin:</b> {character.origin.name}</li>
                            <li><b>Location:</b> {character.location.name}</li>
                        </ul>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};


export default CharacterCard;
