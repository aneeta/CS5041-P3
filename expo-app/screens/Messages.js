import { Spin, List } from "antd";
import { useContext } from "react";

import AppLayout from "../components/Layout";
import MessageCard from "../components/MessageCard";
import { DataContext, UserContext } from "../Context";
import { rgbToHex } from "../utils";


export default function Messages() {
    const { sessionData, setSessionData } = useContext(UserContext);
    const { msgData, dataLoading } = useContext(DataContext);

    return (
        <AppLayout
        >
            <div style={{ textAlign: 'center', maxWidth: 750 }}>
                {(!dataLoading && msgData) ?
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
                                    message={el.msg}
                                    sender={el.from}
                                    timestamp={new Date(el.sent * 1000).toLocaleDateString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    color={rgbToHex(el.color)}
                                    ownMsg={sessionData.selectedUser === el.from}
                                />
                            </List.Item>
                        )}
                    />
                    :
                    <Spin tip="Loading..." />}
            </div>
        </AppLayout>
    )
}
