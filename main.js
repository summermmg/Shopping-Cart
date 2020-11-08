let carts = document.querySelectorAll('.add-cart');
console.log(carts)
let products = [  //create an array contains all objects 
    {
        name: 'Grey Couch',
        tag: 'greycouch',
        price: 550,
        inCart: 0
    },
    {
        name: 'Green Couch',
        tag: 'greencouch',
        price: 800,
        inCart: 0
    },
    {
        name: 'White Couch',
        tag: 'whitecouch',
        price: 600,
        inCart: 0
    },
    {
        name: 'Blue Couch',
        tag: 'bluecouch',
        price: 750,
        inCart: 0
    },
    {
        name: 'Brown Couch',
        tag: 'browncouch',
        price: 650,
        inCart: 0
    }
]

function start() {
    for (let i=0; i < carts.length; i++) {
        carts[i].addEventListener('click',()=> {
            cartNumbers(products[i]);  //Add obj product as parameter to function cartNumbers
            totalCost(products[i]);  //We want to recalculate cartNumbers and totalCost each time we clicked a product   
    })
}
}

function onLoadCartNumbers() { //Makesure cartNumbers updated everytime refresh the page (get data from local storage)  
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
} 

function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers'); //String  return null if item doesn't exist
    productNumbers = parseInt(productNumbers); //Number
    if(productNumbers) { //If cartNumbers exists(total number of products clicked) 
        localStorage.setItem("cartNumbers",productNumbers+1)  
        document.querySelector('.cart span').textContent = productNumbers+1;
    } else {
        localStorage.setItem("cartNumbers",1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

function setItems(product) { //We need to know what products we have selected  
    let cartItems = localStorage.getItem("productsInCart"); //the value of productsInCart is an obj that contains all objs(product) selected **Data is a JSON string here
    cartItems = JSON.parse(cartItems); //When receiving data from a web server, the data is always a string. Parse the data with JSON.parse(), and the data becomes a JavaScript object.
    
    if (cartItems != null) { //If there is something in the value of productsInCart(an obj) in local storage
        if (cartItems[product.tag] == undefined) {
            cartItems ={
                ...cartItems,
                [product.tag]:product  //add a new obj in existing cartItems obj
            }
        }
        cartItems[product.tag].inCart+=1;
    } else {
        product.inCart =1;
        cartItems = {
            [product.tag]:product
        }
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems)); //After update js object cartItems, set it as JSON string and store to local storage 
}

function totalCost(product) { //Calculate total cost
    let cartCost = localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);
    if(cartCost) {
        localStorage.setItem("totalCost",cartCost+product.price);
    } else {
        localStorage.setItem("totalCost", product.price);
    }
}

function displayCart() {
    let cartCost = localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");
    console.log(productContainer)
    console.log(cartItems)
    if (cartItems && productContainer) {  //Make data both showing on cart page & in local storage 
        productContainer.innerHTML = '';
        Object.values(cartItems).map(el => {
            productContainer.innerHTML += `
            <div class="product">
                <ion-icon name="trash-outline"></ion-icon>
                <img src="./images/${el.tag}.jpg">
                <span>${el.name}</span>
            </div>
            <div class="price">$${el.price}.00</div>
            <div class="quantity">
                <ion-icon class="decrease" name="caret-back-circle-outline"></ion-icon>
                <span>${el.inCart}<span>
                <ion-icon class="increase" name="caret-forward-circle-outline"></ion-icon>
            </div>
            <div class="total">
                $${el.inCart * el.price}.00
            </div>
            `;
        });

        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                </h4>
                <h4 class="basketTotal">
                    $${cartCost}.00
                </h4>
            </div>    
        `;
    } 
}

start();
onLoadCartNumbers(); //keep showing cartNumbers each time refresh the page
displayCart(); 