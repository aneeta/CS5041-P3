import { Spin } from "antd";
import { Space } from "antd";
import { Card } from "antd";
import { useContext, useEffect } from "react";
import { Text } from "react-native-paper";
import AppLayout from "../components/Layout";
import MessageCard from "../components/MessageCard";
import { DataContext, UserContext } from "../Context";
import { rgbToHex } from "../utils";


export default function Messages() {
    const { sessionData, setSessionData } = useContext(UserContext);
    const { msgData, dataLoading } = useContext(DataContext);

    // const ownMessages = msgData?.filter(el => el.from === sessionData.selectedUser)
    // const receivedMessages = msgData?.filter(el => el.to === sessionData.selectedUser)

    return (
        <AppLayout
            title="Messages"
        >
            {
                (!dataLoading && msgData) ?
                    <Space direction="vertical">
                        {
                            msgData.filter(el => el !== "").map((el, i) =>
                                // { console.log(el.color) }
                                <MessageCard
                                    key={i}
                                    message={el.msg}
                                    sender={el.from}
                                    timestamp={new Date(el.sent * 1000).toLocaleDateString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    color={rgbToHex(el.color)}
                                />
                            )
                        }
                    </Space>


                    :
                    <Spin tip="Loading..." />
            }

        </AppLayout>
    )
}
