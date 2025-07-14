let saldo = 5000;

let activo = true;
let historialTransacciones = [];
// historialTransacciones.push(saldo);

const iniciarSesion = () => {
  for (let i = 3; i > 0; i--) {
    let PIN = parseInt(prompt("Ingrese su PIN (solo caracteres numéricos):"));
    if (PIN === 777) {
      alert("Bienvenido al sistema. (Inicio de sesión exitoso)");
      return true;
    } else {
      alert("PIN incorrecto. (" + (i - 1) + " intentos restantes)");
    }
  }
  alert("Cerrando Sistema. (Demasiados intentos fallidos)");
  return false;
};

const mostrarMenu = () => {
  while (activo) {
    let option = parseInt(
      prompt(`
        Menu de opciones
        ----------------------
        Seleccione una opcion:
        (Ingresar un numero de 1 al 5)
        1- Consultar saldo.
        2- Depositar dinero.
        3- Retirar dinero.
        4- Mostrar movimientos.
        5- Cerrar sesion.`)
    );

    switch (option) {
      case 1:
        consultarSaldo();
        break;
      case 2:
        depositarDinero();
        break;
      case 3:
        retirarDinero();
        break;
      case 4:
        mostrarMovimientos();
        break;
      case 5:
        cerrarSesion();
        break;
      default:
        alert("Opcion invalida. (Ingresar un numero correcto)");
    }
  }
};

const consultarSaldo = () => {
  alert("Su saldo actual es de: $" + saldo);
  return mostrarMenu();
};

const depositarDinero = () => {
  let dineroDepositado = parseFloat(
    prompt("Ingrese el monto que desee depositar:")
  );

  if (dineroDepositado) {
    saldo = saldo + dineroDepositado;
    depositoExitoso = "Se deposito $" + saldo;
    historialTransacciones.push(depositoExitoso);
    alert("Operacion realizada con exito!");
    return mostrarMenu();
  } else {
    alert("Operacion Fallida. (El monto ingresado no es correcto)");
    depositarDinero();
  }
};

const retirarDinero = () => {
  let dineroRetirado = parseFloat(
    prompt("Ingrese el monto que desee retirar: (Saldo actual $" + saldo + ")")
  );
  if (isNaN(dineroRetirado) || dineroRetirado <= 0) {
    alert(
      "Operacion Fallida. (El monto ingresado no es valido. (Ingrese numeros)"
    );
    return retirarDinero();
  } else if (dineroRetirado > saldo) {
    alert("Operacion Fallida. (El monto ingresado excede a su saldo actual)");
    return retirarDinero();
  } else {
    saldo = saldo - dineroRetirado;
    retiroExitoso = "Se retiro $" + saldo;
    historialTransacciones.push(retiroExitoso);
    alert("Operacion realizada con exito!");
    return mostrarMenu();
  }
};

const mostrarMovimientos = () => {
  let movimientos = "Historial de movimientos \n\n";

  for (let i = 0; i < historialTransacciones.length; i++) {
    movimientos += "- " + historialTransacciones[i] + "\n";
  }

  alert(movimientos);
};

const cerrarSesion = () => {
  const response = confirm("¿Está seguro que desea cerrar la sesión?");
  if (response) {
    alert("Sesión cerrada. Hasta luego.");
    activo = false;
  } else {
    mostrarMenu(); // Vuelve al menú si cancela
  }
};

if (iniciarSesion()) {
  mostrarMenu();
}
