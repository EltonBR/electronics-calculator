const MILIMETRE = 1000
const CENTIMETRE = 100;
const METRE = 1;

const MHZ = 1000*1000;
const KHZ = 1000;
const HZ = 1;


const RES_UNITY_MULTIPLY = {
    ohm: 1,
    kohm: 1000,
    mohm: 1000000
}

function antennaGroundPlaneOneQuarterCalc(frequencyMHZ, resultType, velocityFactor = 0.95) {
    //Radiating elements in 45 degree to down use 4
    // credits https://m0ukd.com/calculators/quarter-wave-ground-plane-antenna-calculator/
    let radiatingElement = (((75*resultType) * velocityFactor) / frequencyMHZ).toFixed(1);
    let radials = (((84*resultType) * velocityFactor) / frequencyMHZ).toFixed(1);
    let wavelength = ((300*resultType) / frequencyMHZ).toFixed(1);
    return {
        radiatingElement,
        radials,
        wavelength
    };
}

function antennaDipoleHalfCalc(frequencyMhz, resultType, velocityFactor = 0.9517) {
    // half wave dipole impedance 73 Ohm
    const speedOfLight = 299792458; // Speed of light in meters per second
    // Calculate the wavelength
    const wavelength = (speedOfLight / (frequencyMhz * 1000000))*resultType; // Convert frequency from MHz to Hz
    // Calculate the quarter-wavelength
    const quarterWavelength = wavelength/4;
    // Calculate the dipole leg lengths
    return {
      leg1: (velocityFactor*quarterWavelength).toFixed(2),
      leg2: (velocityFactor*quarterWavelength).toFixed(2),
      wavelength: wavelength.toFixed(2)
    };
  }


function calcLowPassRC(resistance, capacitance, unit, resUnit) {
    let capacitanceInFarads;
    
    // Converter a capacitância para Farads com base na unidade fornecida
    switch (unit.toLowerCase()) {
        case 'pico':
            capacitanceInFarads = capacitance * 1e-12;
            break;
        case 'nano':
            capacitanceInFarads = capacitance * 1e-9;
            break;
        case 'micro':
            capacitanceInFarads = capacitance * 1e-6;
            break;
        case 'mili':
            capacitanceInFarads = capacitance * 1e-3;
            break;
        default:
            throw new Error("Unidade inválida. Use 'pico', 'nano', 'micro' ou 'mili'.");
    }

    // Fórmula da frequência de corte f_c = 1 / (2πRC)
    const frequencyCutoff = 1 / (2 * Math.PI * (resistance * RES_UNITY_MULTIPLY[resUnit]) * capacitanceInFarads);
    
    return frequencyCutoff;
}





function calcularFrequenciaLC(capacitancia, unidadeC, indutancia, unidadeL) {
    // Conversão de unidades para Farads e Henrys
    const unidadesC = {
        "p": 1e-12, // pico
        "n": 1e-9,  // nano
        "u": 1e-6,  // micro
        "f": 1      // farad
    };

    const unidadesL = {
        "p": 1e-12, // pico
        "n": 1e-9,  // nano
        "u": 1e-6,  // micro
        "m": 1e-3,  // mili
        "h": 1      // henry
    };

    // Converter valores para Farads e Henrys
    const C = capacitancia * (unidadesC[unidadeC.toLowerCase()] || 1);
    const L = indutancia * (unidadesL[unidadeL.toLowerCase()] || 1);

    if (!C || !L) {
        throw new Error("Capacitância ou indutância inválidas.");
    }

    // Calcular a frequência em Hz
    const frequencia = 1 / (2 * Math.PI * Math.sqrt(L * C));

    return frequencia;
}

// Exemplo de uso:
const capacitancia = 100;  // 100 picoFarads
const unidadeC = "p";      // pico
const indutancia = 10;     // 10 microHenrys
const unidadeL = "u";      // micro

const frequenciaResonancia = calcularFrequenciaLC(capacitancia, unidadeC, indutancia, unidadeL);
console.log(`Frequência de ressonância: ${frequenciaResonancia.toFixed(2)} Hz`);




console.log(antennaGroundPlaneOneQuarterCalc(1090, MILIMETRE));
console.log(antennaDipoleHalfCalc(27, METRE));


function lowHighPassFilter(form) {
    let divider = HZ;
    let unit = "HZ";

    switch(form.outputUnity.value) {
        case "HZ":
            divider = HZ;
            unit = "HZ";
        break;
        case "KHZ":
            divider = KHZ;
            unit = "KHZ";
        break;
        case "MHZ":
            divider = MHZ;
            unit = "MHZ";
        break;
    }

    console.log(form)
    let result = calcLowPassRC(form.resistance.value, form.capacitance.value, form.capUnity.value, form.resUnity.value);
    document.querySelector(".high-low-pass-filter-result").innerHTML = `Cutoff frequency: ${(result / divider).toFixed(2)} ${unit}`
}


function dipole(form) {

    let outputUnity;
    switch(form.outputUnity.value) {
        case "MM":
            outputUnity = MILIMETRE;
        break;
        case "CM":
            outputUnity = CENTIMETRE;
        break;
        case "M":
            outputUnity = METRE;
        break;
        default:
            outputUnity = MILIMETRE;
    }

    let result = antennaDipoleHalfCalc(form.frequency.value, outputUnity);

    document.querySelector(".dipole-result").innerHTML = ` Total Antenna Length: ${parseFloat(result.leg1*2).toFixed(2)} ${form.outputUnity.value} <br /> Leg Length: ${result.leg1} ${form.outputUnity.value} <br />
    Wavelength: ${result.wavelength} ${form.outputUnity.value}`;
}

function groundPlane(form) {
    let outputUnity;
    switch(form.outputUnity.value) {
        case "MM":
            outputUnity = MILIMETRE;
        break;
        case "CM":
            outputUnity = CENTIMETRE;
        break;
        case "M":
            outputUnity = METRE;
        break;
        default:
            outputUnity = MILIMETRE;
    }

    let result = antennaGroundPlaneOneQuarterCalc(form.frequency.value, outputUnity, form.velocityFactor.value);

    document.querySelector(".ground-plane-result").innerHTML = `
    A -> Radiator Element: ${result.radiatingElement} ${form.outputUnity.value} <br /> B -> Radials (4x in 45° down): ${result.radials} ${form.outputUnity.value} <br /> Wavelenght: ${result.wavelength} ${form.outputUnity.value}
    `;
}

















console.log("ue")
function submita(evt) {
    console.log("e")
    evt.preventDefault();
    console.log(evt)
}