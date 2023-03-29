import { Carousel } from "antd";
import { Card } from "antd";
import { useContext } from "react";
import { UserContext } from "../Context";

import React from 'react';
import { Space } from "antd";


export default function StatsCard(props) {

    const { sessionData, setSessionData } = useContext(UserContext);

    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };



    return (
        <Card
            title={props.title}
        >
            <div style={{ alignItems: 'center' }}>
                <Carousel autoplay style={{ maxWidth: 500, }}>
                    <div>
                        <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>3</h3>
                    </div>

                </Carousel>
            </div>

        </Card >
    )
}