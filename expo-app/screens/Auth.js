import { Button, Card, Form, Select } from "antd";
import { push, ref } from "firebase/database";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../components/Layout";
import { UserContext } from "../Context";
import { db } from "../Firebase";

const { Option } = Select;


const Auth = (props) => {

    const navigate = useNavigate();

    const { sessionData, setSessionData } = useContext(UserContext);

    const [form] = Form.useForm();

    const onSubmit = ({ selectUser }) => {
        push(ref(db, `auth/${sessionData.firebaseUser}`), selectUser)

        setSessionData({
            ...sessionData, ...{
                appAuth: true,
                selectedUser: selectUser
            }
        })

        navigate('/');
    };

    return (
        <AppLayout disabled={true}>
            <Card>
                <Form
                    form={form}
                    onFinish={onSubmit}
                >
                    <Form.Item
                        name="selectUser"
                        label="Select User"
                        hasFeedback
                        rules={[{ required: true, message: 'Please select user!' }]}
                    >
                        <Select placeholder="Log in as...">
                            {sessionData.userList?.map((el, i) => <Option value={el} key={i}>{el}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            OK
                        </Button>
                    </Form.Item>

                </Form>
            </Card>

        </AppLayout>
    )
}

export default Auth;
