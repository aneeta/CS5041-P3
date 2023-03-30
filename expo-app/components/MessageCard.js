import { ConfigProvider, theme } from "antd";
import { Col } from "antd";
import { Row } from "antd";
import { Space } from "antd";
import { Avatar, Card } from "antd";

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

const { useToken } = theme;


export default function MessageCard(props) {

    const { token } = useToken();

    const offset = (props.ownMsg) ? 6 : 0

    const msgTheme = {
        components: {
            Card: {
                fontSizeLG: 32,
                // fontSize: 10,
                fontWeightStrong: 600,
                colorText: token.colorPrimaryBorder,
                paddingLG: 10,
                // colorFillAlter: props.color,

                // textAlign: (props.ownMsg)? 'right': 'left',
                // alignContent: 'center',
            },
        }
    }
    return (
        <ConfigProvider theme={msgTheme}>
            <Row>
                <Col span={18} offset={offset}>
                    <Card
                        title={props.message}
                    // cover={}
                    >
                        <div style={{ backgroundColor: props.color, height: 5, width: '100%' }} />
                        {/* <Card.Grid hoverable={false} style={{ width: '100%' }}>
                            
                        </Card.Grid> */}
                        <Card.Grid hoverable={false} style={{ width: '30%', textAlign: 'left' }}>
                            {props.sender}
                            {/* <Space> */}
                            {/* <Card.Meta
                        avatar={<Avatar style={{ backgroundColor: props.color }} />}
                    /> */}
                            {/* {props.sender} */}
                            {/* </Space> */}
                        </Card.Grid>
                        <Card.Grid hoverable={false} style={{ width: '70%', textAlign: 'right' }}>{props.timestamp}</Card.Grid>

                    </Card>
                </Col>


            </Row>


        </ConfigProvider>


    )
}

// import { Card, Text } from 'react-native-paper';

// export default function MessageCard(props) {

//     return (
//         // Message card with different margin for the last card
//         <Card
//             style={{
//                 // minHeight: 50,
//                 // minWidth: 200,
//                 marginLeft: 10,
//                 marginRight: 10,
//                 marginTop: 10,
//                 marginBottom: props.i === props.iMax - 1 ? 10 : 0
//             }}
//         >
//             <Card.Title title={props.sender} subtitle={(new Date(props.created)).toLocaleString()} />
//             <Card.Content>
//                 <Text variant="titleLarge">{props.content}</Text>
//             </Card.Content>
//         </Card>
//     )
// };

