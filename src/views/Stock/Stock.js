import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Input, Pagination, PaginationItem, PaginationLink, CardFooter, InputGroupAddon, InputGroup } from 'reactstrap';
import Popup from "reactjs-popup";
import DatePicker from "react-datepicker";

const listCount = 15;

class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
			stockData: [],
			plantData: [],
			familyData: [],
			page: 1,
			family: 0,
			name: '',
      //plant: 0,
      checkCategory: true,
    };
  }

  componentWillMount() {
    this.getPlant();
    this.getFamily();
	}

  getFamily() {//취급 품목 불러오기
    // fetch(process.env.REACT_APP_HOST+"/api/product/familyInPlant/"+this.props.plant, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': 'Bearer ' + localStorage.getItem('token'),
    //   },
    // })
    // .then(response => {
    //   if(response.status === 401) {
    //     return Promise.all([401])
    //   } else {
    //     return Promise.all([response.status, response.json()]);
    //   }
    // })
    // .then(data => {
		// 	let status = data[0];
    //   if(status === 200){
		// 		this.setState({familyData: data[1]}, () => {
		// 			this.getStock();
		// 		});
		// 	}
    //   else {
    //     alert('로그인 하고 접근해주세요');
    //     this.props.history.push('/login');
    //   }
    // });
    fetch(process.env.REACT_APP_HOST + "/api/product/familyList/0", {
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
        if (status === 200){
          this.setState({ familyData: data[1] }, () => {
						this.getStock();
					});
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      })
	}

  getStock() {
    const name = this.props.keywordS;
		const { familyData} = this.state;
    const { pageNumbers, family, plant } = this.props;
    fetch(process.env.REACT_APP_HOST+"/api/stock/list", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          plant, pageNumbers, family, name
        }
      )
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
        this.setState({stockData: data[1]});
        this.getTotal();
      }
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    });
  }

  getTotal() {
    const name = this.props.keywordS;
    const { family, plant } = this.props

    fetch(process.env.REACT_APP_HOST + "/api/stock/list/total/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          name, family, plant
        }
      )
    })  
      .then(response => {
        if (response.status === 401) {
          return Promise.all([401])
        } else {
          return Promise.all([response.status, response.json()]);
        }
      })
      .then(data => {
        const status = data[0];
        if (status === 200) {
          this.setState({ lastPage: Math.ceil(data[1][0].total / listCount), totalData: data[1][0].total })
        } else {
          alert('로그인 하고 접근해주세요')
          this.props.history.push('/login')
        }
      });
  }

	getPlant(){
    fetch(process.env.REACT_APP_HOST+"/api/plant", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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
        if(data[1].length !== 0) {
          this.props.checkPlant(data[1][0].id)
          this.setState({ plantData: data[1],
            /*plant: data[1][0].id*/ }, () => {
            });
        } else {
          this.setState({ checkCategory: false })
        }
				/*this.setState({plantData: data[1], plant: data[1][0].id});
				this.getFamily();*/
			}
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    });
  }
  
  searchProduct() {
    this.getStock();
  }

	changePlant(id) {
		this.setState({
			//plant: id,
			//page: 1,
			//family: 0,
		}, () => {
      this.getStock();
		})
  }

  countPageNumber(x) {
    this.setState({
      page: x,
    }, () => {
    });
	}

	changeFamily (family) {
    //let keyword = this.keyword
    this.setState({ family }, () => {
			this.getStock();
    })
  }

  getDate(dateInput) {
    var d = new Date(dateInput);
    var year = d.getFullYear(), month = d.getMonth() + 1, date = d.getDate();

    return year + "년 " + month + "월 " + date + "일";
  }

  resetInput() {
    var reset_input = document.getElementsByClassName('searchbox-input')
    for(var i = 0; i < reset_input.length; i++) {
      reset_input[i].value = null;
      console.log(i);
    }
  }

  getDiffDate(dateInput) {
    var d = new Date(dateInput);
    var todayDate = new Date();
    var diffDate = Math.ceil((d.getTime()-todayDate.getTime())/(1000*3600*24));
    var textDate = '';
    if (diffDate > 0) textDate = diffDate + " 일 남음"
    else textDate = Math.abs(diffDate) + " 일 지남";
    return textDate;
  }

  render() {
    let {stockData, plantData, familyData} = this.state;
    var {family, pageNumbers} = this.props;
    const arr = [-2, -1, 0, 1, 2];
    const arr1 = [];
    return (
      <div className="animated fadeIn">
      <link rel="stylesheet" type="text/css" href="css/Stock.css"></link>
      <link rel="stylesheet" type="text/css" href="css/Table.css"></link>
      <link rel="stylesheet" type="text/css" href="css/ListCopy.css"></link>

        <Row>
          <Col md="12" xs="12" sm="12">
						<Table className="category-top">
              <tbody>
                <tr>
                  {/*<td style={{cursor: "pointer", backgroundColor: this.state.plant==='all' ? '#E6E6E6' : '#fff'}} onClick={() => {this.changePlant('all')}}>전체</td>*/}
                  { this. state.checkCategory ?
                    plantData.map((e,i) => {
                      return (
                        <td key={i} className='list-plant' style={{backgroundColor: this.props.plant===e.id ? '#E6E6E6' : '#fff'}} onClick={() => {this.changePlant(this.props.checkPlant(e.id))}}>{e.name}</td>
                      )
                    })
                    :
                    <div style={{textAlign: "left", padding: 30}}>
                      <div style={{ display: "table-cell" }}>
                        <i style={{ marginRight: 10 }} class="fa fa-exclamation-circle"></i>
                      </div>
                      <div style={{ display: "table-cell" }}>
                        현재 창고가 존재하지 않습니다. <br></br>
                        ( 우측상단의 회원정보 또는 창고 추가하기 버튼을 통해 설정이 가능합니다. )
                      </div>
                      <div style={{ display: "table-cell", paddingLeft: 50, verticalAlign: "middle"}}>
                        <Button color="primary" onClick={() => { this.props.history.push('/main/registerdetail') }}>창고 추가하기</Button>
                      </div>
                    </div>
                  }
                </tr>
              </tbody>
            </Table>
            <div className="search-box">
              <div className="search-list">
                <label className="search-label">품목군</label>
                <div className="sell-input">
                  {familyData.map((e, i) => {
                      return <label className="search-input-label"><input onChange = {() => {this.setState({family: this.props.checkFamily(e.id)}); console.log(this.state.family)}} className="search-input-checkbox" name="family" type="radio"/>{e.name}</label>
                    })
                  }
                  {/* payload를 문자열로 받아옴 */}
                  {/* <Input onChange={(e) => {
                    this.setState({family : this.props.checkFamily(e.target.value)});
                    console.log(this.state.family)
                  }} type='select' name="family">
                    {familyData.map((e, i) => {
                      return <option key={i} value={e.id}>{e.name}</option>
                    })}
                  </Input> */}
                  {/* <select>
                    {
                      familyData.map((e, i) => {
                        return <option key={i} className="list-productfamily" onClick = {() => {this.changeFamily(this.props.checkFamily(e.id));console.log(this.props.family)}}>{e.name}</option>
                      })
                    }
                  </select> */}
                </div>
              </div>
              <div className="search-list">
                <label className="search-label">품목명</label>
                <div className="sell-input">
                  <Input className="searchbox-input" style={{width: "30%"}} placeholder="품목명을 검색해주세요." onChange={(e) => { this.props.searchKeywordS(e.target.value) }} />
                </div>
              </div>
              <div className="search-button" style={{textAlign: 'center', paddingBottom: "10px"}}>
								<Button color="primary" style={{marginRight: 10}} onClick={()=> {this.searchProduct(); this.changeFamily(this.state.family)}} >검색</Button>
								<Button color="ghost-primary" onClick={() => { this.props.searchKeywordS(''); this.resetInput(); }}>초기화</Button>
							</div>
            </div>

            <div className="list-card">
              <div className="list-title">
              <span>
                재고목록 (총 <span style={{color: "#1B8EB7"}}>{this.state.totalData}</span> 개)
              </span>
            </div>
              <div className="list-box" style={{marginTop: 20}}>
                <div style={{float: "right", marginBottom: 20}}>
                  <Button color="primary" onClick={() => { this.props.history.push('/stock/create') }}>재고 등록</Button>
                  {/*<Button color="primary" style={{ marginLeft: 10 }} onClick={() => { this.props.history.push('/stock/product/'+ this.props.plant) }}>품목 관리</Button>*/}
                  <Button color="primary" style={{ marginLeft: 10 }} onClick={() => {
                    this.props.history.push({
                    pathname: '/stock/edit/'+this.props.plant,
                    })}}>재고 실사</Button>
                  {/* <Button color="primary" style={{ marginLeft: 10 }} onClick={() => { this.props.history.push('/stock/transport') }}>창고 이동</Button> */}
                </div>
                <Table className="ListTable" hover>
                  <thead>
                    <tr>
                      <th style={{ width: 150 }} className="list-hidden">사진</th>
                      <th>제품명</th>
                      <th>구분</th>
                      <th>유통기한</th>
                      <th>창고</th>
                      <th>현 재고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockData.map((d) => {
                      return (
                        <tr onClick={() => {this.props.history.push(`/main/manage/stock/${d.id}`)}} style={{cursor: 'pointer'}} key={d.id}>
                          <td className="list-hidden">
                            <img style={{ width: '90%' }} alt="품목 사진" src={d.file_name ? process.env.REACT_APP_HOST+"/static/" + d.file_name : '318x180.svg'} />
                          </td>
                          <td>{d.productName}</td>
                          <td>{d.name}</td>
                          <td>
                            {this.getDate(d.expiration)}<br/>
                            <p>({this.getDiffDate(d.expiration)})</p>
                          </td>
                          <td>{d.plantName}</td>
                          <td>{d.quantity}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
              <div style={{width: "100%", textAlign : "center"}}>{this.state.stockData.length === 0 ? <span >"현재 재고 목록이 없습니다."</span> : null}</div>
              <hr></hr>
							<Pagination style={{justifyContent: 'center'}}>
								{pageNumbers === 1 ? '' :
								<PaginationItem>
									<PaginationLink previous onClick={() => {this.countPageNumber(this.props.clickConvertPage(pageNumbers-1))}}/>
								</PaginationItem>
								}
								{pageNumbers === 1 ? arr.forEach(x => arr1.push(x+2)) : null}
								{pageNumbers === 2 ? arr.forEach(x => arr1.push(x+1)) : null}
								{pageNumbers !== 1 && pageNumbers!== 2 ? arr.forEach(x => arr1.push(x)) :null }
								{arr1.map((e, i) => {
									if(this.state.lastPage >= pageNumbers+e)
									return (<PaginationItem key={i} active={pageNumbers === pageNumbers+e}>
										<PaginationLink onClick={() => {this.countPageNumber(this.props.clickConvertPage(pageNumbers+e));}}>
										{pageNumbers+e}
										</PaginationLink>
									</PaginationItem>)
									return null;
								})}
								{pageNumbers === this.state.lastPage ? '' :
								<PaginationItem>
									<PaginationLink next onClick={() => {this.countPageNumber(this.props.clickConvertPage(pageNumbers+1))}}/>
								</PaginationItem>}
							</Pagination>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Stock;
