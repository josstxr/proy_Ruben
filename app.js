document.addEventListener('DOMContentLoaded', () => {
    const numeroBaseInput = document.getElementById('numeroBase');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultadoSection = document.getElementById('resultado');
    const procedimientoPasosDiv = document.getElementById('procedimiento-pasos');
    const digitoVerificadorSpan = document.getElementById('digitoVerificador');
    const numeroCompletoSpan = document.getElementById('numeroCompleto');
    const errorMessageDiv = document.getElementById('error-message');

    calcularBtn.addEventListener('click', () => {
        const numeroBase = numeroBaseInput.value.trim();

        // 1. Validación de entrada
        if (!/^[0-9]+$/.test(numeroBase)) {
            errorMessageDiv.textContent = 'Error: Por favor, ingresa solo dígitos numéricos.';
            errorMessageDiv.style.display = 'block';
            resultadoSection.style.display = 'none';
            return;
        }
        
        errorMessageDiv.style.display = 'none';
        
        // Limpiar resultados anteriores
        procedimientoPasosDiv.innerHTML = '';

        // 2. Implementación del Algoritmo Módulo 11
        const digitos = numeroBase.split('').reverse();
        const pesos = [2, 3, 4, 5, 6, 7];
        let suma = 0;
        let pasoAPasoHTML = '';

        pasoAPasoHTML += `<p>1. Número invertido: <strong>${digitos.join('')}</strong></p>`;
        
        let multiplicaciones = [];
        digitos.forEach((digito, index) => {
            const peso = pesos[index % pesos.length];
            const producto = parseInt(digito) * peso;
            suma += producto;
            multiplicaciones.push(`${digito} * ${peso} = ${producto}`);
        });

        pasoAPasoHTML += `<p>2. Multiplicación de cada dígito por la serie de pesos (2,3,4,5,6,7,...):<br><strong>${multiplicaciones.join(' | ')}</strong></p>`;
        pasoAPasoHTML += `<p>3. Suma de los productos: <strong>${suma}</strong></p>`;
        
        const resto = suma % 11;
        pasoAPasoHTML += `<p>4. Cálculo del módulo 11 de la suma: ${suma} % 11 = <strong>${resto}</strong></p>`;

        let digitoVerificador = 11 - resto;
        pasoAPasoHTML += `<p>5. Resta del resultado a 11: 11 - ${resto} = <strong>${digitoVerificador}</strong></p>`;

        // Casos especiales
        if (digitoVerificador === 11) {
            digitoVerificador = 0;
            pasoAPasoHTML += `<p>6. Caso especial: Como el resultado es 11, el dígito verificador es <strong>0</strong>.</p>`;
        } else if (digitoVerificador === 10) {
            digitoVerificador = 'K';
            pasoAPasoHTML += `<p>6. Caso especial: Como el resultado es 10, el dígito verificador es <strong>K</strong>.</p>`;
        } else {
             pasoAPasoHTML += `<p>6. El dígito verificador es <strong>${digitoVerificador}</strong>.</p>`;
        }

        // 3. Actualización del DOM
        procedimientoPasosDiv.innerHTML = pasoAPasoHTML;
        digitoVerificadorSpan.textContent = digitoVerificador;
        numeroCompletoSpan.textContent = `${numeroBase}-${digitoVerificador}`;
        resultadoSection.style.display = 'block';
    });
});
