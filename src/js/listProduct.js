
const url = 'http://localhost:4000';


const productList = document.querySelector('.main__product-list')
const cartList = document.querySelector('.cart-list');
const totalValue = document.getElementById('totalPrice');
const cartCount = document.querySelector('.count__product-cart');

window.addEventListener('DOMContentLoaded',()=>{
    getProductList({page:1,limit:10});
    addToCartList();
    sessionStorage.clear();
});


// get data  product list to API
const getProductList = async (payload) =>{
    try {
        const {page,limit,softPrice,categories} = payload;
        const response = await axios({
            method:'GET',
            url:`${url}/products`,
            params:{
                ...(page && {_page:page}),
                ...(limit && {_limit:limit}),
                ...(softPrice && {_sort:"price",_order:softPrice}),
                ...(categories && {category:categories}),
            }
           
        });
        const data = response.data;
        renderPagination(page);
        renderProductList(data);
        $("html, body").animate({ scrollTop: 225 }, "slow");
    } catch (error) {
       return error;
    }
}

// render product list to data in API

const renderProductList = (data) =>{
    productList.innerHTML = data.map((item, index) =>{
       return `
        <div  class="main__productOther">
            <div  class="main__productOther-inner"  data-id=${item.id}>
                <div class="main__productOther-img">
                    <img src="${item.img}" alt="product">
                </div>
            <div class="main__productOther-content">
                <p class="main__productOther-content-title">${item.title}</p>
                <div class="d-flex">
                    <ul class="d-flex align-items-center">
                        ${renderStar(item.star)}
                    </ul>
                    <span class="text-span font-italic pl-1">( ${item.reviews} đánh giá )</span>
                </div>
                <p class="text-span productOther-content-text text-clamp text-clamp--2">${item.description}</p>
                <p class="price "><span class="price-product">${(item.price).toLocaleString()}</span>
                <span class="pl-1">Đ</span>
                </p>
                <div class="main__product-btn d-flex justify-content-start">
                    <a class="btn btn-warning btn-add-cart " onclick="showSuccessToast()" >THÊM VÀO GIỎ HÀNG</a>
                    <a class="btn btn-dark" href="./detailProduct.html">XEM CHI TIẾT</a>
                </div>
            </div>
            </div>
        </div>
    `;
    }).join("");
}


// update cart info when info change
function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCount.textContent = cartInfo.productCount;
    totalValue.textContent = (cartInfo.total).toLocaleString();
}
updateCartInfo();


// push product info when click add product
productList.addEventListener('click',function pushProduct(e){
if(e.target.classList.contains('btn-add-cart')){
    let product = e.target.parentElement.parentElement.parentElement;
    getProductInfo(product);
    addToCartList();
    }
});


//get all the storage if there is any is the local storage
function getProductFromStorage(){
    return localStorage.getItem("productInCart") ? Object.values( JSON.parse(localStorage.getItem('productInCart'))) : [];
    //return empty array if there isn't any product info   
}

// get product info when click button add product
 function getProductInfo(product){
     let productInfo = {
         id: product.dataset.id,
         imgSrc:product.querySelector('.main__productOther-img img').src,
         name:product.querySelector('.main__productOther-content-title').textContent,
         price:parseFloat((product.querySelector('.price-product').textContent).replace('.','').replace('.','')),
        }
        productInfo.inCart = 0;
     amountProduct(productInfo);
}

 // render product from local add in to cart list
 function addToCartList(){
        let product = getProductFromStorage();
            cartList.innerHTML = product.map(item=>{
                return`
                <div data-id=${item.id} class="cart-item">
                    <img class="" src="${item.imgSrc}" alt="">
                    <div class="text-center">
                        <p class="m-0">${item.name}</p>
                        <p class="m-0">
                        <p>Số lượng ${item.inCart < 1 ? 1 : item.inCart}</p>
                        <span class="price">${(item.price * `${item.inCart < 1 ? 1 : item.inCart}`).toLocaleString() }</span>
                        </p>
                    </div>
                    <Button href="#" onclick="deleteProduct(event)" class="ml-2 btn btn-outline-danger remove-product">
                        <i class="far fa-times-circle"></i>
                    </Button>
                </div>
                `;
            }).join('');
}



// calculate total price of cart and other info
function findCartInfo(){

    let products = getProductFromStorage();
    let total = products.reduce((acc,product)=>{
        if(product.inCart < 1){
            product.inCart = 1
            
        }
        let price = parseFloat(product.price);
        return acc += price * product.inCart;
    },0)
    
    return{
        total : total,
        productCount : products.length
    }
}
// delete product in cart
function deleteProduct(e){
    let cartItem = e.target.parentElement.parentElement;
    console.log("deleteProduct -> cartItem", cartItem)
    let productInLocal = Object.values(JSON.parse(localStorage.getItem('productInCart')));
    let updateProduct = productInLocal.filter(item =>{
        return item.id != cartItem.dataset.id
    })
    localStorage.setItem('productInCart',JSON.stringify(updateProduct));
    addToCartList();
    updateCartInfo();
}

