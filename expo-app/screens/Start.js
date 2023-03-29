import { Card } from "antd";
import { useContext } from "react";
import { Text } from "react-native";
import AppLayout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import { UserContext } from "../Context";


export default function Start() {

    const { sessionData, setSessionData } = useContext(UserContext);

    return (
        <AppLayout>
            <Card
                // bodyStyle={{
                //     display: "flex",
                //     justifyContent: "center"
                // }}
                title="Summary"
            >
                <StatsCard
                    title="My Stats"
                />
                <StatsCard
                    title="Paired Stats"
                />
            </Card>
        </AppLayout >
    )
}