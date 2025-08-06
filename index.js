const pin = document.querySelector("#PIN");
const formLogin = document.querySelector("#formLogin");
const responseReturn = document.querySelector("#responseReturn");
const menu = document.querySelector("#menu");
const btnBalance = document.querySelector("#btnBalance");
const btnDeposit = document.querySelector("#btnDeposit");
const outputData = document.querySelector("#outputData");
const btnRemove = document.querySelector("#btnRemove");
const btnHistory = document.querySelector("#btnHistory");
const alertModal = document.querySelector("#alertModal");
btnSesion = document.querySelector("#btnSesion");

let intentosRestantes = 3;

// Función para cargar usuarios desde localStorage
const cargarUsuarios = () => {
  const usuariosGuardados = localStorage.getItem("usuarios");
  if (usuariosGuardados) {
    return JSON.parse(usuariosGuardados);
  } else {
    // Si no hay usuarios guardados, usar los datos iniciales
    return [
      {
        id: 0,
        nombre: "Sebastian",
        codigo: 777,
        saldo: 5000,
        historialTransacciones: ["Se deposito: $5000"],
        sesion: false,
      },
      {
        id: 1,
        nombre: "Brian",
        codigo: 77,
        saldo: 15000,
        historialTransacciones: ["Se deposito: $15000"],
        sesion: false,
      },
    ];
  }
};

// Función para guardar usuarios en localStorage
const guardarUsuarios = (usuarios) => {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

// Cargar usuarios al iniciar
let usuarios = cargarUsuarios();

const verificarUsuario = (pinIngresado) => {
  const userActive = document.querySelector("#userActive");

  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.codigo === parseInt(pinIngresado)
  );

  if (usuarioEncontrado) {
    responseReturn.innerHTML = "✅ Inicio de sesión exitoso";
    responseReturn.style.color = "green";
    userActive.innerHTML = `👤 <h3> Bienvenido nuevamente: ${usuarioEncontrado.nombre} </h3>`;
    intentosRestantes = 3;
    pin.value = "";
    usuarioEncontrado.sesion = true;
    guardarUsuarios(usuarios); // Guardar cambios
    entrarAlSistema(usuarioEncontrado);
  } else {
    // PIN incorrecto - restar un intento
    intentosRestantes--;
    if (intentosRestantes > 0) {
      responseReturn.innerHTML = `❌ PIN incorrecto. (${intentosRestantes} intentos restantes)`;
      responseReturn.style.color = "orange";
    } else {
      // Se acabaron los intentos
      responseReturn.innerHTML =
        "🚫 Cerrando Sistema. (Demasiados intentos fallidos)";
      responseReturn.style.color = "red";
      sistemaBloquedo = true;

      // Opcional: deshabilitar el formulario
      pin.disabled = true;
      formLogin.querySelector('button[type="submit"]').disabled = true;
    }
  }
  pin.value = "";
};

const iniciarSesion = () => {
  let sistemaBloquedo = false;

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const pinIngresado = pin.value;
    verificarUsuario(pinIngresado);

    if (sistemaBloquedo) {
      responseReturn.innerHTML = "Sistema bloqueado. Contacte al banco.";
      return false;
    }
  });

  return false;
};

const showBalance = (usuarioEncontrado) => {
  outputData.innerHTML = `Saldo actual: $${usuarioEncontrado.saldo}`;
};

const depositMoney = (usuarioEncontrado) => {
  outputData.innerHTML = ` <form id="formDeposit" action=""> 
                                <input type="number" name="" id="inputDeposit"> 
                                <button>Confirmar Deposito</button> 
                                </form>`;

  const formDeposit = document.querySelector("#formDeposit");
  const inputDeposit = document.querySelector("#inputDeposit");
  formDeposit.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputParse = parseFloat(inputDeposit.value);
    if (inputDeposit.value === "") {
      alertModal.innerHTML = "<h4> ❌ No se ingreso ningun monto </h4>";
      alertModal.style.display = "block";
      alertModal.style.color = "red";
    } else {
      usuarioEncontrado.saldo += inputParse;
      inputDeposit.value = "";
      alertModal.innerHTML = "<h4> ✔️ Operación realizada con exito! </h4>";
      alertModal.style.display = "block";
      alertModal.style.color = "green";
      mensaje = `Se deposito:  $${inputParse}`;
      usuarioEncontrado.historialTransacciones.push(mensaje);
      guardarUsuarios(usuarios); // Guardar cambios
    }
    setTimeout(deleteModal, 2000);
  });
};

const RemoveMoney = (usuarioEncontrado) => {
  outputData.innerHTML = ` <form id="formRemove" action=""> 
                                <input type="number" name="" id="inputRemove"> 
                                <button>Confirmar Retiro</button> 
                                </form>`;

  const formRemove = document.querySelector("#formRemove");
  const inputRemove = document.querySelector("#inputRemove");
  formRemove.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputParse = parseFloat(inputRemove.value);
    if (inputParse > usuarioEncontrado.saldo) {
      alertModal.innerHTML =
        "<h4> ❌ El monto ingresado excede al saldo actual </h4>";
      alertModal.style.display = "block";
      alertModal.style.color = "red";
    } else if (inputRemove.value === "") {
      alertModal.innerHTML = "<h4> ❌ No se ingreso ningun monto </h4>";
      alertModal.style.display = "block";
      alertModal.style.color = "red";
    } else {
      alertModal.innerHTML = "<h4> ✔️ Operación realizada con exito! </h4>";
      alertModal.style.display = "block";
      alertModal.style.color = "green";
      usuarioEncontrado.saldo -= inputParse;
      inputRemove.value = "";
      mensaje = `Se retiro:  $${inputParse}`;
      usuarioEncontrado.historialTransacciones.push(mensaje);
      guardarUsuarios(usuarios); // Guardar cambios
    }

    setTimeout(deleteModal, 2000);
  });
};

const viewTransaction = (usuarioEncontrado) => {
  let historial = "<h4>Historial</h4>";
  for (let i = 0; i < usuarioEncontrado.historialTransacciones.length; i++) {
    historial += `<ul> <li>${usuarioEncontrado.historialTransacciones[i]}</li> </ul>`;
  }

  outputData.innerHTML = historial;
};

const deleteModal = () => {
  alertModal.innerHTML = "";
};

const limpiarResponsReturn = () => {
  responseReturn.innerHTML = "";
};

const entrarAlSistema = (usuarioEncontrado) => {
  if (usuarioEncontrado.sesion) {
    formLogin.style.display = "none";
    menu.style.display = "grid";

    btnBalance.addEventListener("click", () => {
      showBalance(usuarioEncontrado);
    });

    btnDeposit.addEventListener("click", () => {
      depositMoney(usuarioEncontrado);
    });

    btnRemove.addEventListener("click", () => {
      RemoveMoney(usuarioEncontrado);
    });

    btnHistory.addEventListener("click", () => {
      viewTransaction(usuarioEncontrado);
    });

    btnSesion.addEventListener("click", () => {
      usuarioEncontrado.sesion = false;
      console.log(usuarioEncontrado.sesion);
      formLogin.style.display = "flex";
      menu.style.display = "none";

      userActive.innerHTML = ``;
      responseReturn.innerHTML = "✅ Sesión cerrada con exito";
      outputData.innerHTML = "";
      guardarUsuarios(usuarios); // Guardar cambios

      setTimeout(limpiarResponsReturn, 1000);
    });
  }
};

iniciarSesion();
