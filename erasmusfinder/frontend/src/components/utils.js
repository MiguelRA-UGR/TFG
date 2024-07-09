//Devuelve un color dada la puntuación

export const getColorForScore = (score) => {
    if (score >= 9) {
      return "#00913f"; // Verde
    } else if (score >= 7) {
      return "#c6ce00"; // Verde-amarillo
    } else if (score >= 6) {
      return "#e6c619"; // Amarillo
    } else if (score >= 4) {
      return "#e25f23"; // Naranja
    } else if (score === -1) {
      return "#969696"; // Gris
    } else {
      return "#b81414"; // Rojo
    }
  };

  //Colores para el formulario de review

  export const ratingColors = [
    "#800000", "#b81414", "#e76e24", "#ed8e5c", "#e8bd33",
    "#e5e937", "#a0ec55", "#3ae620", "#16c839", "#2f9711"
  ];

  //Colores para los estados

  export const stateColors = {
    zero:"#969696",
    one:"#f5973d",
    two:"#6691c3",
    three:"#61bdb8"
};