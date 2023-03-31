import { Card, Col, Row, ConfigProvider, theme } from "antd";

const { useToken } = theme;

export default function MessageCard(props) {

    const { token } = useToken();

    const offset = (props.ownMsg) ? 6 : 0

    const msgTheme = {
        components: {
            Card: {
                fontSizeLG: 32,
                fontWeightStrong: 600,
                colorText: token.colorPrimaryBorder,
                paddingLG: 10,
            },
        }
    }
    return (
        <ConfigProvider theme={msgTheme}>
            <Row>
                <Col span={18} offset={offset}>
                    <Card
                        title={props.message}
                    >
                        <div style={{ backgroundColor: props.color, height: 5, width: '100%' }} />
                        <Card.Grid
                            hoverable={false}
                            style={{ width: '30%', textAlign: 'left' }}>
                            {props.sender}
                        </Card.Grid>
                        <Card.Grid
                            hoverable={false} style={{ width: '70%', textAlign: 'right' }}>
                            {props.timestamp}
                        </Card.Grid>
                    </Card>
                </Col>


            </Row>


        </ConfigProvider>


    )
}
