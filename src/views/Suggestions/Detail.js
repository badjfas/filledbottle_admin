import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, Col, Row, FormGroup, Badge, Table} from 'reactstrap';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.form = {
    }
    this.state = {
      data: [{}]
    };
  }

  componentWillMount() {
    this.getSuggestion();
  }

  getDate(dateInput) {
    var d = new Date(dateInput);
    var year = d.getFullYear(), month = d.getMonth()+1, date = d.getDate();

    return year + "년 " + month + "월 " + date + "일";
  }

  getSuggestion() {
    fetch(process.env.REACT_APP_HOST+"/api/suggestion/detail/"+this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
    .then(response => {
      if(response.status === 401) {
        return Promise.all([401])
      } else {
        return Promise.all([response.status, response.json()]);
      }
    })
    .then(data => {
      let status = data[0];
      if(status === 200)
        this.setState({data: data[1]});
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    })
  }

  render() {
    const data = this.state.data[0];
    return (
      <div className="animated fadeIn">
        <link rel="stylesheet" type="text/css" href="css/Table.css"></link>
        <link rel="stylesheet" type="text/css" href="css/SuggestionsDetail.css"></link>
        <Row className="mb-5">
          <Col md="12" xs="12" sm="12">
            <form>
              <FormGroup>
                <Card>
                  <CardHeader>
                    건의내용
                  </CardHeader>
                  <CardBody>
                    <Table className="ShowTable">
                        <tbody>
                            <tr>
                                <th>제목</th>
                                <td colSpan="3">{data.title}</td>
                            </tr>
                            <tr className="TableBottom">
                                <th>답변 처리 현황</th>
                                <td>{data.answer !== null ? <Badge color="success">답변 완료</Badge> : <Badge color="secondary">답변 준비중</Badge>}</td>
                                <th>등록일</th>
                                <td>{this.getDate(data.created_date)}</td>
                            </tr>
                            <tr className="TableBottom">
                              <td colSpan="4">
                                <pre>
                                  {data.content}
                                </pre>
                                {data.answer !== null ? <Card style={{marginTop: "50px"}}>
                                  <CardHeader>ㄴ A. 답변</CardHeader>
                                  <CardBody>
                                    <pre>{data.answer}</pre>
                                    
                                  </CardBody>
                                </Card> : null}
                              </td>                                
                            </tr>
                        </tbody>
                    </Table>
                    <Table className="ShowTable">
                        <tbody>
                            
                        </tbody>
                    </Table>
                  </CardBody>
                  <CardFooter>
                    <Button block outline color="primary" onClick={()=> {this.props.history.push('/main/suggestions')}}>뒤로가기</Button>
                  </CardFooter>
                </Card>
              </FormGroup>
            </form>
          </Col>
        </Row>
      </div>
    )

  }
}

export default Detail;

