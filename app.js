document.addEventListener('DOMContentLoaded', () => {
    const inputNumeroBase = document.getElementById('numeroBase');
    const btnCalcular = document.getElementById('calcularBtn');
    const errorMessage = document.getElementById('error-message');
    const resultadoContainer = document.getElementById('resultado');
    const procedimientoPasos = document.getElementById('procedimiento-pasos');
    const spanDigitoVerificador = document.getElementById('digitoVerificador');
    const spanNumeroCompleto = document.getElementById('numeroCompleto');

    btnCalcular.addEventListener('click', () => {
        const numeroBase = inputNumeroBase.value.trim();

        // Validación de entrada: solo números y no vacío 
        if (!/^\d+$/.test(numeroBase)) {
            mostrarError("Por favor, ingresa únicamente números válidos.");
            return;
        }

        ocultarError();
        procesarAlgoritmoLuhn(numeroBase);
    });

    function procesarAlgoritmoLuhn(numeroStr) {
        let sumaTotal = 0;
        let digitosOriginales = numeroStr.split('');
        let paso2Valores = [];
        let paso3Valores = [];

        // 1. Ir de derecha a izquierda duplicando cada segundo dígito [cite: 14]
        // Invertimos el arreglo para facilitar el recorrido desde la derecha
        let digitosInvertidos = [...digitosOriginales].reverse();

        digitosInvertidos.forEach((digitoStr, index) => {
            let digito = parseInt(digitoStr, 10);

            // Las posiciones pares en el array invertido (0, 2, 4...) corresponden 
            // a duplicar cada segundo dígito empezando desde la derecha
            if (index % 2 === 0) {
                let valorDuplicado = digito * 2;
                paso2Valores.push(valorDuplicado);

                // 2. Sumar los dígitos del resultado si es mayor a 9 [cite: 15]
                if (valorDuplicado > 9) {
                    let digito1 = Math.floor(valorDuplicado / 10);
                    let digito2 = valorDuplicado % 10;
                    let sumaDigitos = digito1 + digito2;
                    sumaTotal += sumaDigitos;
                    paso3Valores.push(`${digito1}+${digito2}`);
                } else {
                    sumaTotal += valorDuplicado;
                    paso3Valores.push(valorDuplicado.toString());
                }
            } else {
                // Los dígitos que no se duplican se suman tal cual [cite: 15]
                paso2Valores.push(digito);
                paso3Valores.push(digito.toString());
                sumaTotal += digito;
            }
        });

        // Revertimos los arreglos para mostrarlos en el orden original de izquierda a derecha
        paso2Valores.reverse();
        paso3Valores.reverse();

        // 3. Obtener el dígito de chequeo (x) multiplicando la suma por 9 y tomando el último dígito [cite: 19, 21, 22, 23]
        let multiplicacion = sumaTotal * 9;
        let digitoVerificador = multiplicacion % 10;

        mostrarResultados(digitosOriginales, paso2Valores, paso3Valores, sumaTotal, multiplicacion, digitoVerificador, numeroStr);
    }

    function mostrarResultados(originales, paso2, paso3, suma, multiplicacion, digitoVerificador, numeroOriginal) {
        // Generar el HTML de los pasos dinámicamente
        let htmlPasos = `
            <p><strong>Paso 1: Dígitos originales</strong><br> ${originales.join(' | ')}</p>
            <p><strong>Paso 2: Duplicar dígitos pares (de derecha a izquierda)</strong><br> ${paso2.join(' | ')}</p>
            <p><strong>Paso 3: Sumar los dígitos resultantes</strong><br> ${paso3.join(' | ')} = <strong>${suma}</strong></p>
            <p><strong>Paso 4: Cálculo del Módulo 10</strong><br> 
               Suma (${suma}) * 9 = ${multiplicacion}.<br>
               Tomando el último dígito de ${multiplicacion}, obtenemos el dígito de chequeo.</p>
        `;

        procedimientoPasos.innerHTML = htmlPasos;
        spanDigitoVerificador.textContent = digitoVerificador;
        spanNumeroCompleto.textContent = `${numeroOriginal}${digitoVerificador}`;
        
        resultadoContainer.style.display = 'block';
    }

    function mostrarError(mensaje) {
        errorMessage.textContent = mensaje;
        errorMessage.style.display = 'block';
        resultadoContainer.style.display = 'none';
    }

    function ocultarError() {
        errorMessage.style.display = 'none';
    }
});