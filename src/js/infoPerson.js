
//if stay page infoPerson, display none cart
var x = location.href;
let cartContainer = document.querySelector('.cart-container')
console.log("cartContainer", cartContainer)
if(x = "http://localhost:3000/infoPerson.html"){
    cartContainer.style.display = 'none'
}

//if product in local empty, to page error
let checkProductInLocal = JSON.parse(localStorage.getItem('productInCart'));
if(checkProductInLocal ==null){
  window.location.href=`http://localhost:3000/error.html`;
}


const url = 'http://localhost:4000';
const today = new Date();
const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

// create payments
const createPayment = async(payload)=>{
  try {
    const response = await axios({
        method: 'post',
        url: 'http://localhost:4000/payments',
        data: payload,
    })
    window.location.href=`http://localhost:3000/payment.html`;
  } catch (error) {
    return error
  }
}

//get info payment when click button Thanh Toán
const getProductList = async () =>{
  try {
      const response = await axios({
          method:'GET',
          url:"http://localhost:4000/payments",
         
      });
      const data = response.data;
      sessionStorage.setItem('id',JSON.stringify(data.length +1));
  } catch (error) {
     return error;
  }
}
getProductList()


// handle validator
function Validator(option) {
    
    
      function getParentElement(element,selector){

             while(element.parentElement){
               if(element.parentElement.matches(selector)){
                 return element.parentElement
               }
               element = element.parentElement
             } 
      
      }
    
      var selectorRules = {};
      // ham thuc hien validate
      function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = getParentElement(inputElement,option.formSelector).querySelector(option.errorSelector)
    
        //lay ra cac rules của selector
        var rules = selectorRules[rule.selector];
    
        //lặp qua từng rule và kiểm tra
        // nếu có lỗi, thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; i++) {
          errorMessage = rules[i](inputElement.value)
          if (errorMessage) break;
        }
        if (errorMessage) {
          errorElement.innerText = errorMessage
          getParentElement(inputElement,option.formSelector).classList.add('invalid')
        } else {
          errorElement.innerText = ''
          getParentElement(inputElement,option.formSelector).classList.remove('invalid')
    
        }
        return !errorMessage;
      }
    
      // lay element của form van validate
      var formElement = document.querySelector(option.form)
     
      if (formElement) {
        formElement.onsubmit = function(e){
          e.preventDefault();
    
            var isFormValid = true;
            // lặp qua từng rule và validate
            option.rules.forEach(function(rule){
              var inputElement = formElement.querySelector(rule.selector)
              var isValid =  validate(inputElement, rule);
              if(!isValid){
                isFormValid = false;
              }
            });
           
            if(isFormValid){
              //  Trường hợp submit với javascrpit
                if(typeof option.onSubmit === 'function'){
                  var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
                  var radioValue = formElement.querySelectorAll('[name="payMethod"]')
                  var valueRadio = '';
                  for( var i = 0;i<radioValue.length ; i++){
                    if(radioValue[i].checked == true){
                      valueRadio = radioValue[i].value
                      console.log("Validator -> valueRadio", valueRadio)
                    }
                  }
                 
                  var formValue = Array.from(enableInputs).reduce(function(values,input){
                    (values[input.name] = input.value)
                      return  values
                  },{})
                  formValue.payMethod = valueRadio;
                  formValue.date = date;
                  option.onSubmit(formValue)
                  let product = JSON.parse(localStorage.getItem('productInCart'));
                  product = {formValue,product}
                  createPayment(product);
                }

            }
        }
        //lặp qua mỗi rule và xử lý 
        option.rules.forEach(function (rule) {
    
          // lưu lại các rules cho moi input
          if (Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule.test)
          } else {
            selectorRules[rule.selector] = [rule.test]
          }
          var inputElement = formElement.querySelector(rule.selector)
          if (inputElement) {
            //xử lý trường hợp blur ra ngoài
            inputElement.onblur = function () {
              validate(inputElement, rule);
            }
            // xử lý mỗi khi người dùng nhập vào input
            inputElement.oninput = function () {
              var errorElement = getParentElement(inputElement,option.formSelector).querySelector('.form-message')
              errorElement.innerText = ''
              getParentElement(inputElement,option.formSelector).classList.remove('invalid')
            }
          }
        })
      }
    
    }
    
    
    Validator.isRequired = function (selector, message) {
      return {
        selector: selector,
        test: function (value) {
          return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
      }
    }
    Validator.isEmail = function (selector, message) {
      return {
        selector: selector,
        test: function (value) {
          var regex =  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
          return regex.test(value) ? undefined : message || 'Email không hợp lệ !'
        }
      }
    }
    Validator.isPhone = function (selector, message) {
        return {
          selector: selector,
          test: function (value) {
            var regex = /((09|03|07|08|05)+([0-9]{8})\b)/g
            return regex.test(value) ? undefined : message || 'Số điện thoại không hợp lệ !'
          }
        }
      }
      Validator.isName = function (selector, message) {
        return {
          selector: selector,
          test: function (value) {
            var regex = /[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u;
            return regex.test(value) ? undefined : message || 'Tên không hợp lệ !'
          }
        }
      }
  