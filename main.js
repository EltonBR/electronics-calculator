const MILIMETRE = 1000
const CENTIMETRE = 100;
const METRE = 1;

const LENGTH_UNITS = {
    CM: 100,
    MM: 1000,
    M: 1
}

const OUTPUT_UNITY_DIVIDER = {
    HZ: 1,
    KHZ: 1000,
    MHZ: 1000*1000
}


const RES_UNITY_MULTIPLY = {
    ohm: 1,
    kohm: 1000,
    mohm: 1000000
}

function antennaGroundPlaneOneQuarterCalc(frequencyMHZ, resultType, velocityFactor = 0.95) {
    //Radiating elements in 45 degree to down use 4
    // credits https://m0ukd.com/calculators/quarter-wave-ground-plane-antenna-calculator/
    let radiatingElement = (((75*resultType) * velocityFactor) / frequencyMHZ).toFixed(2);
    let radials = (((84*resultType) * velocityFactor) / frequencyMHZ).toFixed(2);
    let wavelength = ((300*resultType) / frequencyMHZ).toFixed(2);
    return {
        radiatingElement,
        radials,
        wavelength
    };
}

function antennaDipoleHalfCalc(frequencyMhz, resultType, velocityFactor = 0.9517) {

    const speedOfLight = 299792458;
    const wavelength = (speedOfLight / (frequencyMhz * 1000000))*resultType;
    const quarterWavelength = wavelength/4;

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
    };

    const unidadesL = {
        "p": 1e-12, // pico
        "n": 1e-9,  // nano
        "u": 1e-6,  // micro
        "m": 1e-3,  // mili
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


function LCTank(form) {
    let result = calcularFrequenciaLC(form.capacitance.value, form.capUnity.value, form.inductance.value, form.lUnity.value);
    document.querySelector(`.lc-tank-freq-result`).innerHTML = `${(result/OUTPUT_UNITY_DIVIDER[form.outputUnity.value]).toFixed(3)} ${form.outputUnity.value}`;
}

function lowHighPassFilter(form) {
    const divider = OUTPUT_UNITY_DIVIDER[form.outputUnity.value];
    const result = calcLowPassRC(form.resistance.value, form.capacitance.value, form.capUnity.value, form.resUnity.value);
    document.querySelector(".high-low-pass-filter-result").innerHTML = `Cutoff frequency: ${(result / divider).toFixed(3)} ${form.outputUnity.value}`
}

function dipole(form) {
    const outputUnity = LENGTH_UNITS[form.outputUnity.value];
    const result = antennaDipoleHalfCalc(form.frequency.value, outputUnity);

    document.querySelector(".dipole-result").innerHTML = ` Total Antenna Length: ${parseFloat(result.leg1*2).toFixed(4)} ${form.outputUnity.value} <br /> Leg Length: ${result.leg1} ${form.outputUnity.value} <br />
    Wavelength: ${result.wavelength} ${form.outputUnity.value}`;
}

function groundPlane(form) {
    const outputUnity = LENGTH_UNITS[form.outputUnity.value];
    let result = antennaGroundPlaneOneQuarterCalc(form.frequency.value, outputUnity, form.velocityFactor.value);
    document.querySelector(".ground-plane-result").innerHTML = `
    A -> Radiator Element: ${result.radiatingElement} ${form.outputUnity.value} <br /> B -> Radials (4x in 45° down): ${result.radials} ${form.outputUnity.value} <br /> Wavelenght: ${result.wavelength} ${form.outputUnity.value}
    `;
}