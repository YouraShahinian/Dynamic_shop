

const loadCartNumbers = () => {
    let productNumbers = localStorage.getItem('cartNumbers')
    if( productNumbers ) {
        document.querySelector('span').textContent = productNumbers
    }
}

const cartNumbers = (product) => {
    let productNumbers = +localStorage.getItem('cartNumbers')
    
    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1)
        document.querySelector('span').textContent = productNumbers + 1
    } else {
        localStorage.setItem('cartNumbers', 1)
        document.querySelector('span').textContent = 1
    }
    setItems(product)
    
}

const setItems = (product) => {
    let cartItems = localStorage.getItem('productsInCart')
    cartItems = JSON.parse(cartItems)

    if (cartItems) {
        if (!cartItems[product._id]) {
            // cartItems = {
            //     ...cartItems,
            //     `${product._id}`: product
            // }
            product.inCart = 0
            cartItems[product._id] = product
        }
        cartItems[product._id].inCart += 1
    } else {
        product.inCart = 1

        cartItems = {
            [product._id]: product
        }
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems))
}

const decrementItemCount = (productId) => {
    let cartItems = localStorage.getItem('productsInCart')
    let cartNumbers = +localStorage.getItem('cartNumbers')
    let totalCost = +localStorage.getItem('totalCost')
    cartItems = JSON.parse(cartItems)
    if (cartItems[productId] && cartItems[productId].inCart > 0) {
        cartItems[productId].inCart -= 1
        cartNumbers -=1
        localStorage.setItem('totalCost', totalCost - cartItems[productId].price)
        changeProductCountInSpan(cartItems[productId])
        if (cartItems[productId].inCart == 0) cartItems[productId] = undefined
    } else {
        cartItems[productId] = undefined
    }
    //localStorage.setItem('totalCost', totalCost - cartItems[productId].price)
    localStorage.setItem('productsInCart', JSON.stringify(cartItems))
    localStorage.setItem('cartNumbers', cartNumbers)
   
    if (!cartItems[productId]) {
        window.location.reload()
    }
}

const incrementItemCount = (productId) => {
    let cartItems = localStorage.getItem('productsInCart')
    let cartNumbers = +localStorage.getItem('cartNumbers')
    let totalCost = +localStorage.getItem('totalCost')
    cartItems = JSON.parse(cartItems)
    cartItems[productId].inCart +=1
    localStorage.setItem('cartNumbers', cartNumbers += 1)
    localStorage.setItem('productsInCart', JSON.stringify(cartItems))
    localStorage.setItem('totalCost', totalCost + cartItems[productId].price)
    changeProductCountInSpan(cartItems[productId])
}

const totalCost = (product) => {
    let cartCost = +localStorage.getItem('totalCost')
    if (cartCost) {
        localStorage.setItem('totalCost', cartCost + product.price)
    } else {
        localStorage.setItem('totalCost', product.price)
    }
}

const deleteItemFromCart = (productId) => {
    let cartItems = localStorage.getItem('productsInCart')
    cartItems = JSON.parse(cartItems)
    let cartCost = +localStorage.getItem('totalCost')
    let cartNumbers = +localStorage.getItem('cartNumbers')
    
    cartCost[productId] = 0
    let deletedItemNumber = cartNumbers - cartItems[productId].inCart
    localStorage.setItem('cartNumbers', deletedItemNumber)
    
    let deletedItemPrice = cartCost - cartItems[productId].inCart * cartItems[productId].price
    localStorage.setItem('totalCost', deletedItemPrice)

    cartItems[productId] = undefined
    localStorage.setItem('productsInCart', JSON.stringify(cartItems))
    window.location.reload()


}

const changeProductCountInSpan = (product) => {
    document.getElementById('productCountInCart'+product._id).innerHTML = product.inCart
    document.getElementById('productPriceInCart'+product._id).innerHTML = `$${product.inCart * product.price},00`
    document.getElementById('totalPriceOfItems').innerHTML = `$${localStorage.getItem('totalCost')},00`
}

const displayCart = () => {
    let cartItems = localStorage.getItem('productsInCart')
    cartItems = JSON.parse(cartItems)//ObjectKeys for filer when inCart == 0
    let productsContainer = document.querySelector(".products")
    let cartCost = +localStorage.getItem('totalCost')
    if (cartItems && productsContainer) {
        productsContainer.innerHTML = ''
        Object.values(cartItems).map(item => {
            productsContainer.innerHTML += `
            <div class="row">
                <div class="product col-md-3">
                <input type="button" onclick="deleteItemFromCart('${item._id}')" value="delete">
                <img src="/img/${item.name.replaceAll(' ', '').toLowerCase().trim()}.jpg"
                <p>${item.name}</p>
            </div>
            <div class="price col-md-3"><p>$${item.price},00</p></div>
            <div class="quantity col-md-3">
            <input type="button" onclick="incrementItemCount('${item._id}')" value="+">
            <p id="productCountInCart${item._id}">${item.inCart}</p>
            <input type="button" onclick="decrementItemCount('${item._id}')" value="-">
            </div>
            <div class="total col-md-3">
            <p id="productPriceInCart${item._id}">$${item.inCart * item.price},00</p>
            </div>
            `
        })
        productsContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="basketTotalTitle">
                    Basket Total
                </h4>
                <h4 id="totalPriceOfItems" class="basketTotal">
                    $${cartCost},00
                </h4>
            </div>
        `
    }
}

loadCartNumbers()
displayCart()