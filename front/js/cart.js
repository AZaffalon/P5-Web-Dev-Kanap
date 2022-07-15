let fetchSpecificProduct = (productId) => fetch(`http://localhost:3000/api/products/${productId}`)
.then(function(res) {
  if (res.ok) {
    return res.json();
  }
})
.then(function(json) {
  return json;
})
.catch(function(err) {
  return console.log(err);
});

/**
 * TODO 
 * - Revoir le système d'update et de delete (avec la nouvelle méthode de fetch)
 * !!!ATTENTION!!! : Découpage des fonctions
 * - Enlever tout le code commenté quand tout les changements seront appliqués !!!
 */

let cartStorage = localStorage.getItem("listProducts");
let cartJson = JSON.parse(cartStorage).sort((a, b) => a.id.localeCompare(b.id));
let productName;
let productPrice;
let totalNumberOfProducts = 0;
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const email = document.getElementById('email');
const cityName = document.getElementById('city');

async function getImg (cartJson) {
  let productFetched = await fetchSpecificProduct(cartJson.id);
  return productFetched.imageUrl;
}

async function getName(cartJson) {
  let productFetched = await fetchSpecificProduct(cartJson.id);
  return productFetched.name;
}

async function getPrice(cartJson) {
  let productFetched = await fetchSpecificProduct(cartJson.id);
  return productFetched.price;
}

let displayTotalQuantity = () => {
  const numberOfProducts = document.getElementById('totalQuantity');

  for (let i in cartJson) {
    totalNumberOfProducts += parseInt(cartJson[i].quantity);
  }
  numberOfProducts.innerHTML = totalNumberOfProducts;
};

async function displayTotalPrice() {
  const totalPrice = document.getElementById('totalPrice');
  let total = 0;

  for(let i in cartJson) {
    const priceByQuantity = await getPrice(cartJson[i]) * cartJson[i].quantity;
    total += priceByQuantity;
  }

  totalPrice.innerHTML = total;
}

async function createPaginationCart() {
  for (let i in cartJson) {
    const cartItems = document.getElementById('cart__items');
    
    const articleElement = document.createElement('article');
    articleElement.classList.add('cart__item');
    articleElement.dataset.id = cartJson[i].id;
    articleElement.dataset.color = cartJson[i].color;
  
    const divImgElement = document.createElement('div');
    divImgElement.classList.add('cart__item__img');
  
    const imgElement = document.createElement('img');
    imgElement.src = await getImg(cartJson[i]);
    imgElement.alt = "Photographie d'un canapé";

    const itemContent = document.createElement('div');
    itemContent.classList.add('cart__item__content');

    const itemContentDescription = document.createElement('div');
    itemContentDescription.classList.add('cart__item__content__description');

    const h2Element = document.createElement('h2');
    h2Element.innerHTML = await getName(cartJson[i]);
    
    const color = document.createElement('p');
    color.innerHTML = cartJson[i].color;

    const price = document.createElement('p');
    price.innerHTML = `${await getPrice(cartJson[i])} €`;

    const itemContentSettings = document.createElement('div');
    itemContentSettings.classList.add('cart__item__content__settings');

    const itemContentSettingsQty = document.createElement('div');
    itemContentSettingsQty.classList.add('cart__item__content__settings__quantity');
    
    const quantity = document.createElement('p');
    quantity.innerHTML= "Qté : ";

    const inputQuantity = document.createElement('input');
    inputQuantity.type = "number";
    inputQuantity.classList.add('itemQuantity');
    inputQuantity.name = "itemQuantity";
    inputQuantity.min = "1";
    inputQuantity.max = "100";
    inputQuantity.value = cartJson[i].quantity;

    const settingsDelete = document.createElement('div');
    settingsDelete.classList.add('cart__item__content__settings__delete');

    const deleteElement = document.createElement('p');
    deleteElement.classList.add('deleteItem');
    deleteElement.innerHTML = "Supprimer";



    
    cartItems.appendChild(articleElement);
    articleElement.appendChild(divImgElement);
    divImgElement.appendChild(imgElement);
    articleElement.appendChild(itemContent);
    itemContent.appendChild(itemContentDescription);
    itemContentDescription.appendChild(h2Element);
    itemContentDescription.appendChild(color);
    itemContentDescription.appendChild(price);
    itemContent.appendChild(itemContentSettings);
    itemContentSettings.appendChild(itemContentSettingsQty);
    itemContentSettingsQty.appendChild(quantity);
    itemContentSettingsQty.appendChild(inputQuantity);
    itemContentSettings.appendChild(settingsDelete);
    settingsDelete.appendChild(deleteElement);

  }
}

