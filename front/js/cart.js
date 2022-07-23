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

let cartStorage = localStorage.getItem("listProducts");
let cartJson;

// TODO: Error in console
if (cartStorage == '[]') {
  document.getElementsByClassName('cart')[0].remove();
  document.getElementById('cartAndFormContainer').firstElementChild.innerHTML = "Votre panier est vide";
} else {
  cartJson = JSON.parse(cartStorage).sort((a, b) => a.id.localeCompare(b.id));
}
let productName;

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
  let totalNumberOfProducts = 0;

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

const deleteProductFromCart = () => {
  const deleteButtons = document.querySelectorAll('.deleteItem');

  deleteButtons.forEach(btn => 
    btn.addEventListener('click', () => {
      let article = btn.closest('article');
      cartJson = cartJson.filter(product => !(product.id === article.dataset.id && product.color === article.dataset.color));
      localStorage.setItem("listProducts", JSON.stringify(cartJson));
      //Remove the article element from the DOM
      article.remove();

      // Affiche le nouveau prix total
      displayTotalPrice();

      // Affiche le nouveau total de la quantitée
      displayTotalQuantity();
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
  cartJson.find(product => (product.id === article.dataset.id && product.color === article.dataset.color)).quantity = input.value;
  localStorage.setItem("listProducts", JSON.stringify(cartJson));

  // Affiche le nouveau total de la quantitée
  displayTotalQuantity();
};


const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const email = document.getElementById('email');
const cityName = document.getElementById('city');

const regexEmail = /^[\w\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const regexFirstLastName = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;
const regexAddress = /^([0-9]*) ?([a-zA-Z,\. ]*) ?([a-zA-Z]*)$/;
const regexCity = /^[a-zA-Z]([a-z]|[éèàôîù])*([\s-][a-zA-Z]([a-z]|[éèàôîù])*)*$/;

let isValid = true;
const checkInputs = (input, regex, message) => {

  if (new RegExp(regex).test(input.value) === false) {
    input.nextElementSibling.innerHTML = message;
    isValid = false;
  } else {
    input.nextElementSibling.innerHTML = '';
  }
};

// Vérifie si tous les inputs du formulaire sont valides lorsque l'on clique sur le bouton Commander !
const formValid  = () => {
  const form = document.getElementsByClassName('cart__order__form')[0];

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    checkInputs(firstName, regexFirstLastName, "le prénom n'est pas valide");

    checkInputs(lastName, regexFirstLastName, "le nom n'est pas valide");

    checkInputs(cityName, regexCity, "la ville n'est pas valide");

    checkInputs(address, regexAddress, "adresse invalide");

    checkInputs(email, regexEmail, "Email invalide");

    // Tout les regex sont true, on peut donc constituer l'objet contact et faire la requête POST 
    if (isValid) {
      console.log('Tout les regex sont bon!');

      let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: cityName.value,
        email: email.value
      };
      console.log(contact);


      let products = cartJson.map((item) => item.id);

      console.log(products);

      let datas = { contact, products};

      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          'Accept': 'application/json', 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datas)
      })
        .then(function(res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then(function(data) {
          localStorage.clear();
          location.href= `./confirmation.html?orderId=${data.orderId}`;
        })
        .catch(function(err) {
          return console.log(err);
        });
    }
  });
};

async function main() {

  await createPaginationCart();
  displayTotalQuantity();
  await displayTotalPrice();
  deleteProductFromCart();
  getChangeOnProductQuantity();
  formValid();
}

main();