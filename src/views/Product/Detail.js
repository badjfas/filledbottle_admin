import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Col, Row, Button, Table, Badge, Input } from 'reactstrap';
import API  from "./../../api"

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
			data: {},
			detail_file: []
    };
  }

  componentWillMount() {
    this.getProduct();
  }

  getProduct() {
    fetch(process.env.REACT_APP_HOST + "/product/" + this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    })
      .then(response => response.json())
      .then(data => { this.setState({ data: data[0] }, () => {
				if(this.state.data.detail_file)
					this.setState({detail_file: this.state.data.detail_file.split('|')});
			}) });
  }

  deactivateProduct(id) {
    let c = window.confirm('Are you sure you wish to delete this item?')
    if (c) {
      fetch(process.env.REACT_APP_HOST + "/product/deactivate", {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          id
        })
      })
        .then(response => response.json())
        .then(_ => { this.getProduct() });
    }
  }

  activateProduct(id) {
    let c = window.confirm('이 품목을 활성화하시겠습니까?')
    if (c) {
      fetch(process.env.REACT_APP_HOST + "/product/activate", {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          id
        })
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
            this.getProduct()
          else {
            alert('로그인 하고 접근해주세요')
            this.props.history.push('/login')
          }
        });
    }
  }

  render() {
    var data = this.state.data;
    console.log(API.getProduct(this.props.match.params.id))
    return (
      <div className="animated fadeIn">
      <link rel="stylesheet" type="text/css" href="css/Table.css"></link>
      <link rel="stylesheet" type="text/css" href="css/ProductDetail.css"></link>
        <Row>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>품목 상세</Col>
                  <Col>
                    <div style={{float : 'right'}}>
                      <Button color="primary" onClick={() => { this.props.history.goBack() }}>뒤로가기</Button>
                      <Button color="primary" onClick={() => { this.props.history.push(`/main/product/edit/${this.props.match.params.id}`) }} style={{marginLeft : '10px'}}>수정</Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className="ShowTable">
                  <tbody>
                    <tr>
                      <th>품목명</th>
                      <td>
                        {data.name}
                      </td>
                    </tr>
                    <tr>
											<th>품목군</th>
                      <td>
                        {data.familyName}
                      </td>
                    </tr>
                    <tr>
                      <th>판매 단가</th>
                      <td >
                        {data.price_shipping}
                      </td>
                    </tr>
                    <tr>
											<th>상태</th>
                      <td>{data.set ? <Badge color="primary">활성화</Badge> : <Badge color="danger">비활성화</Badge>}</td>
                    </tr>
                    <tr>
                      <th>대표 사진</th>
                      <td style={ {textAlign : "center"} }>
                        <img alt="품목 사진" src={data.file_name ? "https://bnbnong.com:4001/static/" + data.file_name : '318x180.svg'} />
                      </td>
                    </tr>
                    <tr>
                      <th>상세 사진</th>
                      <td style={ {textAlign : "center"} }>
                        { this.state.detail_file.map((e,i) => {
													return <img alt="상세 사진1" src={"https://bnbnong.com:4001/static/" + e} style={{display: "block", margin: '0 auto'}}/>
												})}
                      </td>
                    </tr>

                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <Row>
                  <Col>
                    {
                      data.set ?
                        <Button block style={{ width: 120 }} color="ghost-danger" onClick={() => this.deactivateProduct(this.props.match.params.id)}>품목 비활성화</Button> :
                        <Button block style={{ width: 100 }} color="ghost-primary" onClick={() => this.activateProduct(this.props.match.params.id)}>품목 활성화</Button>
                    }
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Detail;
