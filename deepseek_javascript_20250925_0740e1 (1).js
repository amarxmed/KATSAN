// DOM элементы
const materialTypeRadios = document.querySelectorAll('input[name="materialType"]');
const absorbableParams = document.getElementById('absorbableParams');
const nonAbsorbableParams = document.getElementById('nonAbsorbableParams');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const fullResult = document.getElementById('fullResult');
const codeResult = document.getElementById('codeResult');
const resultFormatRadios = document.querySelectorAll('input[name="resultFormat"]');
const copyBtn = document.getElementById('copyBtn');

// Словари для преобразования значений
const uspToMetric = {
    '01': '5', '02': '4', '03': '3.5', '04': '3', 
    '05': '2', '06': '1.5', '07': '1', '08': '0.7'
};

const materialNames = {
    'A': 'ALCASORB', 'B': 'ALCASORB RAPID', 'C': 'ALCALACTINE', 
    'D': 'ALCALACTINE RAPID', 'G': 'ALCALACTONE', 'H': 'ALCADINONE', 'J': 'ALCADINONE'
};

const needleTypeNames = {
    '1': {en: 'TAPER POINT', ru: 'колющая'},
    '2': {en: 'BLUNT', ru: 'тупоконечная'},
    '3': {en: 'CUTTING EDGE', ru: 'режущая'},
    '4': {en: 'REVERSE CUTTING', ru: 'обратно-режущая'},
    '5': {en: 'TAPERCUT', ru: 'колюще-режущая'},
    '6': {en: 'DIAMOND', ru: 'даймонд'},
    '7': {en: 'LANCET', ru: 'ланцетовидная'},
    '0': {en: 'NO NEEDLE', ru: 'без иглы'}
};

const needleShapeNames = {
    'Z': '1/2',
    'V': '3/8', 
    'U': '5/8',
    'R': '1/4',
    'J': 'J-игла',
    'S': 'прямая'
};

const nonAbsMaterialNames = {
    'SK': 'ШЕЛК',
    'NL': 'НЕЙЛОН', 
    'PP': 'ПОЛИПРОПИЛЕН',
    'PE': 'ПОЛИЭСТЕР',
    'SS': 'СТАЛЬ',
    'CC': 'КЕТГУТ ХРОМИРОВАННЫЙ',
    'PC': 'КЕТГУТ ОБЫЧНЫЙ'
};

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переключателя типа материала
    materialTypeRadios.forEach(radio => {
        radio.addEventListener('change', toggleMaterialParams);
    });
    
    // Обработчик кнопки генерации
    generateBtn.addEventListener('click', generateArticle);
    
    // Обработчик переключателя формата результата
    resultFormatRadios.forEach(radio => {
        radio.addEventListener('change', toggleResultFormat);
    });
    
    // Обработчик кнопки копирования
    copyBtn.addEventListener('click', copyResult);
    
    // Инициализируем правильное отображение параметров
    toggleMaterialParams();
});

// Переключение между блоками параметров
function toggleMaterialParams() {
    const selectedType = document.querySelector('input[name="materialType"]:checked').value;
    
    if (selectedType === 'absorbable') {
        absorbableParams.style.display = 'block';
        nonAbsorbableParams.style.display = 'none';
    } else {
        absorbableParams.style.display = 'none';
        nonAbsorbableParams.style.display = 'block';
    }
    
    // Скрываем результаты при смене типа материала
    resultSection.style.display = 'none';
}

// Генерация артикула
function generateArticle() {
    const materialType = document.querySelector('input[name="materialType"]:checked').value;
    
    let article, description;
    
    if (materialType === 'absorbable') {
        ({article, description} = generateAbsorbableArticle());
    } else {
        ({article, description} = generateNonAbsorbableArticle());
    }
    
    // Обновляем результаты
    fullResult.textContent = description;
    codeResult.textContent = article;
    
    // Показываем секцию результатов
    resultSection.style.display = 'block';
    
    // Показываем выбранный формат
    toggleResultFormat();
}

