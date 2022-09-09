import React from 'react';
import './App.css';
import HomePage from "./routes/HomePage";
import {PageHeader} from "antd";

function App() {
    return (
        <div className="App">
            <PageHeader
                className="site-page-header"
                onBack={() => null}
                backIcon={false}
                title="Rick & Morty Characters App"
                ghost={false}
            >
                <HomePage></HomePage>
            </PageHeader>
        </div>
    );
}

export default App;
