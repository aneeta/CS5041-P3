import { Carousel } from "antd";
import { Card, Row, Col } from "antd";
import { useContext, useEffect, useState } from "react";
import { UserContext, DataContext } from "../Context";

import React from 'react';
import { Space } from "antd";
import { Statistic } from "antd";
import { ContributionGraph, PieChart, LineChart } from "react-native-chart-kit";

import { Dimensions } from "react-native";
import { Divider } from "react-native-paper";
import { Typography } from "antd";

const screenWidth = 400;

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

    const [cardLoading, setLoading] = useState(true);

    const [freq, setFreq] = useState([])
    const [pie, setPie] = useState([])
    const [topMsg, setTopMsg] = useState([])
    const [granularFreq, setGranularFreq] = useState({})

    useEffect(() => {
        setLoading(true)

        const filteredMsg = msgData?.filter(el => el.from === props.user)
        // console.log(msgData)
        const data = filteredMsg?.map((el, i) => new Date(el.sent * 1000).toISOString().slice(0, 10))
            .reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1
                return acc
            }, {})
        const lineData = filteredMsg?.map((el, i) => new Date(el.sent * 1000).toISOString().slice(0, 13))
            .reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1
                return acc
            }, {})

        if (lineData) {
            const now = new Date()

            const labels = []
            const datapoints = []

            for (let i = 0; i < 24; i++) {
                const time = new Date(now.setHours(now.getHours() - 1))
                const currentKey = time.toISOString().slice(0, 13);
                labels.push(currentKey.slice(11,))
                datapoints.push(lineData[currentKey] || 0)
            }

            // console.log("interpolatedData", interpolatedData);

            // const sortedTimestamps = Object.keys(lineData).sort();
            // const startDate = new Date(sortedTimestamps[0]);
            // const endDate = new Date(sortedTimestamps[sortedTimestamps.length - 1]);



            // for (let current = startDate; current <= endDate; current.setHours(current.getHours() + 1)) {
            //     console.log("current", current)
            //     const currentKey = current.toISOString().slice(0, 13);
            //     const formattedKey = currentKey.replace("T", " ") + ":00"
            //     interpolatedData[formattedKey] = lineData[currentKey] || 0;
            // }

            // console.log("interpolatedData", interpolatedData);


            const data = {
                labels: labels.reverse(),
                datasets: [
                    {
                        data: datapoints.reverse(),
                        // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                        // strokeWidth: 2 // optional
                    }
                ],
                legend: ["Number of touches"] // optional
            };

            setGranularFreq(data)

            // console.log("linegraph data", lineData)
            // console.log("linegraph data keys", Object.keys(lineData))
            // console.log("linegraph data transformed", data)

            // const lineDataTransformed = Object.entries(data).map(([date, count]) => ({ date, count }))

        }
        if (data) {
            const heatmapData = Object.entries(data).map(([date, count]) => ({ date, count }))
            setFreq(heatmapData)
            console.log("heatmap data", data)
            console.log("heatmap data transformed", heatmapData)
        }

        const pie = filteredMsg?.map((el, i) => el.leaf)
            .reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1
                return acc
            }, {})
        if (pie) {
            const colors = ["#d48806", "#faad14", "#ffd666"]
            const labels = ["Left", "Middle", "Right"]
            const transformedPieData = Object.entries(pie).map(([leaf, count]) => ({ leaf, count })).map((el, i) => ({ ...el, ...{ name: labels[i], color: colors[i] } }))
            setPie(transformedPieData)
            // // .map((el, i) => ({ ...el, ...{ color: colors[i] } }))
            // console.log("pie data", pie)
            // console.log("pie data transformed", transformedPieData)
        }

        const msgFreq = filteredMsg?.map((el, i) => el.msg)
            .reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1
                return acc
            }, {})

        // const sortedMsgFreq = Object.fromEntries(sortedArray);
        if (msgFreq) {
            const sortedArray = Object.entries(msgFreq).sort((a, b) => b[1] - a[1]);
            // setTopMsg(sortedArray.slice(0, 3))
            setTopMsg(sortedArray[0])
            //TODO change to props.topN
        }

        if (data && pie && msgFreq && granularFreq) {
            setLoading(false)
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
            loading={cardLoading}
            style={{ textAlign: 'left' }}
        ><Space direction="vertical" size={25}>
                <Row gutter={[20, 20]}>
                    <Col span={8}>
                        <Statistic
                            title="All touches"
                            value={
                                msgData?.filter(el => el.from === props.user).length
                            }
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="Top Message"
                            value={topMsg?.[0]}
                        />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title="Top Message Sent"
                            value={topMsg?.[1]}
                            suffix=" times"
                        />
                    </Col>
                    {/* <Col span={8}>
                    <Statistic
                        title="Time since last message sent"
                        value={0}
                    />
                </Col> */}
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={12}>
                        <Typography.Text type="secondary">Touched leaves breakdown</Typography.Text>
                        <PieChart
                            data={pie}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                            accessor={"count"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                        // absolute
                        />
                    </Col>
                    <Col span={12}>
                        <Typography.Text type="secondary">Touched history</Typography.Text>
                        <ContributionGraph
                            endDate={new Date("2023-04-01")}
                            numDays={105}
                            values={freq}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
                        // onDayPress={(e) => { console.log(e) }}
                        />
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Typography.Text type="secondary">Activity Details for the past day</Typography.Text>
                        <LineChart
                            data={granularFreq}
                            width={800}
                            height={220}
                            chartConfig={chartConfig}
                            // verticalLabelRotation={90}
                            bezier
                        />
                    </Col>
                </Row>

            </Space>



        </Card >
    )
}

{/* <div style={{ alignItems: 'center' }}> */ }
{/* <Carousel autoplay autoplaySpeed={8000} style={{ maxWidth: 500, }}> */ }
// <div>
//     <Statistic
//         title="All touches"
//         value={
//             msgData?.filter(el => el.from === props.user).length
//         }
//     />
//     {/* <h3 style={contentStyle}>1</h3> */}
// </div>
// <div>
//     <Statistic
//         title="Top Message"
//         value={
//             msgData?.filter(el => el.from === props.user).map((el, i) => el.msg)
//                 .reduce((acc, item) => {
//                     acc[item] = (acc[item] || 0) + 1
//                     return acc
//                 }, {})
//         }
//     />
{/* <h3 style={contentStyle}>1</h3> */ }
// </div>
// <div>


// </div>
// <div>
{/* TODO fix, freq not displaying */ }

                // </div>

                // {/* </Carousel> */}
            // </div>