const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const ProductDOM = $('.ProductDOM');
const cartBtn = $('.cart-btn');
const cartDOM = $('.cart-dom');
const clearBtn = $('.clear-btn');
const cartContent = $('.cart-content');


const start =() =>{
    
    const render = () =>{
        const CART_DATABASE = JSON.parse(sessionStorage.getItem("cart")) ||[];
        
        const total = CART_DATABASE.reduce((result,cur) =>{
                result += cur.amount * cur.price;
                result =parseFloat(result.toFixed(2))
                return result;
            },0);
    
        let result  = CART_DATABASE.map((item)=>
            `
             <tr>
              <th>
                <img src="${item.image}" style="width:250px;" alt="product" class="img-fluid" />
              </th>
              <td style="text-transform: uppercase;">${item.name}</td>
              <td>$${item.price}</td>
              <td>
                <i class="fas fa-chevron-up" data-id="${item.id}"></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id="${item.id}"></i>
              </td>
              <td>
                <button class="btn btn-primary remove-item" data-id="${item.id}">
                  Remove
                </button>
              </td>
            </tr>
            `
        ).join("");
        
            if(result){
                result +=`
                
                 <tr>
              <td></td>
              <td></td>
              <td>Total</td>
              <th>${total}$</th>
            </tr>
                `;
            }
        cartDOM.innerHTML = result;
    };

   

    cartDOM.addEventListener('click',event=>{
        const CART_DATABASE = JSON.parse(sessionStorage.getItem("cart")) ||[];
         if(event.target.classList.contains("remove-item")){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                this.removeItem(id);
                render();
            }
            else if (event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = CART_DATABASE.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                this.saveCart(CART_DATABASE);
                render();
            }
            else if (event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = CART_DATABASE.find(item =>item.id ===id);

                tempItem.amount = tempItem.amount -1;
                if(tempItem.amount>0){
                    this.saveCart(CART_DATABASE);
                    render();
                }else{
                    this.removeItem(id);
                    render();
                }
            }
    })


      clearBtn.addEventListener("click", () => {
    sessionStorage.removeItem("cart");
    render();
    });


  //first time 
  render();
};

function removeItem(id){
        let CART_DATABASE = JSON.parse(sessionStorage.getItem("cart")) ||[];
        CART_DATABASE = CART_DATABASE.filter(item =>item.id !== id);
        this.saveCart(CART_DATABASE);

    }

function saveCart(cart){
    sessionStorage.setItem("cart",JSON.stringify(cart));
}

start();