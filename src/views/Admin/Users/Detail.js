import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Table, Nav, NavItem, NavLink } from 'reactstrap';

class UserListDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [[]],
      familyData: [],
    }
  }

  getDetail() {
    fetch(process.env.REACT_APP_HOST + "/api/admin/users/detail/"+this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => {
        if (response.status === 401) {
          return Promise.all([401])
        } else {
          return Promise.all([response.status, response.json()]);
        }
      })
      .then(data => {
        let status = data[0];
        if (status === 200)
          this.setState({ data: data[1][0] });
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      })
  }

  getProductFamily() {
    fetch(process.env.REACT_APP_HOST + "/api/admin/users/productFamily/" + this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => {
        if (response.status === 401) {
          return Promise.all([401])
        } else {
          return Promise.all([response.status, response.json()]);
        }
      })
      .then(data => {
        let status = data[0];
        if (status === 200) {
          this.setState({familyData: data[1]})
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      });
  }

  tabClick(category) {
    this.setState({
      category,
    }, () => {
      this.getAllFamily();
    });
  }

  componentWillMount() {
		this.getDetail();
		this.getProductFamily();
  }

  render() {
		const { data, familyData } = this.state;
		console.warn(familyData)
    return (
      <div className="animated fadeIn">
        <link rel="stylesheet" type="text/css" href="css/Table.css"></link>
        <link rel="stylesheet" type="text/css" href="css/RegisterDetail.css"></link>
        <Row>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>회원 정보</Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className="ShowTable">
                  <tbody>
                    <tr>
                      <th>이름</th>
                      <td>
                        {data.name}
                      </td>
                      <th>아이디</th>
                      <td>
                        {data.email}
                      </td>
                    </tr>
                    <tr>
                      <th>전화번호</th>
                      <td>
                        {data.phone}
                      </td>
                      <th>사업자등록번호</th>
                      <td>
                        {data.crNumber}
                      </td>
                    </tr>
                    <tr>
                      <th>주소</th>
                      <td colSpan="3">
                        {data.address}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>

          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>취급 품목</Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div>
                  <ul className="ul-productFamily" style={{ listStyleType: "none", }}>
                    {familyData.map((e, i) => {
                      return (
                        <li key={i} className="list-productFamily" style={{
                          color: '#fff',
                          backgroundColor: '#20A8D8',
                        }}>{e.name}</li>
                      )
                    }
                    )}
                  </ul>
                </div>
              </CardBody>
            </Card>
          </Col>

        </Row>
      </div>
    );
  }
}

export default UserListDetail;