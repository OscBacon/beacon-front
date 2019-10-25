import React from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export default (props) => {
    const {cols, renderItem, data} = props;

    while(data.length % cols !== 0){
        data.push(null);
    }

    const result = [];

    for(let i = 0; i < data.length; i += cols){
        result.push(
            <Row key={`row_${i}`}>
                {data.slice(i, Math.min(i + cols, data.length)).map((item, index) => {
                    return (
                        <Col key={`col_${index}`}>
                            {item &&
                                <Card className="mb-4 p-2">
                                    {renderItem(item)}
                                </Card>
                            }
                        </Col>
                    );
                })}
            </Row>
        );
    }

    return (
        <Container>
            {result}
        </Container>
    );
}