const deleteProductFromCart = (article) => {
  cartJson = cartJson.filter(product => !(product.id == article.dataset.id && product.color == article.dataset.color));
  localStorage.setItem("listProducts", JSON.stringify(cartJson));
  //Remove the article element from the DOM
  article.remove();
  displayTotalQuantity();
};

const getRelatedArticleForDelete = () => {
  const deleteButtons = document.querySelectorAll('.deleteItem');

  deleteButtons.forEach(btn => 
    btn.addEventListener('click', () => {
      let article = btn.closest('article');
      deleteProductFromCart(article);
    })
  );
};

const getChangeOnProductQuantity = () => {
  const quantityInputs = document.querySelectorAll('.itemQuantity');

  quantityInputs.forEach(input => 
    input.addEventListener('change', () => {
      let article = input.closest('article');
      editProductQuantity(input, article);
      displayTotalPrice();
    })
  );
};

const editProductQuantity = (input, article) => {
  cartJson.find(product => (product.id == article.dataset.id && product.color == article.dataset.color)).quantity = input.value;
  localStorage.setItem("listProducts", JSON.stringify(cartJson));

  let totalQuantity = 0;
  for (let i in cartJson) {
    totalQuantity += parseInt(cartJson[i].quantity);
  }
  document.getElementById('totalQuantity').innerHTML = totalQuantity;
};

/**
 * Validate last name with a Regex
 */
let validLastName = (inputs) => {
  const regexLastName = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;

  console.log(inputs);
  inputs.addEventListener('keyup', () => {
    let isValid = regexLastName.test(inputs.value);
    if (!isValid) {
      document.getElementById('lastNameErrorMsg').innerHTML = "Le nom n'est pas valide !";
    } else {
      document.getElementById('lastNameErrorMsg').innerHTML = "";
    }
  });
};

/**
 * Validate last name with a Regex
 */
let validFirstName = (inputs) => {
  const regexFirstName = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;

  console.log(inputs);
  inputs.addEventListener('keyup', () => {
    let isValid = regexFirstName.test(inputs.value);
    if (!isValid) {
      document.getElementById('firstNameErrorMsg').innerHTML = "Le prénom n'est pas valide !";
    } else {
      document.getElementById('firstNameErrorMsg').innerHTML = "";
    }
  });
};

/**
 * Validate address with a Regex
 */
let validAddress = (inputs) => { //TODO : Finish regex
  const regexAddress = /^([0-9]*) ?([a-zA-Z,\. ]*) ?([a-zA-Z]*)$/;

  console.log(inputs);
  inputs.addEventListener('keyup', () => {
    let isValid = regexAddress.test(inputs.value);
    if (!isValid) {
      document.getElementById('addressErrorMsg').innerHTML = "L'adresse n'est pas valide !";
    } else {
      document.getElementById('addressErrorMsg').innerHTML = "";
    }
  });
};

/**
 * Validate city name with a Regex
 */
let validCity = (inputs) => {
  const regexCity = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;

  console.log(inputs);
  inputs.addEventListener('keyup', () => {
    let isValid = regexCity.test(inputs.value);
    if (!isValid) {
      document.getElementById('cityErrorMsg').innerHTML = "Le nom de la ville n'est pas valide !";
    } else {
      document.getElementById('cityErrorMsg').innerHTML = "";
    }
  });
};

/**
 * Validate last email with a Regex
 */
let validEmail = (inputs) => {
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  console.log(inputs);
  inputs.addEventListener('keyup', () => {
    let isValid = regexEmail.test(inputs.value);
    if (!isValid) {
      document.getElementById('emailErrorMsg').innerHTML = "L'email n'est pas valide !";
    } else {
      document.getElementById('emailErrorMsg').innerHTML = "";
    }
  });
};

async function main() {

  await createPaginationCart();
  displayTotalQuantity();
  displayTotalPrice();
  getRelatedArticleForDelete();
  getChangeOnProductQuantity();
  validFirstName(firstName);
  validLastName(lastName);
  validEmail(email);
  validAddress(address);
  validCity(cityName);
}

main();