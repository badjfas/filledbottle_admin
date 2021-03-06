//page
const convert = 'convert' ;


function clickConvertPage(e) {
    return {
        type : convert,
        payload : e
    }
}

//search
const search = 'search'


function searchKeyword(e) {
    return {
        type : search,
        payload : e
    }
}

const searchC = 'searchC'


function searchKeywordC(e) {
    return {
        type : searchC,
        payload : e
    }
}

const searchP = 'searchP'


function searchKeywordP(e) {
    return {
        type : searchP,
        payload : e
    }
}

const searchS = 'searchS'


function searchKeywordS(e) {
    return {
        type : searchS,
        payload : e
    }
}

//product
const category = 'category'

function checkCategoryId(e) {
    return {
        type : category,
        payload : e,
    }
}

const family = 'family'

function checkFamily(e) {
    return {
        type : family,
        payload : e,
    }
}

const show = 'show'

function changeShow() {
    return {
        type : show
    }
}

const stateP = 'stateP'

function changeStateP(e) {
    return {
        type : stateP,
        payload: e
    }
}

//stock

const plant = 'plant'

function checkPlant(e) {
    return {
        type : plant,
        payload : e
    }
}

//order_export
const pagination = {
    convert,
}

const searchPage = {
    search,
    searchC,
    searchP,
    searchS,
}

const product = {
    category,
    family,
    show,
    stateP
}

const stock = {
    plant
}

const pageFunction = {
    clickConvertPage,
}

const searchFunction = {
    searchKeyword,
    searchKeywordC,
    searchKeywordP,
    searchKeywordS,
}

const productFunction = {
    checkCategoryId,
    checkFamily,
    changeShow,
    changeStateP,
}

const stockFunction = {
    checkPlant
}

export { pagination, searchPage, product, stock }
export { searchFunction, pageFunction, productFunction, stockFunction }