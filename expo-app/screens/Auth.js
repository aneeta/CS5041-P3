import { Button, Card, Form, Select } from "antd";
import { push, ref } from "firebase/database";
import { useContext } from "react";
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
                selectedUser: selectUser,
                pairedUser: (selectUser === 'user1') ? 'user2' : (selectUser === 'user2') ? 'user1' : 'unknown'

            }
        })
        navigate('/home');
    };

    return (
        <AppLayout disabled={true}>
            <Card
                title="Log in to use"
                style={{ textAlign: 'center' }}
            >
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
