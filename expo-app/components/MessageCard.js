import { Space } from "antd";
import { Avatar, Card } from "antd";

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};

export default function MessageCard(props) {
    return (
        <Card
            title={props.message}
        >
            <Card.Grid hoverable={false} style={{ width: '50%', textAlign: 'left' }}>
                <Space>
                    <Card.Meta
                        avatar={<Avatar style={{ backgroundColor: props.color }} />}
                    />
                    {props.sender}
                </Space>
            </Card.Grid>
            <Card.Grid hoverable={false} style={{ width: '50%', textAlign: 'right' }}>{props.timestamp}</Card.Grid>

        </Card>

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