// Генерация артикула для рассасывающихся материалов
function generateAbsorbableArticle() {
    const material = document.getElementById('absorbableMaterial').value;
    const usp = document.getElementById('uspSize').value;
    const needleLength = document.getElementById('needleLength').value.padStart(2, '0');
    const needleShape = document.getElementById('needleShape').value;
    const needleType = document.getElementById('needleType').value;
    const attachment = document.getElementById('needleAttachment').value;
    const threadLength = document.getElementById('threadLength').value;
    
    // Генерация артикула
    const article = `${material}${usp}${needleLength}${needleShape}${needleType}${attachment}${threadLength}`;
    
    // Генерация описания
    const metric = uspToMetric[usp];
    const materialName = materialNames[material];
    const needleTypeInfo = needleTypeNames[needleType];
    const shapeName = needleShapeNames[needleShape];
    
    let attachmentText = '';
    if (attachment === 'F') attachmentText = ', две иглы';
    if (attachment === 'P') attachmentText = ', петля';
    
    const description = `${article} Материал шовный рассас.${materialName} ${usp.replace('0', '')}/0 ${needleLength} ${shapeName} ${needleTypeInfo.en} (${needleTypeInfo.ru}) ${threadLength}${attachmentText}`;
    
    return {article, description};
}

// Генерация артикула для нерассасывающихся материалов
function generateNonAbsorbableArticle() {
    const material = document.getElementById('nonAbsorbableMaterial').value;
    const threadLength = document.getElementById('threadLength').value;
    const threadThickness = document.getElementById('threadThickness').value;
    const needleLength = document.getElementById('nonAbsNeedleLength').value;
    const needleCurve = document.getElementById('needleCurve').value;
    const needleType = document.getElementById('nonAbsNeedleType').value;
    
    // Форматирование толщины нити (2 -> 02, 1.5 -> 15)
    let formattedThickness;
    if (threadThickness.includes('.')) {
        formattedThickness = threadThickness.replace('.', '');
    } else {
        formattedThickness = threadThickness.padStart(2, '0');
    }
    
    // Форматирование длины иглы
    let formattedNeedleLength;
    if (needleLength === '00' || needleLength === '0') {
        formattedNeedleLength = '00';
    } else {
        formattedNeedleLength = needleLength.padStart(2, '0');
        if (needleLength > 99) formattedNeedleLength = needleLength; // для длин больше 99мм
    }
    
    // Генерация артикула
    const article = `${material}${threadLength}${formattedThickness}${formattedNeedleLength}${needleCurve}${needleType}`;
    
    // Генерация описания
    const materialName = nonAbsMaterialNames[material];
    const needleTypeInfo = needleTypeNames[needleType];
    const curveName = getCurveName(needleCurve);
    
    let additionalText = '';
    if (needleCurve === 'C' || needleCurve === 'E' || needleCurve === 'G' || needleCurve === 'I') {
        additionalText = ', две иглы';
    } else if (needleCurve === 'L') {
        additionalText = ', петля';
    } else if (needleCurve === 'X') {
        additionalText = ', без иглы';
    }
    
    const description = `${article} Материал шовный нерассас.${materialName} ${threadThickness}/0 ${formattedNeedleLength} ${curveName} ${needleTypeInfo.en} (${needleTypeInfo.ru}) ${threadLength}${additionalText}`;
    
    return {article, description};
}

// Получение названия изгиба иглы для нерассасывающихся
function getCurveName(curve) {
    const curveNames = {
        'A': 'прямая',
        'B': '1/2', 'C': '1/2',
        'D': '1/4', 'E': '1/4', 
        'F': '3/8', 'G': '3/8',
        'H': '5/8', 'I': '5/8',
        'J': 'J-игла',
        'L': 'петля',
        'X': 'без иглы'
    };
    return curveNames[curve] || curve;
}

// Переключение формата отображения результата
function toggleResultFormat() {
    const selectedFormat = document.querySelector('input[name="resultFormat"]:checked').value;
    
    if (selectedFormat === 'full') {
        fullResult.style.display = 'block';
        codeResult.style.display = 'none';
    } else {
        fullResult.style.display = 'none';
        codeResult.style.display = 'block';
    }
}

// Копирование результата в буфер обмена
function copyResult() {
    const selectedFormat = document.querySelector('input[name="resultFormat"]:checked').value;
    const textToCopy = selectedFormat === 'full' ? fullResult.textContent : codeResult.textContent;
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // Визуальное подтверждение копирования
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Скопировано!';
            copyBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #219a52 100%)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err);
            alert('Не удалось скопировать текст. Скопируйте его вручную.');
        });
}

// Валидация числовых полей
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('change', function() {
        if (this.value < this.min) {
            this.value = this.min;
        }
        if (this.max && this.value > this.max) {
            this.value = this.max;
        }
    });
});