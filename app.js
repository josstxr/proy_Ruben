document.addEventListener('DOMContentLoaded', () => {
    const inputNumero = document.getElementById('numeroCuenta');
    const btnGenerar = document.getElementById('btnGenerar');
    const pasosContainer = document.getElementById('pasosGenerados');
    const resultadoFinal = document.getElementById('resultadoFinal');
    const errorMessage = document.getElementById('error-message');

    btnGenerar.addEventListener('click', () => {
        const numeroBase = inputNumero.value.trim();
        
        // Validación: Solo números
        if (!/^\d+$/.test(numeroBase)) {
            errorMessage.textContent = "Por favor, ingresa únicamente números válidos.";
            errorMessage.style.display = 'block';
            pasosContainer.style.display = 'none';
            resultadoFinal.style.display = 'none';
            return;
        }

        errorMessage.style.display = 'none';
        calcularLuhnVisual(numeroBase);
    });

    function calcularLuhnVisual(numeroStr) {
        let digitosOriginales = numeroStr.split('');
        let sumaTotal = 0;
        let paso1HTML = '';
        let paso2HTML = '';
        let paso3HTML = '';

        // --- PASO 1: Dibujar dígitos originales ---
        digitosOriginales.forEach(d => {
            paso1HTML += `<span>${d}</span>`;
        });
        paso1HTML += `<span class="highlight">X</span>`;

        // --- LÓGICA DEL ALGORITMO (De derecha a izquierda) ---
        let digitosInvertidos = [...digitosOriginales].reverse();
        let paso2Valores = [];
        let paso3Valores = [];

        digitosInvertidos.forEach((digitoStr, index) => {
            let digito = parseInt(digitoStr, 10);

            // Posiciones pares en el invertido = duplicar
            if (index % 2 === 0) {
                let duplicado = digito * 2;
                paso2Valores.push({ val: duplicado, cambiado: true });

                if (duplicado > 9) {
                    let d1 = Math.floor(duplicado / 10);
                    let d2 = duplicado % 10;
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

        // Revertir para mostrar de izquierda a derecha
        paso2Valores.reverse();
        paso3Valores.reverse();

        // --- PASO 2: Dibujar duplicados ---
        paso2Valores.forEach(item => {
            let clase = item.cambiado ? 'class="changed"' : '';
            paso2HTML += `<span ${clase}>${item.val}</span>`;
        });
        paso2HTML += `<span class="highlight">X</span>`;

        // --- PASO 3: Dibujar sumas parciales ---
        paso3Valores.forEach(item => {
            let clase = item.cambiado ? 'class="changed"' : '';
            paso3HTML += `<span ${clase}>${item.val}</span>`;
        });
        paso3HTML += `<span class="result-sum">= ${sumaTotal}</span>`;

        // --- CÁLCULO FINAL DEL DÍGITO ---
        let digitoVerificador = (sumaTotal * 9) % 10;

        // Calculamos cuántas columnas necesita el grid (Dígitos + 1 espacio para la X/Suma)
        let columnasGrid = digitosOriginales.length + 1;

        // --- INYECCIÓN AL DOM ---
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

        resultadoFinal.innerHTML = `<h2>Dígito Verificador: <span class="final-digit">${digitoVerificador}</span></h2>`;
        
        // Mostrar los contenedores
        pasosContainer.style.display = 'flex';
        resultadoFinal.style.display = 'block';
    }
});