
var x = location.href;
let cartContainer = document.querySelector('.cart-container')
if(x = "http://localhost:3000/payment.html"){
    cartContainer.style.display = 'none'
}
let checkProductInLocal = JSON.parse(localStorage.getItem('productInCart'));
if(checkProductInLocal ==null){
  window.location.href=`http://localhost:3000/error.html`;
}

const name = document.getElementById('person-name');
const email = document.getElementById('person-email');
const address = document.getElementById('person-address');
const note = document.getElementById('bill-note');
const paymentMethod = document.getElementById('bill-paymethod');
const date = document.getElementById('bill-date');
const cartId = document.getElementById('bill-id');
window.addEventListener('DOMContentLoaded',()=>{
    getProductList();
    renderInfoPerson();
    localStorage.clear();
});
const getProductList = async () =>{
    try {
        let id = JSON.parse(sessionStorage.getItem('id'))
        const response = await axios({
            method:'GET',
            url:`http://localhost:4000/payments?id=${id}`,
           
        });
        const data = response.data;
        renderInfoPerson(data);
        localStorage.removeItem('productInCart');
    } catch (error) {
       return error;
    }
}


function renderInfoPerson(data) {
    if(data){
        let info = data[0].formValue
        cartId.textContent = data[0].id
        name.textContent = info.name
        email.textContent = info.email
        address.textContent = info.address
        note.textContent = `${info.note.trim() == '' ? 'Không có chú thích' : info.note}`
        paymentMethod.textContent = info.payMethod
        date.textContent = info.date

        let product = data[0].product;
        const infoTable = document.getElementById('cart-shopping-body')
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
}

function updateCartInfo(){
    let totalValue = document.querySelector('#shopping-cart-total');
    let discount = document.querySelector('#shopping-cart-tax');
    let payment = document.querySelector('#shopping-cart-pay')
    let total = parseFloat(JSON.parse(localStorage.getItem('total')));
    totalValue.textContent =total.toLocaleString();
    discount.textContent = (total * 10 /100).toLocaleString();
    payment.textContent = (parseInt(total) + parseInt(total * 10 /100)).toLocaleString();
    
}
updateCartInfo();

