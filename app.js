document.addEventListener('DOMContentLoaded', () => {
    // 1. Vinculación exacta con los IDs de tu interfaz gráfica
    const inputNumeroBase = document.getElementById('accountNumber') || document.getElementById('numeroBase');
    const btnCalcular = document.getElementById('calcularBtn') || document.querySelector('button');
    const stepsContainer = document.getElementById('stepsContainer') || document.getElementById('resultado');
    
    const grid1 = document.getElementById('gridStep1');
    const grid2 = document.getElementById('gridStep2');
    const grid3 = document.getElementById('gridStep3');
    const finalDigitSpan = document.getElementById('finalDigit') || document.getElementById('digitoVerificador');

    if (!btnCalcular || !inputNumeroBase) return;

    btnCalcular.addEventListener('click', () => {
        const numeroBase = inputNumeroBase.value.trim();

        // Validación y sanitización: solo números sin espacios ni guiones
        const cleanInput = numeroBase.replace(/[^0-9]/g, '');

        if (!cleanInput) {
            alert("Por favor, ingresa únicamente números válidos.");
            return;
        }

        procesarAlgoritmoLuhn(cleanInput);
    });

    function procesarAlgoritmoLuhn(numeroStr) {
        let totalSum = 0;
        let digits = numeroStr.split('').map(Number);
        let len = digits.length;

        // Limpiamos los contenedores de cuadrículas antes de realizar un nuevo cálculo
        if(grid1) grid1.innerHTML = '';
        if(grid2) grid2.innerHTML = '';
        if(grid3) grid3.innerHTML = '';

        // Recorremos los dígitos de izquierda a derecha preservando el orden visual del Mockup
        for (let i = 0; i < len; i++) {
            let d = digits[i];

            // PASO 1: Inyectar el dígito original en la primera cuadrícula
            if(grid1) grid1.innerHTML += `<span>${d}</span>`;

            // Determinamos la distancia desde la derecha (el extremo antes de la 'X')
            let distanceFromRight = len - 1 - i;

            // Corregido: Duplicar posiciones alternas de manera que el elemento inmediato a la izquierda de 'X' se duplique
            if (distanceFromRight % 2 === 0) {
                let doubled = d * 2;
                if(grid2) grid2.innerHTML += `<span class="changed">${doubled}</span>`;

                // PASO 3: Sumar los componentes individuales o restar 9 [cite: 15, 33]
                if (doubled > 9) {
                    let d1 = Math.floor(doubled / 10);
                    let d2 = doubled % 10;
                    let singleSum = d1 + d2;
                    totalSum += singleSum;
                    if(grid3) grid3.innerHTML += `<span class="changed">${d1}+${d2}</span>`;
                } else {
                    totalSum += doubled;
                    if(grid3) grid3.innerHTML += `<span class="changed">${doubled}</span>`;
                }
            } else {
                // Las posiciones que no se duplican pasan exactamente igual [cite: 15]
                if(grid2) grid2.innerHTML += `<span>${d}</span>`;
                if(grid3) grid3.innerHTML += `<span>${d}</span>`;
                totalSum += d;
            }
        }

        // Incorporación de elementos de control visual fijos solicitados en el diseño
        if(grid1) grid1.innerHTML += `<span class="highlight">X</span>`;
        if(grid2) grid2.innerHTML += `<span class="highlight">X</span>`;
        if(grid3) grid3.innerHTML += `<span class="result-sum">= ${totalSum}</span>`;

        // Cálculo final del Dígito de Control usando el complemento a 10 [cite: 25]
        let unidades = totalSum % 10;
        let digitoVerificador = unidades === 0 ? 0 : 10 - unidades;

        // Mostrar el resultado en el contenedor destacado
        if (finalDigitSpan) {
            finalDigitSpan.innerText = digitoVerificador;
        }

        // Hacemos visible el panel completo con el desglose paso a paso
        if (stepsContainer) {
            stepsContainer.style.display = 'flex';
            stepsContainer.classList.remove('hidden'); // Soporte por si usas clases utilitarias
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. Vinculación exacta con los IDs de tu interfaz gráfica
    const inputNumeroBase = document.getElementById('accountNumber') || document.getElementById('numeroBase');
    const btnCalcular = document.getElementById('calcularBtn') || document.querySelector('button');
    const stepsContainer = document.getElementById('stepsContainer') || document.getElementById('resultado');
    
    const grid1 = document.getElementById('gridStep1');
    const grid2 = document.getElementById('gridStep2');
    const grid3 = document.getElementById('gridStep3');
    const finalDigitSpan = document.getElementById('finalDigit') || document.getElementById('digitoVerificador');

    if (!btnCalcular || !inputNumeroBase) return;

    // === BLOQUEO EN TIEMPO REAL: NO PERMITIR LETRAS NI SÍMBOLOS ===
    inputNumeroBase.addEventListener('input', (e) => {
        // Reemplaza instantáneamente cualquier caracter que NO sea un número del 0 al 9
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    btnCalcular.addEventListener('click', () => {
        const numeroBase = inputNumeroBase.value.trim();

        // Validación extra por si acaso
        if (!numeroBase) {
            alert("Por favor, ingresa únicamente números válidos.");
            return;
        }

        procesarAlgoritmoLuhn(numeroBase);
    });

    function procesarAlgoritmoLuhn(numeroStr) {
        let totalSum = 0;
        let digits = numeroStr.split('').map(Number);
        let len = digits.length;

        // Limpiamos los contenedores de cuadrículas antes de realizar un nuevo cálculo
        if(grid1) grid1.innerHTML = '';
        if(grid2) grid2.innerHTML = '';
        if(grid3) grid3.innerHTML = '';

        // Recorremos los dígitos de izquierda a derecha preservando el orden visual del Mockup
        for (let i = 0; i < len; i++) {
            let d = digits[i];

            // PASO 1: Inyectar el dígito original en la primera cuadrícula
            if(grid1) grid1.innerHTML += `<span>${d}</span>`;

            // Determinamos la distancia desde la derecha (el extremo antes de la 'X')
            let distanceFromRight = len - 1 - i;

            // Duplicar posiciones alternas de manera que el elemento inmediato a la izquierda de 'X' se duplique [cite: 14]
            if (distanceFromRight % 2 === 0) {
                let doubled = d * 2;
                if(grid2) grid2.innerHTML += `<span class="changed">${doubled}</span>`;

                // PASO 3: Sumar los componentes individuales o restar 9 [cite: 15, 33]
                if (doubled > 9) {
                    let d1 = Math.floor(doubled / 10);
                    let d2 = doubled % 10;
                    let singleSum = d1 + d2;
                    totalSum += singleSum;
                    if(grid3) grid3.innerHTML += `<span class="changed">${d1}+${d2}</span>`;
                } else {
                    totalSum += doubled;
                    if(grid3) grid3.innerHTML += `<span class="changed">${doubled}</span>`;
                }
            } else {
                // Las posiciones que no se duplican pasan exactamente igual [cite: 15]
                if(grid2) grid2.innerHTML += `<span>${d}</span>`;
                if(grid3) grid3.innerHTML += `<span>${d}</span>`;
                totalSum += d;
            }
        }

        // Incorporación de elementos de control visual fijos solicitados en el diseño [cite: 40]
        if(grid1) grid1.innerHTML += `<span class="highlight">X</span>`;
        if(grid2) grid2.innerHTML += `<span class="highlight">X</span>`;
        if(grid3) grid3.innerHTML += `<span class="result-sum">= ${totalSum}</span>`;

        // Cálculo final del Dígito de Control usando el complemento a 10 [cite: 25]
        let unidades = totalSum % 10;
        let digitoVerificador = unidades === 0 ? 0 : 10 - unidades;

        // Mostrar el resultado en el contenedor destacado [cite: 40]
        if (finalDigitSpan) {
            finalDigitSpan.innerText = digitoVerificador;
        }

        // Hacemos visible el panel completo con el desglose paso a paso
        if (stepsContainer) {
            stepsContainer.style.display = 'flex';
            stepsContainer.classList.remove('hidden'); 
        }
    }
});