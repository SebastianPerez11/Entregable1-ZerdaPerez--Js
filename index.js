// Importar SweetAlert2 desde CDN (agregar esto al HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert2/11.7.32/sweetalert2.all.min.js"></script>)

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
let usuarios = []; // Inicializar como array vacío

// Función para cargar usuarios desde data.json
const cargarUsuarios = async () => {
  try {
    const response = await fetch('./data/data.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const usuariosDesdeJson = await response.json();
    
    // Verificar si hay usuarios en localStorage
    const usuariosGuardados = localStorage.getItem("usuarios");
    if (usuariosGuardados) {
      return JSON.parse(usuariosGuardados);
    } else {
      // Si no hay usuarios en localStorage, usar los del JSON y guardarlos
      localStorage.setItem("usuarios", JSON.stringify(usuariosDesdeJson));
      return usuariosDesdeJson;
    }
  } catch (error) {
    console.error('Error al cargar usuarios desde data.json:', error);
    // Mostrar error con SweetAlert2
    Swal.fire({
      icon: 'error',
      title: 'Error de carga',
      text: 'No se pudo cargar el archivo data.json. Verifique que el archivo existe y el servidor está funcionando.',
      confirmButtonColor: '#d33'
    });
    throw error;
  }
};

// Función para guardar usuarios en localStorage
const guardarUsuarios = (usuarios) => {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

// Función para inicializar la aplicación
const inicializarApp = async () => {
  try {
    usuarios = await cargarUsuarios();
    iniciarSesion();
  } catch (error) {
    responseReturn.innerHTML = "❌ Error al cargar datos. Verifique que el archivo data.json existe.";
    responseReturn.style.color = "red";
  }
};

const verificarUsuario = (pinIngresado) => {
  const userActive = document.querySelector("#userActive");

  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.codigo === parseInt(pinIngresado)
  );

  if (usuarioEncontrado) {
    responseReturn.innerHTML = "✅ Inicio de sesión exitoso";
    responseReturn.style.color = "green";
    userActive.innerHTML = ` <p> ${usuarioEncontrado.nombre[0]} </p>`;
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
                                <input class="inputAction" type="number" name="" id="inputDeposit" placeholder="Ingrese monto a depositar"> 
                                <button class="inputSubmit">Confirmar Deposito</button> 
                                </form>`;

  const formDeposit = document.querySelector("#formDeposit");
  const inputDeposit = document.querySelector("#inputDeposit");
  formDeposit.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputParse = parseFloat(inputDeposit.value);
    
    if (inputDeposit.value === "" || isNaN(inputParse) || inputParse <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error en depósito',
        text: 'Debe ingresar un monto válido mayor a 0',
        confirmButtonColor: '#d33'
      });
    } else {
      usuarioEncontrado.saldo += inputParse;
      inputDeposit.value = "";
      Swal.fire({
        icon: 'success',
        title: '¡Depósito exitoso!',
        text: `Se depositaron ${inputParse} correctamente`,
        confirmButtonColor: '#28a745',
        timer: 2000
      });
      mensaje = `Se deposito: ${inputParse}`;
      usuarioEncontrado.historialTransacciones.push(mensaje);
      guardarUsuarios(usuarios);
    }
  });
};

const RemoveMoney = (usuarioEncontrado) => {
  outputData.innerHTML = ` <form id="formRemove" action=""> 
                                <input class="inputAction" type="number" name="" id="inputRemove" placeholder="Ingrese monto a retirar"> 
                                <button class="inputSubmit">Confirmar Retiro</button> 
                                </form>`;

  const formRemove = document.querySelector("#formRemove");
  const inputRemove = document.querySelector("#inputRemove");
  formRemove.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputParse = parseFloat(inputRemove.value);
    
    if (inputRemove.value === "" || isNaN(inputParse) || inputParse <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error en retiro',
        text: 'Debe ingresar un monto válido mayor a 0',
        confirmButtonColor: '#d33'
      });
    } else if (inputParse > usuarioEncontrado.saldo) {
      Swal.fire({
        icon: 'warning',
        title: 'Saldo insuficiente',
        text: `El monto ingresado (${inputParse}) excede su saldo actual (${usuarioEncontrado.saldo})`,
        confirmButtonColor: '#ffc107'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Retiro exitoso!',
        text: `Se retiraron ${inputParse} correctamente`,
        confirmButtonColor: '#28a745',
        timer: 2000
      });
      usuarioEncontrado.saldo -= inputParse;
      inputRemove.value = "";
      mensaje = `Se retiro: ${inputParse}`;
      usuarioEncontrado.historialTransacciones.push(mensaje);
      guardarUsuarios(usuarios);
    }
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
    menu.style.display = "flex";

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
      Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Está seguro que desea cerrar su sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          usuarioEncontrado.sesion = false;
          formLogin.style.display = "flex";
          menu.style.display = "none";
          userActive.innerHTML = ``;
          responseReturn.innerHTML = "✅ Sesión cerrada con éxito";
          outputData.innerHTML = "";
          guardarUsuarios(usuarios);
          
          Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Ha cerrado sesión correctamente',
            timer: 1500,
            showConfirmButton: false
          });
          
          setTimeout(limpiarResponsReturn, 2000);
        }
      });
    });
  }
};

// Inicializar la aplicación cuando se carga la página
inicializarApp();