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
const message = document.getElementById("description");

//Obtengo valores guardados en localStorage si existen, para agilizar la carga de datos fijos.
nameInput.value = localStorage.getItem("name");
phoneNumber.value = localStorage.getItem("phoneNumber");
email.value = localStorage.getItem("email");
lastname.value = localStorage.getItem("lastname");

let contactReasonStored = localStorage.getItem("contactReason") || "Job Offer";
//selecciono el rb que pose el valor igual al obtenido del localStorage, y lo selecciono con la propiedad checked
let arrayOfRbs = [...contactReasonRbs];

const getRbSelected = () => arrayOfRbs.find((element) => element.checked);

let rbSelected = arrayOfRbs.find(
  (element) => element.value == contactReasonStored
);
rbSelected.checked = true;

//Buttons
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");

//regEx
const phoneRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const emailRegEx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//Functions
const hasError = (element) => {
  element.classList.remove("is-valid");
  element.classList.add("is-invalid");
};

const isValid = (element) => {
  element.classList.remove("is-invalid");
  element.classList.add("is-valid");
};

let errorOn = "";
const saveForm = () => {
  //Si no ingreso nada en el input de nombre, se mostrara el swal con la advertencia correspondiente
  if (nameInput.value === "") {
    hasError(nameInput);
    errorOn = "name";
    return false;
  } else {
    isValid(nameInput);
  }

  if (lastname.value === "") {
    hasError(lastname);
    errorOn = "lastname";
    return false;
  } else {
    isValid(lastname);
  }

  if (!emailRegEx.test(email.value)) {
    hasError(email);
    errorOn = "lastname";
    return false;
  } else {
    isValid(email);
  }

  //Solo valida si tiene contenido, ya que el telefono no es obligatorio
  if (phoneNumber.value != "" && !phoneRegEx.test(phoneNumber.value)) {
    errorOn = "phone number";
    hasError(phoneNumber);
    return false;
  } else {
    isValid(phoneNumber);
  }

  if (message.value === "") {
    hasError(message);
    errorOn = "message";
    return false;
  } else {
    isValid(message);
  }

  //some() devuelve true si alguno de los elementos del array cumple la condicion, en este caso, estar chequeado
  let someChecked = arrayOfRbs.some((element) => element.checked);

  if (someChecked === false) {
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
    if (element.name === "description") {
      //do nothing
    } else if (element.name === "contactReason") {
      element.checked && localStorage.setItem(element.name, element.value);
    } else if (element.type !== "button") {
      localStorage.setItem(element.name, element.value);
    }
  });
};

function sendMail(mail, reason, message, nameInput, lastname, phone) {
  Email.send({
    SecureToken: "f912b381-1ff3-4ca7-aab3-7fc2341cce29",
    To: "inapalbusiness@gmail.com",
    From: "nachonapal1@gmail.com",
    Subject: reason,
    Body: `<h4>Hi, I'm ${nameInput} ${lastname}</h4><p>${message}</p><p><b>Mail: </b>${mail}</p>${
      phone != "" && `<p><b>Phone:</b> ${phone}</p>`
    }`,
  });
}

const send = (e) => {
  e.preventDefault();
  if (saveForm()) {
    sendMail(
      email.value,
      getRbSelected().value,
      message.value,
      nameInput.value,
      lastname.value,
      phoneNumber.value
    );
    clear();
    return swal("Email Sent");
  }

  return swal(`Email wasn't sent because there are errors on ${errorOn} field`);
};

const clear = () => {
  formElements = [...form.elements];
  formElements.forEach((element) => {
    element.classList.remove("is-valid");
    element.classList.remove("is-invalid");
  });
  form.reset();
};

//Listeners
sendButton.addEventListener("click", send);
clearButton.addEventListener("click", clear);

//Effects
$("#skills span,#skills i").on("mouseover", function () {
  $(this).css({
    "font-size": "2em",
    color: "#396AB4",
  });
});

$("#skills span,#skills i").on("mouseout", function () {
  $(this).css({
    "font-size": "1em",
    color: "#212529",
  });
});

$("#skills img").on("mouseover", function () {
  $(this).css({
    width: "50px",
  });
});

$("#skills img").on("mouseout", function () {
  $(this).css({
    width: "25px",
  });
});

$(".card").on("mouseover", function () {
  $(this).css({
    "box-shadow": "0px 0px 10px #396AB4",
  });
});

$(".card").on("mouseout", function () {
  $(this).css({
    "box-shadow": "none",
  });
});

$(".nav-link").on("click", function () {
  $(".nav-link").removeClass("active");
  $(this).addClass("active");
});
