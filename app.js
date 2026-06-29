function normalizeAccountNumber(value) {
    return String(value || '').replace(/[\s-]/g, '').trim();
}

function validateAccountNumber(value) {
    const normalized = normalizeAccountNumber(value);
    return normalized.length > 0 && /^\d+$/.test(normalized);
}

function parseAccountNumbers(value) {
    return String(value || '')
        .split(',')
        .map(item => normalizeAccountNumber(item))
        .filter(Boolean);
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

    return (sumaTotal * 9) % 10;
}

function calcularLuhnVisual(numeroStr) {
    const normalized = normalizeAccountNumber(numeroStr);
    const digitosOriginales = [...normalized];
    let sumaTotal = 0;
    let paso1HTML = '';
    let paso2HTML = '';
    let paso3HTML = '';

    digitosOriginales.forEach(d => {
        paso1HTML += `<span>${d}</span>`;
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
        paso2HTML += `<span ${clase}>${item.val}</span>`;
    });
    paso2HTML += `<span class="highlight">X</span>`;

    paso3Valores.forEach(item => {
        const clase = item.cambiado ? 'class="changed"' : '';
        paso3HTML += `<span ${clase}>${item.val}</span>`;
    });
    paso3HTML += `<span class="result-sum">= ${sumaTotal}</span>`;

    const digitoVerificador = (sumaTotal * 9) % 10;
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
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        pasosContainer.style.display = 'none';
        resultadoFinal.style.display = 'none';
    };

    const clearError = () => {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    };

    inputNumero.addEventListener('input', () => {
        const cleanedValue = inputNumero.value.replace(/[^\d\s,-]/g, '');

        if (cleanedValue !== inputNumero.value) {
            inputNumero.value = cleanedValue;
        }

        if (resumenCuenta) {
            const cuentas = parseAccountNumbers(inputNumero.value);
            if (cuentas.length > 1) {
                resumenCuenta.textContent = `Se analizarán ${cuentas.length} números separados por comas.`;
            } else if (cuentas.length === 1) {
                resumenCuenta.textContent = `Se analizará: ${cuentas[0]}`;
            } else {
                resumenCuenta.textContent = 'Puedes ingresar espacios, guiones o comas.';
            }
        }
    });

    btnGenerar.addEventListener('click', () => {
        const cuentas = parseAccountNumbers(inputNumero.value);

        if (cuentas.length === 0) {
            showError('Ingresa un número de cuenta para continuar.');
            return;
        }

        const cuentaInvalida = cuentas.find(cuenta => !validateAccountNumber(cuenta));
        if (cuentaInvalida) {
            showError('Usa solo números, espacios, guiones o comas.');
            return;
        }

        clearError();
        const resultados = cuentas.map(calcularLuhnVisual);

        pasosContainer.innerHTML = resultados.map((resultado, index) => {
            const { digitoVerificador, paso1HTML, paso2HTML, paso3HTML, columnasGrid, normalized } = resultado;
            return `
                <div class="step-box">
                    <h2>${index + 1}. ${normalized}</h2>
                    <div class="step-subtitle">Dígitos del número de cuenta</div>
                    <div class="grid-numbers" style="grid-template-columns: repeat(${columnasGrid}, 1fr);">
                        ${paso1HTML}
                    </div>
                    <div class="step-subtitle">Duplicar dígitos pares</div>
                    <div class="grid-numbers" style="grid-template-columns: repeat(${columnasGrid}, 1fr);">
                        ${paso2HTML}
                    </div>
                    <div class="step-subtitle">Sumar los dígitos</div>
                    <div class="grid-numbers" style="grid-template-columns: repeat(${columnasGrid}, 1fr);">
                        ${paso3HTML}
                    </div>
                </div>
            `;
        }).join('');

        resultadoFinal.innerHTML = `
            <h2>${resultados.length > 1 ? 'Dígitos verificadores' : 'Dígito verificador'}</h2>
            <p class="result-summary">Números analizados: <strong>${resultados.map(item => item.normalized).join(', ')}</strong></p>
            <div class="results-list">
                ${resultados.map(item => `
                    <div class="result-item">
                        <span class="account-number">${item.normalized}</span>
                        <div class="final-digit">${item.digitoVerificador}</div>
                    </div>
                `).join('')}
            </div>
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
        parseAccountNumbers,
        calculateLuhnDigit
    };
}