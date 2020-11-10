let carts = document.querySelectorAll('.add-cart');
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
        price: 600,
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
    },
    {
        name: 'Red Couch',
        tag: 'redcouch',
        price: 550,
        inCart: 0
    },
    {
        name: 'Black Couch',
        tag: 'blackcouch',
        price: 750,
        inCart: 0
    },
    {
        name: 'Beige Couch',
        tag: 'beigecouch',
        price: 750,
        inCart: 0
    }
];


start();
onLoadCartNumbers(); //Showing current cartNumbers each time switching the page
displayCart(); 

function start() {
    for (let i=0; i < carts.length; i++) {
        carts[i].addEventListener('click',()=> {
            cartNumbers(products[i]);  //Add obj product as parameter to function cartNumbers
            totalCost(products[i]);  //We want to recalculate cartNumbers and totalCost each time we clicked a product   
        })
    }
}

function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers'); //String  return null if item doesn't exist
    productNumbers = parseInt(productNumbers); //change string to number
    if(productNumbers) { //If cartNumbers exist and not 0 
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
        if (cartItems[product.name] == undefined) {
            cartItems ={
                ...cartItems,
                [product.name]:product  //add a new obj in existing cartItems obj
            }
        }
        cartItems[product.name].inCart+=1;
    } else {
        product.inCart =1;
        cartItems = {
            [product.name]:product
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

function onLoadCartNumbers() { //Makesure cartNumbers updated everytime refresh the page (get data from local storage)  
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
} 

function displayCart() { //This page is dynamic 
    let cartCost = localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".products");
    if (cartItems && productContainer) {  //Make data both showing on cart page & in local storage 
        productContainer.innerHTML = '';
        Object.values(cartItems).map(el => {
            productContainer.innerHTML += `
            <div class="product">
                <ion-icon class="remove" name="close-circle-outline"></ion-icon>
                <img src="./images/${el.tag}.jpg">
                <span>${el.name}</span>
            </div>
            <div class="price">$${el.price}.00</div>
            <div class="quantity">
                <ion-icon class="decrease" name="remove-circle-outline"></ion-icon>
                <span>${el.inCart}</span>
                <ion-icon class="increase" name="add-circle-outline"></ion-icon>
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
    deleteButtons();
    manageQuantity();
}

//DELETE PRODUCT
function deleteButtons(){
    let deleteButtons=document.querySelectorAll('.remove');
    let productName;
    let productNumbers =localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    let cartItems=localStorage.getItem('productsInCart');
    cartItems=JSON.parse(cartItems);
    let cartCost=localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);
  
    for (let i=0; i<deleteButtons.length; i++){
        deleteButtons[i].addEventListener('click', ()=>{
         productName=deleteButtons[i].nextElementSibling.nextElementSibling.textContent;
   
         localStorage.setItem('cartNumbers', productNumbers-cartItems[productName].inCart);
         localStorage.setItem('totalCost',cartCost-(cartItems[productName].price*cartItems[productName].inCart));
         delete cartItems[productName];
         localStorage.setItem('productsInCart', JSON.stringify(cartItems));
       
         displayCart();
         onLoadCartNumbers();
        })
    }
}
//ADJUST QUANTITY
function manageQuantity(){
    let decreaseButtons=document.querySelectorAll('.decrease');
    let increaseButtons=document.querySelectorAll('.increase');
    let productNumbers =localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let cartCost=localStorage.getItem('totalCost');
    cartCost = parseInt(cartCost);
    let currentQuantity = 0;
    let currentProduct = "";

    for(let i=0;i<decreaseButtons.length; i++){
        decreaseButtons[i].addEventListener('click',()=>{
            console.log(decreaseButtons[i].nextElementSibling)
            currentQuantity= decreaseButtons[i].nextElementSibling.textContent;
            currentProduct=decreaseButtons[i].parentElement.previousElementSibling.previousElementSibling.lastElementChild.textContent;
            if( cartItems[currentProduct].inCart>1){
                cartItems[currentProduct].inCart-=1;
                localStorage.setItem("cartNumbers", productNumbers-1);
                localStorage.setItem('totalCost',cartCost-cartItems[currentProduct].price);
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();
                onLoadCartNumbers();
            }
        });
    }
    for(let i=0;i<increaseButtons.length; i++){
        increaseButtons[i].addEventListener('click',()=>{
            currentQuantity= increaseButtons[i].previousElementSibling.textContent;
            currentProduct=increaseButtons[i].parentElement.previousElementSibling.previousElementSibling.lastElementChild.textContent;
            cartItems[currentProduct].inCart+=1;
            localStorage.setItem("cartNumbers", productNumbers+1);
            console.log(typeof productNumbers)
            localStorage.setItem('totalCost',cartCost+cartItems[currentProduct].price);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
            onLoadCartNumbers();
        });
    }
}