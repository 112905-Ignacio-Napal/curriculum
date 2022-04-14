//Al cargar todos los elementos del DOM, bloqueo el resize del textarea
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("description").style.resize = "none";
});

//Form
const form = document.getElementsByTagName("form")[0];

//Form fields
const nameInput = document.getElementById("name");
const lastname = document.getElementById("lastname");
const phoneNumber = document.getElementById("phoneNumber");
const email = document.getElementById("email");
const contactReasonRbs = document.getElementsByName("contactReason");

//Obtengo valores guardados en localStorage si existen, para agilizar la carga de datos fijos.
nameInput.value = localStorage.getItem("name");
phoneNumber.value = localStorage.getItem("phoneNumber");
email.value = localStorage.getItem("email");
lastname.value = localStorage.getItem("lastname");

let reasonSelected = localStorage.getItem("contactReason") || "Job Offer";
//selecciono el rb que pose el valor igual al obtenido del localStorage, y lo selecciono con la propiedad checked
[...contactReasonRbs].find(
  (element) => element.value == reasonSelected
).checked = true;

//Buttons
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");

//regEx
const phoneRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;

//Functions
let errorOn = "";
const saveForm = () => {
  form.classList.add("was-validated");
  //Si no ingreso nada en el input de nombre, se mostrara el swal con la advertencia correspondiente
  if (nameInput.value === "") {
    swal("Enter a name");
    errorOn = "name";
    return false;
  }

  if (lastname.value === "") {
    swal("Enter a lastname");
    errorOn = "lastname";
    return false;
  }

  if (!phoneRegEx.test(phoneNumber.value)) {
    phoneNumber.classList.add("is-invalid");
    errorOn = "phone number";
    swal("Enter a valid phone number");
    return false;
  }

  //Convierto genderRbs(NodeList) en un array para poder usar el metodo.some
  let array = [...contactReasonRbs];

  //some() devuelve true si alguno de los elementos del array cumple la condicion, en este caso, estar chequeado
  let someChecked = array.some((element) => element.checked);

  if (someChecked === false) {
    swal("Select a contact reason");
    errorOn = "contact reason";
    return false;
  }

  //Validacion completa correctamente
  saveFieldsOnLocalStorage();
  return true;
};

const saveFieldsOnLocalStorage = () => {
  const formFields = [...form.elements];

  formFields.forEach((element) => {
    if (element.name === "contactReason") {
      element.checked && localStorage.setItem(element.name, element.value);
    } else if (element.type !== "button" && element.type !== "submit") {
      localStorage.setItem(element.name, element.value);
    }
  });
};

const send = (e) => {
  if (saveForm()) {
    saveFieldsOnLocalStorage();
    clear();
    return swal("Data Saved");
  }

  e.preventDefault();
  return swal(`Data were not sent because there are errors on ${errorOn}`);
};

const clear = () => {
  form.classList.remove("was-validated");
  form.reset();
};

//Listeners
sendButton.addEventListener("click", send);
clearButton.addEventListener("click", clear);
