const str = window.location.href;
const url = new URL(str);
const urlParamsId = url.searchParams.get('id');

const selectColor = document.getElementById('colors');
const selectQuantity = document.getElementById('quantity');
const addToCart = document.getElementById('addToCart');

let selectedColor;
let selectedQuantity;

/**
 * Send request to get one particular product using fetch api
 * @param { String } urlParamsId
 * @returns { Promise }
 */
const retrieveOneProduct = () => fetch(`http://localhost:3000/api/products/${urlParamsId}`)
  .then(function(res) {
    return res.json();
  })
  .then(function(json) {
    // console.log(json);
    return json;
  })
  .catch(function(err) {
    // TODO: Retourner message d'erreur
  });

/**
 * Create pagination
 * @param {Object} dataOneProduct 
 */
const paginationOneProduct = (dataOneProduct) => {
  // console.log(dataOneProduct);

  const createImg = document.createElement('img');
  createImg.src = dataOneProduct.imageUrl;
  createImg.alt = dataOneProduct.altTxt;

  const img = document.querySelector('.item__img');
  img.appendChild(createImg);

  document.getElementById('title').innerHTML = dataOneProduct.name; // Titre
  document.getElementById('price').innerHTML = dataOneProduct.price; // Prix
  document.getElementById('description').innerHTML = dataOneProduct.description; // Description

  // Sélection des couleurs
  dataOneProduct.colors.forEach(color => {
    const colorOption = document.createElement('option');
    colorOption.value = color;
    colorOption.innerHTML = color;

    selectColor.appendChild(colorOption);
  });
};

/**
 * @returns { Array } empty or not given the localStorage
 */
const getProducts = () => {
  let listProducts = localStorage.getItem("listProducts");
  if (listProducts == null) {
      return [];
  } else {
      return JSON.parse(listProducts);
  }
};

/**
 * Get the choosen color
 * @param { Object } selectColor 
 */
const getColor  = (selectColor) => {
  selectColor.addEventListener('change', () => {
    console.log(selectColor.value);
    selectedColor = selectColor.value;
  });
};

/**
 * Get the choosen quantity
 * @param { Object } selectQuantity 
 */
const getQuantity  = (selectQuantity) => {
  selectQuantity.addEventListener('change', () => {
    // console.log(selectQuantity.value);
    selectedQuantity = selectQuantity.value;
  });
};

/**
 * Save listProducts into the localStorage
 * @param { Array } listProducts 
 */
const saveProducts = (listProducts) => {
  localStorage.setItem("listProducts", JSON.stringify(listProducts));
};

const addProducts = (chosenProduct) => {
  let listProducts = getProducts();

  // On sauvegarde dans le localStorage seulement lorsque l'on clique sur le bouton 'Ajouter au panier'
  addToCart.addEventListener('click', () => {

    const productExist = listProducts.find(filter => filter.color == selectColor.value && filter.id == chosenProduct._id);

    if (productExist) {
      productExist.quantity += parseInt(selectQuantity.value);
    } else {
      listProducts.push({id: chosenProduct._id, color: selectColor.value, quantity: parseInt(selectQuantity.value)});
    }

    saveProducts(listProducts);

    // Message pour signifier que le produit a bien été ajouté au panier
    const addButtonDiv = document.querySelector('.item__content');
    const addToCartAlert = document.createElement('p');
    addToCartAlert.innerHTML = "Le produit a été ajouté au panier!";
    addToCartAlert.style.textAlign = "center";
    addButtonDiv.appendChild(addToCartAlert);
  });
};


async function main() {

  const dataOneProduct = await retrieveOneProduct();

  paginationOneProduct(dataOneProduct);
  getProducts();
  addProducts(dataOneProduct);
}

main();