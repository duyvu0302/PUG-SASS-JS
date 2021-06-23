
window.addEventListener('DOMContentLoaded',()=>{
    let productInLocal = JSON.parse(localStorage.getItem('productInCart'));
    if(!productInLocal || !productInLocal.length){
        document.querySelector('.cart__buy-inner').style.display = 'none';
        document.querySelector('.shopping-empty').style.display = 'block';
        document.querySelector('.cart__content').style.display = 'none';
    }
    var x = location.href;
    let cartContainer = document.querySelector('.cart-container')
    console.log("cartContainer", cartContainer)
    if(x = "http://localhost:3000/shoppingCart.html"){
        cartContainer.style.display = 'none'
    }
   
});

const itemTable = document.querySelector('.item-table');

const renderShoppingCart = ()=>{
    let product = JSON.parse(localStorage.getItem('productInCart'));
    if(product !=null){
        document.querySelector('.cart__buy-inner').style.display = 'block';
        let productCart = Object.values(product);
        if(productCart !=null){
            itemTable.innerHTML = productCart.map((item,index) =>{
                    return `
                    <tr data-id=${item.id} class="text-center">
                        <th class="align-middle" scope="row">${index +1}</th>
                        <td><img class="w-50" src=${item.imgSrc} alt="product"></td>
                        <td class="align-middle">${item.name}</td>
                        <td class="align-middle">${(item.price).toLocaleString()}</td>
                        <td class="align-middle">
                        <input class="w-25 m-auto form-control text-center" onchange="changeValue(event)" type="number" min="1" value=${item.inCart < 1 ? 1 : item.inCart }>
                        </td>
                        <td class="align-middle">${(item.price * `${item.inCart < 1 ? 1 : item.inCart}`).toLocaleString()}</td>
                        <td class="align-middle">
                        <a href="#deleteModal" data-toggle="modal"> 
                            <i class="text-danger fas fa-times"></i>
                        </a>
                        <div class="modal" id="deleteModal">
                            <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-body">
                                Bạn có muốn xoá sản phẩm này ra khỏi giỏ hàng không ?
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn rounded-0 btn-success delete-shoppingCart" onclick = "deleteShoppingCart(event) " data-dismiss="modal">OK</button>
                                    <button type="button" class="btn rounded-0 btn-danger "  data-dismiss="modal">CANCER</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </td>
                        </tr> 
                    `;
                }).join('');
        }
    }
}
renderShoppingCart();

// delete shopping product cart

function updateCartInfo(){
    let totalValue = document.querySelector('.total-shopping-cart');
    let discount = document.querySelector('.discount-shopping-cart');
    let payment = document.querySelector('.payment-shopping-cart')
    let cartInfo = findCartInfo();
    totalValue.textContent =(cartInfo.total).toLocaleString();
    discount.textContent = (cartInfo.total * 10 /100).toLocaleString();
    payment.textContent = (parseInt(cartInfo.total) + parseInt(cartInfo.total * 10 /100)).toLocaleString();
    
}
updateCartInfo();

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
function deleteShoppingCart(e){
    toast({
    title: "Thành công",
    message: "Bạn đã xoá sản phẩm trong giỏ hàng!",
    type: "success",
    duration: 2000
});
    let product = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    product.remove();
    let productInLocal = Object.values(JSON.parse(localStorage.getItem('productInCart')));
    let updateProduct = productInLocal.filter(item =>{
        return item.id != product.dataset.id
    })
    localStorage.setItem('productInCart',JSON.stringify(updateProduct));
    if(!updateProduct.length){
        document.querySelector('.cart__buy-inner').style.display = 'none';
        document.querySelector('.shopping-empty').style.display = 'block';
        document.querySelector('.cart__content').style.display = 'none';

    }
    $(".count__product-cart").html(`${updateProduct.length}`);
    updateCartInfo();

}
function getProductFromStorage(){
    return localStorage.getItem("productInCart") ? Object.values( JSON.parse(localStorage.getItem('productInCart'))) : [];
    //return empty array if there isn't any product info   
}
function changeValue(e){
    if(e){
        let idValue = e.target.parentElement.parentElement;
        let valueInput = e.target.value;
        let product = getProductFromStorage();
        let findId = product.findIndex((item) => item.id ==idValue.dataset.id)
        
        let productInner = product.filter(item =>{
            return idValue.dataset.id == item.id;
        })
        // productInner[0].inCart = parseInt(valueInput);    
        product.splice(findId, 1,{...productInner[0], inCart: parseInt(valueInput)})

        localStorage.setItem("productInCart",JSON.stringify(product));
        renderShoppingCart();
        updateCartInfo();

    }
}