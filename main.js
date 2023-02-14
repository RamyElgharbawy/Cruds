// get elements
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let allpriceInputs = document.querySelectorAll(".pro-price input");

// variables
let mood = "create";
let tmp;
// [1] get total price

// Add event in all price inputs
allpriceInputs.forEach((input) => {
  input.addEventListener("keyup", (e) => {
    totalPrice();
  });
});
// total price function
function totalPrice() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.backgroundColor = "#409743";
  } else {
    // reset total field
    total.innerHTML = "";
    total.style.backgroundColor = "#bd0d00";
  }
}

// [2] creat product

// check data on local storage
let productsArr;
if (localStorage.product != null) {
  productsArr = JSON.parse(localStorage.product);
} else {
  productsArr = [];
}

submit.onclick = () => {
  // creat new product
  let newProduct = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  // check inputs validation
  if (
    title.value !== "" &&
    price.value != "" &&
    category.value !== "" &&
    newProduct.count < 100
  ) {
    // check submit btn mood
    if (mood === "create") {
      // [6] count function
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
          productsArr.push(newProduct);
        }
      } else {
        // append product to product Array
        productsArr.push(newProduct);
      }
    } else {
      // update index in all products array to new values
      productsArr[tmp] = newProduct;
      // reset mood
      mood = "create";
      // reset submit btn & show count div
      count.style.display = "block";
      submit.innerHTML = "Create";
    }
    // clear inputs fields data
    clearData();
  }

  // [3] save in local storage
  // save products array to local Storage
  localStorage.setItem("product", JSON.stringify(productsArr));

  //  show from local storage
  showData();
};

// [4] clear inputs fields
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}
// [5] read from local storage
function showData() {
  // get total price and reset total status
  totalPrice();
  // create new tr
  let newTr = "";
  productsArr.forEach((product, index) => {
    newTr += `
        <tr>
        <td>${index + 1}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.category}</td>
        <td><button onclick="updateProduct(${index})" id="update">Update</button></td>
        <td><button onclick="deleteProduct(${index})" id="delete">Delete</button></td>
      </tr>
        `;
  });
  // append new tr to data table
  document.querySelector("#tbody").innerHTML = newTr;

  // creat delete all button if there was data in products array
  let deleteAllDiv = document.querySelector(".delete-all");

  if (productsArr.length > 0) {
    deleteAllDiv.innerHTML = `<button onclick="deleteAll()" id="deleteAllBtn">Delete All (${productsArr.length})</button>`;
  } else {
    deleteAllDiv.innerHTML = "";
  }
}

showData();

// [7] delete products
function deleteProduct(index) {
  // delete product from products Array
  productsArr.splice(index, 1);
  // update local storage data
  localStorage.product = JSON.stringify(productsArr);
  // update data table
  showData();
}

// delete All data function
function deleteAll() {
  // clear all data from local storage
  localStorage.clear();
  // clear all data from products array
  productsArr.splice(0);
  // update data table
  showData();
}

// [8] update products
function updateProduct(i) {
  title.value = productsArr[i].title;
  price.value = productsArr[i].price;
  taxes.value = productsArr[i].taxes;
  ads.value = productsArr[i].ads;
  discount.value = productsArr[i].discount;
  totalPrice();
  count.style.display = "none";
  category.value = productsArr[i].category;
  submit.innerHTML = "Update";
  // change mood to update
  mood = "update";
  // pass index to global variable
  tmp = i;
  // make scroll to top
  scroll({
    top: 0,
    behavior: "smooth",
  });
}
// [9] search fuctions
let searchMood = "title";
let search = document.getElementById("search");

// get search mood funcion from btn id
function getSearchMood(id) {
  if (id === "searchTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }

  // edit search input field
  search.focus();
  search.placeholder = `Search By ${searchMood.toUpperCase()}`;

  // reset data table & search input field
  search.value = "";
  showData();
}

function searchData(value) {
  let newTr = "";

  productsArr.forEach((product, index) => {
    if (searchMood === "title") {
      if (product.title.includes(value.toLowerCase())) {
        newTr += `
        <tr>
        <td>${index + 1}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.category}</td>
        <td><button onclick="updateProduct(${index})" id="update">Update</button></td>
        <td><button onclick="deleteProduct(${index})" id="delete">Delete</button></td>
      </tr>
        `;
      }
    } else {
      if (product.category.includes(value.toLowerCase())) {
        newTr += `
        <tr>
        <td>${index + 1}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.taxes}</td>
        <td>${product.ads}</td>
        <td>${product.discount}</td>
        <td>${product.total}</td>
        <td>${product.category}</td>
        <td><button onclick="updateProduct(${index})" id="update">Update</button></td>
        <td><button onclick="deleteProduct(${index})" id="delete">Delete</button></td>
      </tr>
        `;
      }
    }
  });

  // append new tr to data table
  document.querySelector("#tbody").innerHTML = newTr;
}

// [10] clean data
