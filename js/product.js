const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const ProductDOM = $('.ProductDOM');

let cart = [];

let buttonDOM = [];

class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <tr>
                <td>
                    <img src="${product.image}" alt="product" style="width:250px;" />
                </td>
                <td style="text-transform: uppercase;">${product.name}</td>
                <td>$${product.price}</td>
                <td>
                    <button class="btn btn-primary" id="btn-add" data-id="${product.id}">
                        Add to cart
                    </button>
                </td>
            </tr>
            
            
            `;

        });
        ProductDOM.innerHTML = result;
    }

    getAddButtons() {
        const buttons = [...$$("#btn-add")];
        buttonDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;

            button.addEventListener('click', (event) => {
                let inCart = cart.find(item => item.id === id) || 0;
                if (inCart) {
                    inCart.amount += 1;
                } else {
                    let cartItem = {
                        ...Storage.getProduct(id),
                        amount: 1
                    };
                    cart = [...cart, cartItem];
                }
                Storage.saveCart(cart);
                alert(`Add successfully` )
            })
        })
    }

    setupApp() {
        cart = Storage.getCart();
    }

}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("PRODUCTS", JSON.stringify(products));
    }

    static getProduct(id) {
        let product = JSON.parse(localStorage.getItem("PRODUCTS"));

        return product.find(product => product.id === id);
    }

    static saveCart(cart) {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }
    static getProductCart(id) {

        let product = JSON.parse(localStorage.getItem("cart")) || [];

        return product.find(product => product.id === id);
    }

    static getCart() {
        JSON.parse(sessionStorage.getItem("cart")) || [];
    }

    static getAllProduct() {
        localStorage.getItem("PRODUCTS");
    }

}

class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;

            products = products.map(item => {

                const {
                    name,
                    price
                } = item.fields;
                const {
                    id
                } = item.sys;
                const image = item.fields.image.fields.file.url;
                return {
                    name,
                    price,
                    id,
                    image
                };
            })
            return products;


        } catch (error) {
            console.log(error);
        }
    }
}


document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI();
    const products = new Products();

    // Setup app
    // cart = Storage.getCart();


    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getAddButtons();
    })
});

