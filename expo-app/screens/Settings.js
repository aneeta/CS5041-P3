import { Card, Button, Input, Spin, Space, Form, message } from "antd";
import { ref, set } from "firebase/database";
import { useListVals } from 'react-firebase-hooks/database';
import { useContext, useEffect, useState } from "react";
import { Divider } from "react-native-paper";
import { SettingsContext, UserContext } from "../Context";
import { db } from "../Firebase";
import ColorPicker from "../components/ColorPicker";
import AppLayout from "../components/Layout";


const leaf = ["0", "1", "2"];


export default function Settings() {

    const { sessionData, setSessionData } = useContext(UserContext);

    const [settingsList, setLoading, setError] = useListVals((sessionData.firebaseUser && sessionData.selectedUser) ? ref(db, `/settings/${sessionData.selectedUser}`) : null);

    const [settings, setSettings] = useState()

    const [form] = Form.useForm();

    const onSubmit = (values) => {
        // update messages
        settings[0][0].m = values.m0
        settings[0][1].m = values.m1
        settings[0][2].m = values.m2

        const updatedSettings = {
            map: settings[0],
            pair: settings[1]
        }

        const user = sessionData.selectedUser

        set(ref(db, `settings/${user}`), updatedSettings)

        message.success("Settings updated!")
    };

    useEffect(() => {
        setSettings(settingsList)
    }, [settingsList, setLoading, setError])


    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            <AppLayout
                title="Settings"
            >
                <Card
                    title="Settings"
                    style={{
                        textAlign: 'center',
                        alignContent: 'center',
                    }}
                >
                    {(settings && !setLoading) ?
                        <Form
                            onFinish={onSubmit}
                            layout="vertical"
                            fields={[
                                { name: "pair", value: settings[1] },
                                { name: "m0", value: settings[0]?.[0].m },
                                { name: "m1", value: settings[0]?.[1].m },
                                { name: "m2", value: settings[0]?.[2].m }]}
                            form={form}
                        >
                            <Space direction="vertical">
                                <Form.Item
                                    name="pair"
                                    label="Paired User"
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label="Plant Display Settings"
                                >
                                    <Space direction="vertical" >
                                        {leaf.map((el, i) =>
                                            <>
                                                <Form.Item
                                                    // name={el}
                                                    label={`Leaf ${i + 1}`}
                                                >
                                                    <Space >
                                                        <Form.Item
                                                            name={`m${i}`}
                                                            label={`Message`}
                                                        >
                                                            <Input key={i} />
                                                        </Form.Item>
                                                        <span />
                                                        <Form.Item
                                                            name={`c${i}`}
                                                            label={`Color`}
                                                        >
                                                            <ColorPicker idx={i} />
                                                        </Form.Item>
                                                    </Space>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Space>
                                </Form.Item>
                            </Space>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                        :
                        <Spin tip="Loading..." />
                    }
                </Card>
            </AppLayout >
        </SettingsContext.Provider>
    )
}
