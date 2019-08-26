import React, { Component } from 'react';

import { Button, Card, CardBody, CardHeader, Col, Row, NavItem, Nav, NavLink, Table } from 'reactstrap';

  
class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      process: "",
      orderData: [],
    };
  }

  componentWillMount() {
    this.getOrder("");
  }

  getOrder(state) {
    fetch(process.env.REACT_APP_HOST+"/order/"+state, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(orderData => {this.setState({orderData})});
  }

  tabClick(process) {
    this.setState({
      process
    });
    this.getOrder(process);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row className="mb-5">
          <Col md="10" xs="10" sm="10" />
          <Col md="2" xs="2" sm="2">
            <Button block color="primary" onClick={()=> {this.props.history.push('/main/sales/order');}}>주문 추가하기</Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardHeader>
                주문 보기
              </CardHeader>
              <CardBody>
                <Nav tabs>
                  <NavItem>
                    <NavLink active={this.state.process === ""} onClick={() => this.tabClick("")} href="#">전체</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.process === "estimate"} onClick={() => this.tabClick("estimate")} href="#">견적</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.process === "order"} onClick={() => this.tabClick("order")} href="#">주문</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.process === "shipment"} onClick={() => this.tabClick("shipment")} href="#">출하</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink active={this.state.process === "complete"} onClick={() => this.tabClick("complete")} href="#">완료</NavLink>
                  </NavItem>
                </Nav>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>일자</th>
                      <th>거래처</th>
                      <th>주문 금액 합계</th>
                      <th>받은 금액</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.orderData.map((e, i) => {
                      return <tr key={e.id} onClick={() => {this.props.history.push(`/sales/order/${e.id}`)}}>
                        <td>{e.id}</td>
                        <td>{e.date}</td>
                        <td>{e.name}</td>
                        <td>{e.price}</td>
                        <td>{e.receive}</td>
                        <td>{e.state}</td>
                      </tr>;
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Sales;