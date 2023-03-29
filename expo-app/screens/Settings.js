import { Space } from "antd";
import { Button, Input, Spin, Form, message } from "antd";
import { useContext, useState } from "react";
import { ChromePicker } from "react-color";
import { Divider } from "react-native-paper";
import { Text } from "react-native-paper";
import ColorPicker from "../components/ColorPicker";
import AppLayout from "../components/Layout";
import { SettingsContext } from "../Context";

const leaf = ["0", "1", "2"];

export default function Settings() {

    const { settings, setSettings } = useContext(SettingsContext);

    // const [colors, setColors] = useState({});

    const [form] = Form.useForm();

    // const [color, setColor] = useState(colors);
    const [display, setDisplay] = useState(false)

    // const handleClick = () => {
    //     setDisplay(!display)
    // };

    const handleClose = () => {
        setDisplay(false)
    };

    const handleChange = (color) => {
        // props.
        // setColor(color.rgb)
    };

    const onSubmit = (values) => {
        console.log("settings", settings[0])
        console.log("form", values)
        // push(ref(db, `auth/${sessionData.firebaseUser}`), selectUser)

        // setSessionData({
        //     ...sessionData, ...{
        //         appAuth: true,
        //         selectedUser: selectUser
        //     }
        // })



        message.success("Settings updated!")

        // navigate('/');
    };

    return (
        <AppLayout
            title="Settings"
        > {
                (settings || settings?.length === 2) ?
                    <Form
                        onFinish={onSubmit}
                        layout="vertical"
                        onChange={(val) => { console.log(val) }}
                        fields={[{ name: "pair", value: settings[1] }]}
                        form={form}
                    >
                        <Form.Item
                            name="pair"
                            label="Paired User"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="map"
                            label="Plant Display Settings"
                        >
                            <Space direction="vertical" >
                                {leaf.map((el, i) =>
                                    <>
                                        <Divider title={`Leaf ${i + 1}`}></Divider>
                                        <Space >
                                            <Input
                                                key={i}
                                                defaultValue="Test"//{settings[el]?.m}
                                            />
                                            <span />
                                            <ColorPicker
                                                // color={{ r: settings?.[0]?.[i]?.r ?? 0, g: settings?.[0]?.[i]?.g ?? 0, b: settings?.[0]?.[i]?.b ?? 0 }}
                                                color={settings?.[0]?.[i]}
                                                display={display}
                                                handleChange={handleChange}
                                                handleClose={handleClose}
                                            // color={{
                                            //     r: '241',
                                            //     g: '112',
                                            //     b: '19',
                                            //     a: '1',
                                            // }}
                                            />
                                            {/* <ChromePicker
                                                // color={{ r: settings[0][i].r, g: settings[0][i].g, b: settings[0][i].b }}
                                                onChange={(e) => { console.log(e) }}
                                            /> */}


                                        </Space>
                                    </>

                                    // <Input
                                    //     key={i}
                                    // // initialValue={settings[el]?.m}
                                    // />


                                )}
                            </Space>

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                    :

                    <Spin tip="Loading..." />
            }
        </AppLayout >
    )
}

