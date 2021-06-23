
//if stay page intoCart, display none cart
var x = location.href;
    let cartContainer = document.querySelector('.cart-container')
    if(x = "http://localhost:3000/intoCart.html"){
        cartContainer.style.display = 'none'
    }

// if product in local empty, go to page error
let checkProductInLocal = JSON.parse(localStorage.getItem('productInCart'));
if(checkProductInLocal ==null){
  window.location.href=`http://localhost:3000/error.html`;
}

const infoTable = document.getElementById('cart-shopping-body')

// render infoCart
function renderInfoCart(){
    let product = JSON.parse(localStorage.getItem('productInCart'));
    infoTable.innerHTML = product.map((item,index)=>{
        return `
        <tr data-id=${item.id} class="text-center">
            <th class="align-middle" scope="row">${index +1}</th>
            <td><img class="w-50" src=${item.imgSrc} alt="product"></td>
            <td class="align-middle">${item.name}</td>
            <td class="align-middle">${(item.price).toLocaleString()}</td>
            <td class="w-25 align-middle">${item.inCart < 1 ? 1 : item.inCart}
            </td>
            <td class="align-middle">${(item.price * `${item.inCart < 1 ? 1 : item.inCart}`).toLocaleString()}</td>
        </tr> 
        `;
    }).join('');
}
renderInfoCart();

//update info cart total,discount,and price
function updateCartInfo(){
    let totalValue = document.querySelector('#shopping-cart-total');
    let discount = document.querySelector('#shopping-cart-tax');
    let payment = document.querySelector('#shopping-cart-pay')
    let cartInfo = findCartInfo();
    totalValue.textContent =(cartInfo.total).toLocaleString();
    discount.textContent = (cartInfo.total * 10 /100).toLocaleString();
    payment.textContent = (parseInt(cartInfo.total) + parseInt(cartInfo.total * 10 /100)).toLocaleString();
    
}
updateCartInfo();

// load info total price
function findCartInfo(){

    let products = JSON.parse(localStorage.getItem('productInCart'));
    let total = products.reduce((acc,product)=>{
        if(product.inCart < 1){
            product.inCart = 1
        }
        let price = parseFloat(product.price);
        return acc += price * product.inCart;
    },0)
    console.log("findCartInfo -> total", total)
    localStorage.setItem('total',JSON.stringify(total));
    return{
        total : total,
        productCount : products.length
    }
}