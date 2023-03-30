import { Spin, List } from "antd";
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
                    // console.log('msg')
                    // <Space size={100}>
                    <List
                        grid={{
                            gutter: 16,
                            column: 1,
                        }}
                        pagination={{
                            pageSize: 10
                        }}
                        dataSource={msgData.filter(el => el !== "")}
                        renderItem={(el) => (
                            <List.Item>
                                <MessageCard
                                    // key={i}
                                    message={el.msg}
                                    sender={el.from}
                                    timestamp={new Date(el.sent * 1000).toLocaleDateString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    color={rgbToHex(el.color)}
                                    ownMsg={sessionData.selectedUser === el.from}
                                />
                            </List.Item>
                        )}
                    />
                    // </Space>

                    :
                    <Spin tip="Loading..." />
            }

        </AppLayout>
    )
}

                   // <>
                    //     {
                    // msgData.filter(el => el !== "").map((el, i) =>
                    //     // {console.log(el.color)}
                    //     <MessageCard
                    //         key={i}
                    //         message={el.msg}
                    //         sender={el.from}
                    //         timestamp={new Date(el.sent * 1000).toLocaleDateString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    //         color={rgbToHex(el.color)}
                    //         ownMsg={sessionData.selectedUser === el.from}
                    //     />
                    //         )
                    //     }
                    // </>