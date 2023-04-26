import React from 'react';
import { useContext, useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Space, Typography } from "antd";
import { ContributionGraph, PieChart, LineChart } from "react-native-chart-kit";

import { UserContext, DataContext } from "../Context";


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

            // interpolate data
            const labels = []
            const datapoints = []

            for (let i = 0; i < 24; i++) {
                const time = new Date(now.setHours(now.getHours() - 1))
                const currentKey = time.toISOString().slice(0, 13);
                labels.push(currentKey.slice(11,))
                datapoints.push(lineData[currentKey] || 0)
            }

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

        }
        if (data) {
            const heatmapData = Object.entries(data).map(([date, count]) => ({ date, count }))
            setFreq(heatmapData)
            // console.log("heatmap data", data)
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

        }

        const msgFreq = filteredMsg?.map((el, i) => el.msg)
            .reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1
                return acc
            }, {})

        if (msgFreq) {
            const sortedArray = Object.entries(msgFreq).sort((a, b) => b[1] - a[1]);
            setTopMsg(sortedArray[0])
        }

        if (data && pie && msgFreq && granularFreq) {
            setLoading(false)
        }

    }, [msgData])

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
                            endDate={new Date("2023-04-11")}
                            numDays={105}
                            values={freq}
                            width={screenWidth}
                            height={220}
                            chartConfig={chartConfig}
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
                            bezier
                            style={{ borderRadius: 16 }}
                        />
                    </Col>
                </Row>
            </Space>
        </Card >
    )
}
