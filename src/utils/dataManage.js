export const roundNumber = (num, decimals = 2) => {
  let rounded = (num.toFixed(decimals));
  return rounded;
}

export const addIVA = (num) => {
  return (num * 1);
}

export const extraerIVA = (num) => {
  return (num * 0.13);
}

export const sumarDiasLaborables = (fechaInicial, diasASumar) => {
  var diasLaborables = [1, 2, 3, 4, 5]; // de lunes a viernes
  var fecha = new Date(fechaInicial.getTime());
  var diaSemana = fecha.getDay();

  // si es sábado o domingo, avanzamos al siguiente lunes
  if (diaSemana === 6) { // sábado
    fecha.setDate(fecha.getDate() + 2);
  } else if (diaSemana === 0) { // domingo
    fecha.setDate(fecha.getDate() + 1);
  }

  // sumamos los días laborables
  var diasSumados = 0;
  while (diasSumados < diasASumar) {
    fecha.setDate(fecha.getDate() + 1);
    if (diasLaborables.includes(fecha.getDay())) {
      diasSumados++;
    }
  }

  return fecha;
}