// add product in local and cart 
function amountProduct(product){
    let cartItem = JSON.parse(localStorage.getItem("productInCart"));
    if(cartItem){
        let findItem = cartItem.find(item => item.id == product.id )
        if(findItem){
            let indexItem = cartItem.findIndex(item => item.id == product.id )
            cartItem.splice(indexItem, 1,{...product, inCart: findItem.inCart+1} )
        }
        else{
            cartItem =[...cartItem, {...product, inCart:1}];
        }
    }
    else cartItem =[{...product, inCart:1}];
    localStorage.setItem("productInCart",JSON.stringify(cartItem));
    updateCartInfo();
}

// handle change value of product in cart

// render start
const renderStar = (rate) => {
    let star = ``;
    rate = parseInt(rate);
    if (Math.floor(rate) < 5) {
        for (var i = 0; i < Math.floor(rate); i++) star += ` <i class="fas fa-star"></i>`;

        for (var i = 0; i < 5 - Math.floor(rate); i++)
            if (i == 0) star += `<i class="fas fa-star-half-alt"></i>`;
            else star += `<i class="far fa-star"></i>`;
    }
    return star;
};

// handle change when click show
function handleOnchangeLimit(e){
    let changePrice = sessionStorage.getItem('change');
    changePrice ? changePrice : '';
    let changeCategories = sessionStorage.getItem('changeCategories');
    
    if(e.target.value ==5){
        getProductList({limit:5,page:1,softPrice:changePrice,categories:changeCategories})
        let change = 5;
        sessionStorage.setItem('changeLimit',change);
    }
    if(e.target.value ==10){
        getProductList({limit:10,page:1,softPrice:changePrice,categories:changeCategories})
        let change = 10;
        sessionStorage.setItem('changeLimit',change)
    }
}

// handle change when click soft
function handleOnchangeSoft(e){
    let changeLimit = parseInt(sessionStorage.getItem('changeLimit'));
    changeLimit && changeLimit;
    let changeCategories = sessionStorage.getItem('changeCategories');

    if(e.target.value =="desc"){
        getProductList({softPrice:"desc",page:1,limit:changeLimit,categories:changeCategories});
        let change = "desc";
        sessionStorage.setItem('change',change);
    }
    if(e.target.value =="asc"){
        getProductList({softPrice:"asc",page:1,limit:changeLimit,categories:changeCategories})
        let change = "asc";
        sessionStorage.setItem('change',change);
    }
    if(e.target.value =="default"){
        getProductList({page:1,limit:changeLimit,categories:changeCategories})
        let change = "";
        sessionStorage.setItem('change',change);
    }
}

// handle change when click categories 
function handleChangeCategories(e){
    console.log("handleChangeCategories -> e", e)
    let categories = e.target.parentElement.dataset.id;
    sessionStorage.setItem('changeCategories',categories);
    let changePrice = sessionStorage.getItem('change');
    changePrice ? changePrice : '';
    let changeLimit = parseInt(sessionStorage.getItem('changeLimit'));
    changeLimit && changeLimit;

    getProductList({categories:categories,page:1,limit:changeLimit,softPrice:changePrice})
}

// handle pagination multi level 
function renderPagination(currentPage) {
    let changeCategories = sessionStorage.getItem('changeCategories');
    let changePrice = sessionStorage.getItem('change');
    changePrice ? changePrice : '';
    let changeLimit = parseInt(sessionStorage.getItem('changeLimit'));
    if (!changeLimit){
        changeLimit = 10;
    }
    else{
        changeLimit = changeLimit;
    }
    let str = "";
    let data = 50;
    let pages = parseInt(data / changeLimit);
   
    for (let i = 1; i <= pages; i++) {

      str += `<li class="page-item${
        i === currentPage ? " active" : ""
      }"><button class="page-link" onclick="getProductList({page: ${i},limit:${changeLimit},categories:${changeCategories},softPrice:'${changePrice}'})">${i}</button></li>`;
    }

    let pagination = document.getElementById("pagination");
    pagination.innerHTML =
     `<ul class="pagination justify-content-end pagination-custom">
            <li onclick ="onscrollTop(event)" class="page-item${
                currentPage === 1 ? " disabled" : ""
            }"><button class="page-link" onclick="getProductList({page: ${currentPage - 1},limit:${changeLimit},categories:${changeCategories},softPrice:'${changePrice}'})">Trang trước</button></li>
            ${str}
            <li class="page-item${
                currentPage === pages ? " disabled" : ""
            }"><button class="page-link" onclick="getProductList({page:${pages},limit:${changeLimit},categories:${changeCategories},softPrice:'${changePrice}'})">Trang cuối</button></li>
        </ul>`;
}
function onscrollTop(e){
}