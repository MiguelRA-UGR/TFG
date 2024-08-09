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

export const defaultUsers = [
  {
    id: 1,
    name: "Martina",
    country: "Italy",
    status: "Searching destination",
    status_color: "#f5973d",
    avatar: "martina",
    flag: "it",
  },
  {
    id: 2,
    name: "Agnes",
    country: "Sweden",
    status: "Coming soon to Madrid",
    status_color: "#6691c3",
    avatar: "agnes",
    flag: "se",
  },
  {
    id: 3,
    name: "Eric",
    country: "France",
    status: "Living in Vienna",
    status_color: "#61bdb8",
    avatar: "eric",
    flag: "fr",
  },
];

export function timeElapsed(creationDate) {
  const now = new Date();
  const difference = now - creationDate;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

export function extractLatLngFromGoogleMaps(url) {
  //Se extrae la latitud y longitud con una expresión regular. Lo que sigue a la @ son las coordenadas
  const regex = /@([\d.-]+),([\d.-]+)/;
  const matches = url.match(regex);

  if (matches) {
    return {
      lat: parseFloat(matches[1]),
      long: parseFloat(matches[2]),
    };
  }else{
    return {
      lat: 0,
      long: 0,
    };
  }
}

export const cleanString = (str) => {
  return str
    .toLowerCase()                      
    .replace(/[\s\-]/g, '')              
    .normalize('NFD')                    
    .replace(/[\u0300-\u036f]/g, '')     
    .replace(/[^\wáéíóúüñ]/g, '');        
};

export const formatedNumber = (number) => {
  const numberString = number.toString();

  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};


export const climateOptions = [
  "Cold and Dry",
  "Cold and Wet",
  "Mild and Dry",
  "Mild and Wet",
  "Very Cold",
  "Very Cold and Snowy",
  "Cold with Frequent Snow",
  "Mild with Light Rain",
  "Cold with Occasional Snow",
  "Very Cold with Heavy Snow",
  "Chilly and Dry",
  "Chilly and Wet",
  "Freezing and Windy",
  "Cold and Foggy",
  "Bitterly Cold",
  "Cool and Dry",
  "Cool and Wet",
  "Cold with Icy Conditions",
  "Freezing Rain",
  "Extreme Cold",
  "Cold and Icy",
  "Hot and Dry",
  "Hot and Humid",
  "Warm and Dry",
  "Warm and Humid",
  "Very Hot",
  "Very Hot and Dry",
  "Hot with Frequent Thunderstorms",
  "Warm with Light Rain",
  "Hot and Sunny",
  "Warm with Occasional Thunderstorms",
  "Hot and Windy",
  "Warm and Pleasant",
  "Extremely Hot",
  "Hot with High Humidity",
  "Warm with High UV Index",
  "Very Warm and Dry",
  "Warm with Light Showers",
  "Hot and Muggy",
  "Warm and Breezy",
  "Hot with Intense Heatwaves",
  "Warm with Variable Conditions",
];

export const climateTypeOptions = [
  "Mediterranean",
  "Continental",
  "Oceanic",
  "Arid",
  "Tropical",
];

export const costOfLivingOptions = [
  "Very Low",
  "Low",
  "Moderate",
  "High",
  "Very High",
];