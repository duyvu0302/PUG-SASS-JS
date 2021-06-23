
// function validate(selector){
//   function getParentEl(element,selector){
//     while(element.parentElement){
//       if(element.parentElement.matches(selector)){
//         return element.parentElement
//       }
//       else{
//         element = element.parentElement;
//       }
//     }
//   }
//   let formRules = {};
//   let validateRules = {
//     required: function (value){
//       return value? undefined : 'Vui lòng nhập trường này';
//     },
//     name: function(value){
//       let regexName = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/
//       return regexName.test(value) ? undefined : 'Tên không hợp lệ !';
//     },
//     email: function (value){
//       let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//       return  regex.test(value) ? undefined : 'Email không hợp lệ !';
//     },
//     phone: function (value){
//       let regexPhone = /((09|03|07|08|05)+([0-9]{8})\b)/g;
//       return regexPhone.test(value) ? undefined : 'Số điện thoại không hợp lệ !';
//     },
//     min: function (min){
//       return function(value){
//         return value.length >=min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự !`; 
//       }
//     }
    
//   }
//   let formElement = document.querySelector(selector);
//   let inputs = formElement.querySelectorAll("[name][rules]");

//   for(var input of inputs){

//       let rules = input.getAttribute('rules').split('|');
//       for(rule of rules){
//         if(rule.includes(':')){
//           let ruleInfo = rule.split(':');
//           rule = ruleInfo[0];
//         }
//         if(Array.isArray(formRules[input.name])){
//           formRules[input.name].push(validateRules[rule])
//         }
//         else{
//           formRules[input.name] = [validateRules[rule]]
//         }
//       }
//       input.onblur = handleValidate;
//       input.oninput = handleClearValidate;
//     }
//     function handleValidate(event){
//          let rules = formRules[event.target.name];
//          let errorMessage
//            rules.find(function (rule){
//             errorMessage =  rule(event.target.value);
//             return errorMessage;
//           })
//           if(errorMessage){
//             let formEle = getParentEl(event.target,'.form-group')
//             if(formEle){
//               formEle.querySelector('input').classList.add('invalid')
//               let formMessage = formEle.querySelector('.message-error')
//               if(formMessage){
//                 formMessage.innerText = errorMessage; 
//               }
//             }
//           }
//     }
//     function handleClearValidate(event){
//       let formEle = getParentEl(event.target,'.form-group')
//       if(formEle.classList.contains('invalid')){
//         formEle.querySelector('input').classList.remove('invalid')
//         let formMessage = formEle.querySelector('.message-error')
//           if(formMessage){
//             formMessage.innerText = ''; 
//           }
//       }
//     }

// }