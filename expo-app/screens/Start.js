import { Space } from "antd";
import { Card } from "antd";
import { useContext } from "react";
import { Text } from "react-native";
import AppLayout from "../components/Layout";
import StatsCard from "../components/StatsCard";
import { UserContext } from "../Context";


export default function Start() {

    const { sessionData, setSessionData } = useContext(UserContext);

    const otherUser = (sessionData.selectedUser == 'user1') ? 'user2' : 'user1'
    return (
        <AppLayout>
            <Card
                // bodyStyle={{
                //     display: "flex",
                //     justifyContent: "center"
                // }}
                title="Summary"
            >
                <Space direction="vertical">
                    <StatsCard
                        title={`My Stats (${sessionData.selectedUser})`}
                        user={sessionData.selectedUser}
                    />
                    <StatsCard
                        title={`Paired Stats (${otherUser})`}
                        user={otherUser}
                    />

                </Space>

            </Card>
        </AppLayout >
    )
}