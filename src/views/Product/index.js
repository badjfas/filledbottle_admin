import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { pageFunction, searchFunction, productFunction } from '../../action';
import Lists from './Lists';
//import Lists from './List copy';

function mapStateToProps(state) {
  const { pageNumbers, keyword, keywordP } = state.search;
  const { category, family, show, stateP } = state.product;
  return {
    pageNumbers,
    keyword,
    keywordP,
    category,
    family,
		show,
		stateP,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    clickConvertPage: bindActionCreators(pageFunction.clickConvertPage, dispatch),
    searchKeyword: bindActionCreators(searchFunction.searchKeyword, dispatch),
    searchKeywordP: bindActionCreators(searchFunction.searchKeywordP, dispatch),
    checkCategoryId: bindActionCreators(productFunction.checkCategoryId, dispatch),
    checkFamily: bindActionCreators(productFunction.checkFamily, dispatch),
    changeShow: bindActionCreators(productFunction.changeShow, dispatch),
    changeStateP: bindActionCreators(productFunction.changeStateP, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lists);