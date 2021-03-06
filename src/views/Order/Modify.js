import React, { Component } from 'react';
import { Button, Input, Card, CardBody, CardHeader, CardFooter, Col, Row, Table, InputGroup, InputGroupAddon } from 'reactstrap';
import ProductModal from '../Modal/ProductModal';
import Popup from "reactjs-popup";
import StockModal from '../Modal/StockModal';

let def = {id: '', name: '', quantity: 0, price: 0, tax: 0};
let dd = {id: '', name: '', plant: 0, stock:0, quantity: 0, price: 0, vos: 0, vat: 0, tax: 0, sum: 0};
let p = {id: '', name: ''};
let sl = {id: '', name: '', expiration: '', plantName: ''};


class OrderModify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockList: [[sl]],
      plantData: [[p]],
      product: [],
      data: {
        orderInfo: [{}],
        productInfo: [{}],
        name: '',
      }
    };
  }
  componentWillMount() {
    this.getData(this.props.match.params.id);
  }

  getFamilyId(id, i){
    fetch(process.env.REACT_APP_HOST+"/api/product/familyId/"+id, {
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
        if(status === 200){
          this.setState({productFamily: data[1][0].id})
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      });
  }


  getData(id) {
    fetch(process.env.REACT_APP_HOST+"/order/detail/"+id, {
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
      const status = data[0];
      if(status === 200) {
        // console.warn(data)
        data[1].productInfo.map((e,i) => {
          e['price_shipping'] = e['price'] / e['quantity'];
          this.getFamilyId(e.productId, i)
				})
				
				this.setState({data: data[1]});
				console.warn(data[1])
        document.getElementById("sample6_address").value = data[1].orderInfo[0].address;
        document.getElementById("sample6_detailAddress").value = data[1].orderInfo[0].addressDetail;
        document.getElementById("sample6_postcode").value = data[1].orderInfo[0].postcode;

      } else if(status === 401) {
        alert('로그인 하고 접근해주세요')
        this.props.history.push('/login')
      } else if(status === 400) {
        alert('존재하지 않는 주문입니다.');
        this.props.history.push('/main/sales/list')
      }
    });
  }

  sample6_execDaumPostcode() {
    new window.daum.Postcode({
      oncomplete: function(data) {
        var addr = ''; // 주소 변수
        var extraAddr = ''; // 참고항목 변수
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }
        if(data.userSelectedType === 'R'){
          if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
            extraAddr += data.bname;
          }
          if(data.buildingName !== '' && data.apartment === 'Y'){
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          if(extraAddr !== ''){
            extraAddr = ' (' + extraAddr + ')';
          }
          //document.getElementById("sample6_extraAddress").value = extraAddr;
          addr += extraAddr;
        } else {
          //document.getElementById("sample6_extraAddress").value = '';
        }
        document.getElementById('sample6_postcode').value = data.zonecode;
        document.getElementById("sample6_address").value = addr;
        document.getElementById("sample6_detailAddress").focus();
      }
    }).open();
  }

  getStock(productId, i) {
    fetch(process.env.REACT_APP_HOST+"/api/stock/product/"+productId, {
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
        if(status === 200){
          let {stockList, productInfo} = this.state;
          stockList[i] = data[1];
          productInfo[i].stock = data[1][0].id
          productInfo[i].plant = data[1][0].plant_id
          this.setState({stockList, productInfo})
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      });
  }

  numberWithCommas(x) {
    if(!x) {
      return 0;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  convertDateFormat(date) {
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  modifyOrder() {
    let {orderInfo, productInfo} = this.state.data;
		// console.warn(orderInfo)
    orderInfo[0].postcode = document.getElementById('sample6_postcode').value;
    orderInfo[0].address = document.getElementById('sample6_address').value;
    orderInfo[0].addressDetail = document.getElementById('sample6_detailAddress').value;
    fetch(process.env.REACT_APP_HOST+"/order/modify/"+this.props.match.params.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({orderInfo, productInfo})
    })
    .then(response => {
      if(response.status === 401) {
        return Promise.all([401])
      } else {
        return Promise.all([response.status, response.json()]);
      }
  })
    .then(data => {
      const status = data[0];
      if(status === 200) {
        this.props.history.push('/main/sales/order/'+this.props.match.params.id);
      } else if(status === 401) {
        alert('로그인 하고 접근해주세요')
        this.props.history.push('/login')
      } else if(status === 400) {
        alert('존재하지 않는 주문입니다.');
        this.props.history.push('/main/sales/list')
      }
    });
  }

  sample6_execDaumPostcode() {
    new window.daum.Postcode({
      oncomplete: function(data) {
        var addr = ''; // 주소 변수
        var extraAddr = ''; // 참고항목 변수
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }
        if(data.userSelectedType === 'R'){
          if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
            extraAddr += data.bname;
          }
          if(data.buildingName !== '' && data.apartment === 'Y'){
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          if(extraAddr !== ''){
            extraAddr = ' (' + extraAddr + ')';
          }
          //document.getElementById("sample6_extraAddress").value = extraAddr;
          addr += extraAddr;
        } else {
          //document.getElementById("sample6_extraAddress").value = '';
        }
        document.getElementById('sample6_postcode').value = data.zonecode;
        document.getElementById("sample6_address").value = addr;
        document.getElementById("sample6_detailAddress").focus();
      }
    }).open();
  }

  render() {
    let {orderInfo, productInfo} = this.state.data;
    orderInfo = orderInfo[0];
    var d = new Date(orderInfo['date']);
    var year = d.getFullYear(), month = d.getMonth()+1, date = d.getDate();
    return (
      <div className="animated fadeIn">
      <link rel="stylesheet" type="text/css" href="css/Table.css"></link>
      <link rel="stylesheet" type="text/css" href="css/OrderDetail.css"></link>
        <Row>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                {this.props.match.params.id}번 주문
              </CardHeader>
              <CardBody>
                <Table className="ShowTable">
                <tbody>
                  <tr>
                    <th>고객명</th>
                    <td>{orderInfo['name']}</td>
                    <th>일자</th>
                    <td className="TableRight">{year}년 {month}월 {date}일</td>
                  </tr>
                  <tr>
                    <th>전화번호</th>
                    <td>
                      <Input defaultValue={orderInfo['telephone']} type="tel" onChange={(e) => {orderInfo['telephone'] = e.target.value}} onBlur={(e) => {orderInfo['cellphone'] = e.target.value}}/>
                    </td>
                    <th>HP</th>
                    <td className="TableRight">
                      <Input defaultValue={orderInfo['cellphone']} type="tel" onChange={(e) => {orderInfo['cellphone'] = e.target.value}} onBlur={(e) => {orderInfo['cellphone'] = e.target.value}} />
                    </td>
                  </tr>
                  <tr className="TableBottom">
                    <th>배송지</th>
                    <td>
                      {/* <div style={{marginBottom: '10px', marginLeft: '5px', fontSize:'0.8em'}}>기존주소 ) {orderInfo['address']}</div> */}
                      {/* <Input defaultValue={orderInfo['address']} onChange={(e) => {orderInfo['address'] = e.target.value}} /> */}
                      <Row style={{marginBottom: '10px'}}>
                        <Col lg="6" md="6" sm="6">
                          <InputGroup required>
                            <Input type="text" id="sample6_postcode" placeholder="우편번호" defaultValue={orderInfo['postcode']} readOnly/>
                            <InputGroupAddon addonType="append">
                              <Button block color="primary" onClick={() => {this.sample6_execDaumPostcode()}}>우편번호찾기</Button>
                            </InputGroupAddon>
                          </InputGroup>
                        </Col>
                      </Row>
                      <Row style={{marginBottom: '10px'}}>
                        <Col>
                          <Input style={{'width':'70%'}} type="text" id="sample6_address" placeholder="주소" defaultValue={orderInfo['address']} readOnly/>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Input style={{'width':'70%'}} type="text" id="sample6_detailAddress" defaultValue={orderInfo['addressDetail']} placeholder="상세주소"/>
                        </Col>
                      </Row>
                    </td>
                    <th>요청사항</th>
                    <td className="TableRight">
                      <Input defaultValue={orderInfo['comment']} onChange={(e) => {orderInfo['comment'] = e.target.value}} />
                    </td>
                  </tr>
                </tbody>
                </Table>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
          <Card>
            <CardHeader>
              <Row>
                <Col>품목을 입력하세요</Col>
                <Col>
                  <div style={{float : "right"}}>
                    <Button block color="primary"
                      onClick={()=> {
                        let {productInfo} = this.state.data
                        // let {stockList} = this.state;
                        //기본 데이터 포맷을 state에 push
                        productInfo.push(dd);
                        // stockList.push([p]);
                        this.setState({
                          productInfo
                        })}}>
                      추가하기
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <div style={{overflowX : "auto", whiteSpace: "nowrap"}}>
                <Table>
                  <thead>
                    <tr>
                      <th>품목명</th>
                      <th>재고</th>
                      <th>수량</th>
                      <th>판매 단가</th>
                      <th>공급가액</th>
                      <th>부가세</th>
                      <th>과세</th>
                      <th>총액</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productInfo.map((e, i) => {
                      // console.warn(e)
                      return ( <tr key={i}>
                        <td>
                          {<Popup
                            trigger={<Input name='name' value={productInfo[i].name || ''} style={{cursor: 'pointer', backgroundColor: '#ffffff'}} onChange={() => console.log('S')} readOnly/>}
                            modal>
                            {close => <ProductModal index={i} close={close}
                                        selectProduct={(data) => {
                                          let sProduct = productInfo;

                                          let val = Object.assign({}, sProduct[i]);

                                          /* set, for instance, comment[1] to "some text"*/
                                          val['productId'] = data['id'];
                                          val['name'] = data['name'];
                                          val['price_shipping'] = data['price_shipping'];
                                          sProduct[i] = val;

                                          /* set the state to the new variable */
                                          let d = this.state.data;
                                          d.productInfo = sProduct;
                                          this.setState({data: d});
                                          this.getFamilyId(data['id'], i)
                                          // this.getStock(data['id'], i)
                                        }}/>}
                          </Popup>}
                        </td>
                        <td>
                          {<Popup
                            trigger={<Input require value={productInfo[i].stockName} style={{cursor: 'pointer', backgroundColor: '#ffffff'}} onChange={() => {console.log('S')}}/>}
                            modal>
                            {close => <StockModal close={close} login={()=>{this.props.history.push('/login')}} stockList={this.state.stockList} productId={e.productId}
                              selectStock={(data) => {
                                console.log(data);
                                let {productInfo} = this.state.data;
                                productInfo[i].stockId = data.id;
                                productInfo[i].stockName = data.name;
                                productInfo[i].plantName = data.plantName;
                                productInfo[i].expiration = data.expiration;
                                productInfo[i].plantId = data.plant_id;
                                let d = this.state.data;
                                d.productInfo = productInfo;
                                this.setState({
                                  data: d
                                });
                                // let {product_id, quantity} = data;
                                // this.setState({
                                //   product_id,
                                //   quantity_stock : quantity
                                // })
                              }}/>}
                          </Popup>}
                        </td>
                        <td>
                          <Input name='quantity' value={productInfo[i].quantity || 0} onChange={(e)=> {
                            let sProduct = productInfo;
                            sProduct[i].quantity > 0 ? sProduct[i].quantity = e.target.value :  sProduct[i].quantity= Math.abs(e.target.value);
                            this.setState({productInfo: sProduct})}}
                        />
                        </td>
                        <td>{this.numberWithCommas(e['price_shipping'])}</td>
                        <td>{this.numberWithCommas(Math.round(e['tax'] ? e['price_shipping'] * e['quantity'] * 10 / 11 : e['price_shipping'] * e['quantity']))}</td>
                        <td>{this.numberWithCommas(Math.round(e['tax'] ? e['price_shipping'] * e['quantity'] * 1 / 11 : 0))}</td>
                        <td><Input name='tax' type='checkbox' defaultChecked={e.tax} onClick={() => {
                          let sProduct = productInfo;
                          sProduct[i].tax = !sProduct[i].tax;
                          this.setState({productInfo: sProduct})}}
                          />
                        </td>
                        <td>{this.numberWithCommas(e['price'] = e['price_shipping'] * e['quantity'])}</td>
                        <td>
                          <Button block color="danger"
                            onClick={()=> {
                              let sProduct = productInfo;
                              sProduct.splice(i, 1);
                              this.setState({
                                productInfo: sProduct
                              })
                            }}>
                            X
                          </Button>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
          </Col>
        </Row>
        <Button block color="primary" onClick={() => {
          this.modifyOrder();
        }}>주문 수정하기</Button>

      </div>
    )
  }
}

export default OrderModify;
