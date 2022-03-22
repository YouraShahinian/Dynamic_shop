let productsList = document.getElementById("productsList");
let carts = null;

document.getElementById("minToMax").addEventListener("click", () => {
  addProductList(true);
});
document.getElementById("maxToMin").addEventListener("click", () => {
  addProductList(false);
});

const addListenerToCartButton = () => {
  carts = document.querySelectorAll(".addToCartButton");

  for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener("click", () => {
      cartNumbers(dataArray[i]);
      totalCost(dataArray[i]);
    });
  }
};

function addProductList(checkedMinMax) {
  productsList.replaceChildren();
  if (checkedMinMax) {
    dataArray.sort(function (a, b) {
      return a.price - b.price;
    });
    dataArray.map((product) => {
      let productsDiv = document.createElement("div");
      let img = document.createElement("img");
      img.src = `/img/${product.name.replaceAll(" ", "").toLowerCase()}.jpg`;
      productsDiv.appendChild(img);
      let title = document.createElement("h3");
      title.innerText = product.name;
      productsDiv.appendChild(title);
      let paragraph = document.createElement("p");
      paragraph.innerText = product.description;
      productsDiv.appendChild(paragraph);
      let productPrice = document.createElement("p");
      productPrice.innerText = `Price: ${product.price} $`;
      productsDiv.appendChild(productPrice);
      let addToChartButton = document.createElement("button");
      addToChartButton.innerText = `Add To Cart`;
      addToChartButton.setAttribute("class", "addToCartButton");
      productsDiv.appendChild(addToChartButton);
      productsList.appendChild(productsDiv);
    });
  } else {
    dataArray.sort(function (a, b) {
      return b.price - a.price;
    });
    dataArray.map((product) => {
      let productsDiv = document.createElement("div");
      let img = document.createElement("img");
      img.src = `/img/${product.name.replaceAll(" ", "").toLowerCase()}.jpg`;
      productsDiv.appendChild(img);
      let title = document.createElement("h3");
      title.innerText = product.productName;
      productsDiv.appendChild(title);
      let paragraph = document.createElement("p");
      paragraph.innerText = product.description;
      productsDiv.appendChild(paragraph);
      let productPrice = document.createElement("p");
      productPrice.innerText = `Price: ${product.price} $`;
      productsDiv.appendChild(productPrice);
      let addToChartButton = document.createElement("button");
      addToChartButton.innerText = `Add To Cart`;
      addToChartButton.setAttribute("class", "addToCartButton");
      productsDiv.appendChild(addToChartButton);
      productsList.appendChild(productsDiv);
    });
  }
  addListenerToCartButton();
}

document.getElementById("minToMax").click();
