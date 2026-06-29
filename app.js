function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeAccountNumber(value) {
    return String(value || '').replace(/[\s-]/g, '').trim();
}

function validateAccountNumber(value) {
    const normalized = normalizeAccountNumber(value);
    return normalized.length > 0 && /^\d+$/.test(normalized);
}

function calculateLuhnDigit(numeroStr) {
    const normalized = normalizeAccountNumber(numeroStr);

    if (!validateAccountNumber(normalized)) {
        return null;
    }

    const digits = [...normalized].map(Number);
    let sumaTotal = 0;

    for (let index = digits.length - 1; index >= 0; index--) {
        let digito = digits[index];
        let posicion = (digits.length - 1 - index) % 2;

        if (posicion === 0) {
            let duplicado = digito * 2;
            sumaTotal += duplicado > 9 ? duplicado - 9 : duplicado;
        } else {
            sumaTotal += digito;
        }
    }

    return (10 - (sumaTotal % 10)) % 10;
}

function calcularLuhnVisual(numeroStr) {
    const normalized = normalizeAccountNumber(numeroStr);
    const digitosOriginales = [...normalized];
    let sumaTotal = 0;
    let paso1HTML = '';
    let paso2HTML = '';
    let paso3HTML = '';

    digitosOriginales.forEach(d => {
        paso1HTML += `<span>${escapeHTML(d)}</span>`;
    });
    paso1HTML += `<span class="highlight">X</span>`;

    const digitosInvertidos = [...digitosOriginales].reverse();
    const paso2Valores = [];
    const paso3Valores = [];

    digitosInvertidos.forEach((digitoStr, index) => {
        const digito = Number(digitoStr);

        if (index % 2 === 0) {
            const duplicado = digito * 2;
            paso2Valores.push({ val: duplicado, cambiado: true });

            if (duplicado > 9) {
                const d1 = Math.floor(duplicado / 10);
                const d2 = duplicado % 10;
                sumaTotal += (d1 + d2);
                paso3Valores.push({ val: `${d1}+${d2}`, cambiado: true });
            } else {
                sumaTotal += duplicado;
                paso3Valores.push({ val: duplicado, cambiado: true });
            }
        } else {
            sumaTotal += digito;
            paso2Valores.push({ val: digito, cambiado: false });
            paso3Valores.push({ val: digito, cambiado: false });
        }
    });

    paso2Valores.reverse();
    paso3Valores.reverse();

    paso2Valores.forEach(item => {
        const clase = item.cambiado ? 'class="changed"' : '';
        paso2HTML += `<span ${clase}>${escapeHTML(item.val)}</span>`;
    });
    paso2HTML += `<span class="highlight">X</span>`;

    paso3Valores.forEach(item => {
        const clase = item.changed ? 'class="changed"' : ''; // Corrección de propiedad item.cambiado
        paso3HTML += `<span ${clase}>${escapeHTML(item.val)}</span>`;
    });
    paso3HTML += `<span class="result-sum">= ${sumaTotal}</span>`;

    const digitoVerificador = (10 - (sumaTotal % 10)) % 10;
    const columnasGrid = digitosOriginales.length + 1;

    return { digitoVerificador, paso1HTML, paso2HTML, paso3HTML, columnasGrid, normalized };
}

function initApp() {
    const inputNumero = document.getElementById('numeroCuenta');
    const btnGenerar = document.getElementById('btnGenerar');
    const pasosContainer = document.getElementById('pasosGenerados');
    const resultadoFinal = document.getElementById('resultadoFinal');
    const errorMessage = document.getElementById('error-message');
    const resumenCuenta = document.getElementById('resumenCuenta');

    const showError = (message) => {
        errorMessage.textContent = message; // Seguro: usa textContent
        errorMessage.style.display = 'block';
        pasosContainer.style.display = 'none';
        resultadoFinal.style.display = 'none';
    };

    const clearError = () => {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    };

    inputNumero.addEventListener('input', () => {
        const cleanedValue = inputNumero.value.replace(/[^\d\s-]/g, '');
        if (cleanedValue !== inputNumero.value) {
            inputNumero.value = cleanedValue;
        }

        if (resumenCuenta) {
            const normalized = normalizeAccountNumber(inputNumero.value);
            resumenCuenta.textContent = normalized ? `Se analizará: ${escapeHTML(normalized)}` : 'Puedes ingresar espacios o guiones.';
        }
    });

    btnGenerar.addEventListener('click', () => {
        const numeroBase = normalizeAccountNumber(inputNumero.value);

        if (!numeroBase) {
            showError('Ingresa un número de cuenta para continuar.');
            return;
        }

        if (!validateAccountNumber(numeroBase)) {
            showError('Usa solo números, espacios o guiones.');
            return;
        }

        clearError();
        const resultado = calcularLuhnVisual(numeroBase);
        const { digitoVerificador, paso1HTML, paso2HTML, paso3HTML, columnasGrid, normalized } = resultado;

        pasosContainer.innerHTML = `
            <div class="step-box">
                <h2>1. Dígitos del número de cuenta</h2>
                <div class="grid-numbers" style="grid-template-columns: repeat(${columnasGrid}, 1fr);">
                    ${paso1HTML}
                </div>
            </div>
            <div class="step-box">
                <h2>2. Duplicar dígitos pares</h2>
                <div class="grid-numbers" style="grid-template-columns: repeat(${columnasGrid}, 1fr);">
                    ${paso2HTML}
                </div>
            </div>
            <div class="step-box">
                <h2>3. Sumar los dígitos</h2>
                <div class="grid-numbers" style="grid-template-columns: repeat(${columnasGrid}, 1fr);">
                    ${paso3HTML}
                </div>
            </div>
        `;

        resultadoFinal.innerHTML = `
            <h2>Dígito verificador</h2>
            <p class="result-summary">Número analizado: <strong>${escapeHTML(normalized)}</strong></p>
            <div class="final-digit">${escapeHTML(digitoVerificador)}</div>
        `;

        pasosContainer.style.display = 'flex';
        resultadoFinal.style.display = 'block';
    });

    inputNumero.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            btnGenerar.click();
        }
    });
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        normalizeAccountNumber,
        validateAccountNumber,
        calculateLuhnDigit
    };
}
