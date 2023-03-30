import { Carousel } from "antd";
import { Card } from "antd";
import { useContext, useEffect, useState } from "react";
import { UserContext, DataContext } from "../Context";

import React from 'react';
import { Space } from "antd";
import { Statistic } from "antd";
import { ContributionGraph, PieChart } from "react-native-chart-kit";

import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width / 2;

const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16
    },
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
    }
}


export default function StatsCard(props) {

    const { sessionData, setSessionData } = useContext(UserContext);
    const { msgData, dataLoading } = useContext(DataContext);

    const [freq, setFreq] = useState([])
    const [pie, setPie] = useState([])

    useEffect(() => {
        console.log(msgData)
        const data = msgData?.filter(el => el.from === props.user)
            .map((el, i) => new Date(el.sent * 1000)
                .toLocaleDateString("en-GB"))
            .reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1
                return acc
            }, {})
        if (data) {
            setFreq(Object.entries(data).map(([name, count]) => ({ name, count })))
            console.log(freq)
        }

        const pie = msgData?.filter(el => el.from === props.user)
            .map((el, i) => el.leaf)
            .reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1
                return acc
            }, {})
        if (pie) {
            const colors = ["red", "green", "blue"]
            setPie(Object.entries(pie).map(([leaf, count]) => ({ leaf, count })))
            // .map((el, i) => ({ ...el, ...{ color: colors[i] } }))
            console.log(freq)
        }

    }, [msgData])


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
                <Carousel autoplay autoplaySpeed={8000} style={{ maxWidth: 500, }}>
                    <div>
                        <Statistic
                            title="All touches"
                            value={
                                msgData?.filter(el => el.from === props.user).length
                            }
                        />
                        {/* <h3 style={contentStyle}>1</h3> */}
                    </div>
                    {/* <div>
                        <Statistic
                            title="Top Message"
                            value={
                                msgData?.filter(el => el.from === props.user).map((el, i) => el.msg)
                                .reduce((acc, item) => {
                                    acc[item] = (acc[item] || 0) + 1
                                    return acc
                                }, {})
                            }
                        />
                        {/* <h3 style={contentStyle}>1</h3> */}
            </div> */}
            <div>
                <PieChart
                    data={pie}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    accessor={"leaf"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    absolute
                />

            </div>
            <div>
                {/* TODO fix, freq not displaying */}
                <ContributionGraph
                    endDate={new Date("2023-04-01")}
                    numDays={105}
                    values={freq}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                />

            </div>

        </Carousel>
            </div >

        </Card >
    )
}