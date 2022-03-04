let productsList = document.getElementById('productsList')
import productData from './data/products-data.js'
let dataArray = productData.products

document.getElementById('minToMax').addEventListener("click", () => {addProductList(true)});
document.getElementById('maxToMin').addEventListener("click", () => {addProductList(false)});
document.getElementById('minToMax').click()

function addProductList(checkedMinMax) { 
    productsList.replaceChildren()
    if (checkedMinMax) {
        dataArray.sort(function(a, b){return a.price - b.price})
        dataArray.map((product) => {
            let productsDiv = document.createElement('div')
            let img = document.createElement('img')
            img.src = product.image
            productsDiv.appendChild(img)
            let title = document.createElement('h3')
            title.innerText = product.productName
            productsDiv.appendChild(title)
            let paragraph = document.createElement('p')
            paragraph.innerText = product.description
            productsDiv.appendChild(paragraph)
            let productPrice = document.createElement('p')
            productPrice.innerText = `Price: ${product.price} $`
            productsDiv.appendChild(productPrice)
            productsList.appendChild(productsDiv)
        })
    } else {
        dataArray.sort(function(a, b){return b.price - a.price})
        dataArray.map((product) => {
            let productsDiv = document.createElement('div')
            let img = document.createElement('img')
            img.src = product.image
            productsDiv.appendChild(img)
            let title = document.createElement('h3')
            title.innerText = product.productName
            productsDiv.appendChild(title)
            let paragraph = document.createElement('p')
            paragraph.innerText = product.description
            productsDiv.appendChild(paragraph)
            let productPrice = document.createElement('p')
            productPrice.innerText = `Price: ${product.price} $`
            productsDiv.appendChild(productPrice)
            productsList.appendChild(productsDiv)
        })
    }
}
