import { Space } from "antd";
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
            <Space direction="vertical">
                <StatsCard
                    title={`My Stats (${sessionData.selectedUser})`}
                    user={sessionData.selectedUser}
                />
                {/* todo make nice?? */}
                <div style={{ margin: 25 }} />
                <StatsCard
                    title={`Paired Stats (${sessionData.pairedUser})`}
                    user={sessionData.pairedUser}
                />
            </Space>
        </AppLayout >
    )
}