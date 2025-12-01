// Функция синхронизации высоты блоков
function syncHeaderBlocks() {
    const titleCard = document.getElementById("mainTitleCard");
    const weatherWidget = document.querySelector(".weather-time-wrapper");
    if (titleCard && weatherWidget) {
        weatherWidget.style.minHeight = titleCard.offsetHeight + "px";
    }
}
window.addEventListener("resize", syncHeaderBlocks);
window.addEventListener("DOMContentLoaded", syncHeaderBlocks);

// Данные партнеров
const partnersAll = [
    { src: "./img/Rostec.png", alt: "Ростех", name: "Ростех", key: "rostec" },
    { src: "./img/1С.jpg", alt: "1C", name: "1C", key: "1c" },
    { src: "./img/CROC.png", alt: "КРОК", name: "КРОК", key: "krok" },
    { src: "./img/astra.png", alt: "Астра", name: "Астра", key: "astra" },
    { src: "./img/Rosatom.png", alt: "Росатом", name: "Росатом", key: "rosatom" },
    { src: "./img/lyceum.png", alt: "Яндекс Лицей", name: "Яндекс Лицей", key: "yandex_lyceum" },
    { src: "./img/SAMSUNG.png", alt: "IT Школа", name: "IT Школа", key: "it_school" },
    { src: "./img/Solar.png", alt: "Солар", name: "Солар", key: "solar" },
    { src: "./img/ROSTELECOM.png", alt: "Ростелеком", name: "Ростелеком", key: "rostelecom" },
    { src: "./img/roscosmos.png", alt: "Роскосмос", name: "Роскосмос", key: "rosspace" }
];

const partnersDescriptions = {
    rostec: "Госкорпорация, развивающая высокотехнологичные отрасли в России.",
    "1c": "Экосистема ИТ-решений для бизнеса, образования и учёта.",
    krok: "Крупный ИТ-интегратор и поставщик облачных платформ.",
    astra: "Российский разработчик системы Astra Linux.",
    rosatom: "Госкорпорация по атомной энергии, лидер инноваций.",
    yandex_lyceum: "Проект Яндекса для обучения школьников программированию.",
    it_school: "Образовательная инициатива Samsung для ИТ-обучения.",
    solar: "Эксперт в кибербезопасности и цифровой защите.",
    rostelecom: "Национальный оператор связи, интернет и цифровые платформы.",
    rosspace: "Госкорпорация, объединяющая передовые предприятия для освоения и использования космоса."
};

let partnerIndex = 0;
let isAnimating = false;
let currentPage = 0;
const PARTNERS_PER_PAGE = 4;

// Пагинация партнеров
function updatePaginationDots() {
    const dotsContainer = document.getElementById('partnersPagination');
    if (!dotsContainer) return;
    
    const totalPages = Math.ceil(partnersAll.length / PARTNERS_PER_PAGE);
    
    let dotsHtml = '';
    for (let i = 0; i < totalPages; i++) {
        dotsHtml += `<span class="partners-pagination-dot ${i === currentPage ? 'active' : ''}" data-page="${i}"></span>`;
    }
    
    dotsContainer.innerHTML = dotsHtml;
    
    dotsContainer.querySelectorAll('.partners-pagination-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            if (page !== currentPage && !isAnimating) {
                currentPage = page;
                partnerIndex = page * PARTNERS_PER_PAGE;
                renderPartners();
            }
        });
    });
}

function renderPartners() {
    const grid = document.getElementById("partnersGrid");
    const container = document.querySelector('.partners-container');
    
    if (!grid || !container) return;
    
    let paginationContainer = document.getElementById('partnersPagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'partnersPagination';
        paginationContainer.className = 'partners-pagination';
        container.appendChild(paginationContainer);
    }
    
    grid.innerHTML = "";
    
    const startIndex = partnerIndex;
    const endIndex = Math.min(startIndex + PARTNERS_PER_PAGE, partnersAll.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const p = partnersAll[i];
        const cell = document.createElement("div");
        cell.className = "partner-cell";
        cell.setAttribute("data-partner", p.key);
        cell.innerHTML = `<img src="${p.src}" alt="${p.alt}"><div class="partner-name">${p.name}</div>`;
        grid.appendChild(cell);
    }
    
    const remaining = PARTNERS_PER_PAGE - (endIndex - startIndex);
    for (let i = 0; i < remaining; i++) {
        const cell = document.createElement("div");
        cell.className = "partner-cell empty-cell";
        cell.innerHTML = `<div class="empty-partner"></div>`;
        grid.appendChild(cell);
    }
    
    updatePaginationDots();
    bindModals();
}

function nextPartners() {
    if (isAnimating) return;
    
    isAnimating = true;
    
    partnerIndex += PARTNERS_PER_PAGE;
    
    if (partnerIndex >= partnersAll.length) {
        partnerIndex = 0;
        currentPage = 0;
    } else {
        currentPage = Math.floor(partnerIndex / PARTNERS_PER_PAGE);
    }
    
    renderPartners();
    isAnimating = false;
}

function bindModals() {
    document.querySelectorAll(".partner-cell:not(.empty-cell)").forEach((el) => {
        el.onclick = () => {
            const key = el.getAttribute("data-partner");
            document.getElementById("modal-title").textContent =
                el.querySelector(".partner-name").textContent;
            document.getElementById("modal-text").textContent =
                partnersDescriptions[key] || "Нет описания.";
            document.getElementById("modal-bg").style.display = "flex";
        };
    });
}

document.getElementById("modal-close").onclick = () => {
    document.getElementById("modal-bg").style.display = "none";
};
document.getElementById("modal-bg").onclick = (e) => {
    if (e.target.id === "modal-bg") {
        document.getElementById("modal-bg").style.display = "none";
    }
};

// Новости
let newsItems = [];
let currentNewsIndex = 0;
let isNewsAnimating = false;

const SHEET_ID = '1-5EIIj6J6cqSHiEe0MaSiG9LhMBoBrRp_V_5queOcJQ';

async function fetchNewsFromGoogleSheets() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        
        return parseSheetData(json);
        
    } catch (error) {
        try {
            const proxyUrl = 'https://api.allorigins.win/raw?url=';
            const encodedUrl = encodeURIComponent(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`);
            
            const response = await fetch(proxyUrl + encodedUrl);
            const text = await response.text();
            const json = JSON.parse(text.substring(47, text.length - 2));
            
            return parseSheetData(json);
            
        } catch (proxyError) {
            return null;
        }
    }
}

function parseSheetData(json) {
    const newsItems = [];
    
    if (json.table && json.table.rows) {
        let startIndex = 0;
        
        if (json.table.rows[0] && json.table.rows[0].c) {
            const firstRow = json.table.rows[0].c;
            const firstTitle = firstRow[1]?.v || '';
            const firstDate = firstRow[0]?.v || '';
            
            if (firstTitle.toLowerCase().includes('заголовок') || 
                firstDate.toLowerCase().includes('дата')) {
                startIndex = 1;
            }
        }
        
        for (let i = startIndex; i < json.table.rows.length; i++) {
            const row = json.table.rows[i];
            const cells = row.c;
            
            if (cells && cells.length >= 2) {
                const title = cells[1]?.v || '';
                const dateValue = cells[0]?.v || '';
                
                let formattedDate = '';
                if (dateValue) {
                    if (typeof dateValue === 'string' && dateValue.startsWith('Date(')) {
                        formattedDate = parseDateObject(dateValue);
                    } else {
                        formattedDate = dateValue;
                    }
                } else {
                    formattedDate = formatCurrentDate();
                }
                
                if (title && title.trim() !== '') {
                    newsItems.push({
                        title: title,
                        date: formattedDate,
                        link: '#'
                    });
                }
            }
        }
    }
    
    return newsItems;
}

function parseDateObject(dateString) {
    try {
        const match = dateString.match(/Date\((\d+),(\d+),(\d+)\)/);
        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) + 1;
            const day = parseInt(match[3]);
            
            return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
        }
    } catch (error) {
    }
    
    return formatCurrentDate();
}

function formatCurrentDate() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
}

function createDemoNews() {
    const demoNews = [
        {
            title: "Более 800 абитуриентов посетили День открытых дверей",
            date: "17.11.2024",
            link: "#"
        },
        {
            title: "РТУ МИРЭА приглашает к участию в олимпиаде",
            date: "27.11.2024",
            link: "#"
        }
    ];
    
    return demoNews;
}

async function initializeNews() {
    let loadedNews = await fetchNewsFromGoogleSheets();
    
    if (!loadedNews || loadedNews.length === 0) {
        loadedNews = createDemoNews();
    }
    
    newsItems = loadedNews;
    
    if (newsItems.length > 0) {
        renderNews();
        setupNewsPagination();
        return true;
    }
    
    return false;
}

async function updateNews() {
    const loadedNews = await fetchNewsFromGoogleSheets();
    
    if (loadedNews && loadedNews.length > 0) {
        newsItems = loadedNews;
        
        if (currentNewsIndex >= newsItems.length) {
            currentNewsIndex = 0;
        }
        
        renderNews();
        setupNewsPagination();
    }
}

function renderNews() {
    const content = document.querySelector('.important-content');
    if (!content || newsItems.length === 0) {
        return;
    }
    
    const currentNews = newsItems[currentNewsIndex];
    
    content.innerHTML = `
        <div class="news-item ${isNewsAnimating ? 'news-slide-out' : ''}">
            <div class="news-title">${currentNews.title}</div>
            <div class="news-date">${currentNews.date}</div>
        </div>
    `;
    
    if (isNewsAnimating) {
        setTimeout(() => {
            content.innerHTML = `
                <div class="news-item news-slide-in">
                    <div class="news-title">${currentNews.title}</div>
                    <div class="news-date">${currentNews.date}</div>
                </div>
            `;
            
            setTimeout(() => {
                isNewsAnimating = false;
            }, 500);
        }, 300);
    }
    
    updateNewsPagination();
}

function setupNewsPagination() {
    const importantBlock = document.querySelector('.important-block');
    if (!importantBlock) return;
    
    const oldPagination = importantBlock.querySelector('.news-pagination');
    if (oldPagination) {
        oldPagination.remove();
    }
    
    const pagination = document.createElement('div');
    pagination.className = 'news-pagination';
    
    let dotsHtml = '';
    const dotsToShow = Math.min(newsItems.length, 5);
    
    for (let i = 0; i < dotsToShow; i++) {
        dotsHtml += `<span class="news-dot ${i === currentNewsIndex ? 'active' : ''}" data-index="${i}"></span>`;
    }
    
    pagination.innerHTML = dotsHtml;
    importantBlock.appendChild(pagination);
    
    pagination.querySelectorAll('.news-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (index !== currentNewsIndex && !isNewsAnimating) {
                currentNewsIndex = index;
                isNewsAnimating = true;
                renderNews();
            }
        });
    });
}

function updateNewsPagination() {
    const dots = document.querySelectorAll('.news-dot');
    dots.forEach((dot, index) => {
        if (index === currentNewsIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextNews() {
    if (isNewsAnimating || newsItems.length === 0) return;
    
    isNewsAnimating = true;
    currentNewsIndex = (currentNewsIndex + 1) % newsItems.length;
    renderNews();
}

// ВРЕМЯ И ДАТА (как в первом примере)
function leading0(n) {
    return n < 10 ? "0" + n : n;
}

function getRuWeekdayFull(d) {
    return ["воскресенье", "понедельник", "вторник", "среда",
        "четверг", "пятница", "суббота"][d.getDay()];
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatRuDate(d) {
    const formatter = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long"
    });
    const parts = formatter.formatToParts(d);
    const dayPart = parts.find((p) => p.type === "day")?.value || "";
    const monthPart = parts.find((p) => p.type === "month")?.value || "";
    return `${dayPart} ${monthPart}`;
}

function updateDateTime() {
    const now = new Date();
    
    // Обновляем время в белой карточке
    document.getElementById("time").textContent =
        `${leading0(now.getHours())}:${leading0(now.getMinutes())}`;
    
    // Обновляем день недели и дату
    const weekday = getRuWeekdayFull(now);
    document.getElementById("weekdayText").textContent =
        capitalizeFirst(weekday);
    document.getElementById("fulldate").textContent = formatRuDate(now);
    
    setTimeout(syncHeaderBlocks, 50);
}

// ПОГОДА (с большой картинкой погоды)
const API_KEY = "1df2eb92e9b510458f1e2edebaace0eb";
const CITY = "Moscow";

// Функция для получения картинки погоды
function getWeatherImage(weatherCode, isDay) {
    // Коды погоды от OpenWeatherMap и соответствующие им картинки
    const weatherImages = {
        '01': isDay ? './img/weather/sunny.png' : './img/weather/clear-night.png',       // ясно
        '02': isDay ? './img/weather/partly-cloudy.png' : './img/weather/cloudy-night.png', // немного облачно
        '03': './img/weather/cloudy.png',        // облачно
        '04': './img/weather/overcast.png',      // пасмурно
        '09': './img/weather/rain.png',          // небольшой дождь
        '10': './img/weather/rainy-day.png',     // дождь
        '11': './img/weather/thunderstorm.png',  // гроза
        '13': './img/weather/snow.png',          // снег
        '50': './img/weather/fog.png'            // туман
    };
    
    // Возвращаем картинку по коду погоды, или стандартную
    return weatherImages[weatherCode] || './img/weather/default.png';
}

function fetchWeather() {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=ru&appid=${API_KEY}`
    )
        .then((r) => r.json())
        .then((data) => {
            const temp = data.main?.temp;
            const feel = data.main?.feels_like;
            const desc = data.weather?.[0]?.description || "";

            // Обновляем информацию о погоде
            document.getElementById("weather-temp").textContent =
                data.main
                    ? (temp > 0 ? "+" : "") + Math.round(temp) + "°"
                    : "--";

            document.getElementById("weather-feel").textContent =
                data.main
                    ? `По ощущениям ${(feel > 0 ? "+" : "") + Math.round(feel)}°`
                    : "";

            document.getElementById("weather-desc").textContent =
                desc ? desc[0].toUpperCase() + desc.slice(1) : "";

            document.getElementById("weather-wind").textContent =
                data.wind ? `${data.wind.speed} м/с` : "--";

            document.getElementById("weather-pressure").textContent =
                data.main
                    ? `${Math.round(data.main.pressure * 0.750062)} мм рт. ст.`
                    : "--";

            document.getElementById("weather-humidity").textContent =
                data.main ? `${data.main.humidity}%` : "--";

            const formatTime = (ts) => {
                if (!ts) return "--:--";
                const d = new Date(ts * 1000);
                return leading0(d.getHours()) + ":" + leading0(d.getMinutes());
            };

            document.getElementById("sunrise").textContent =
                formatTime(data.sys?.sunrise);
            document.getElementById("sunset").textContent =
                formatTime(data.sys?.sunset);
            
            // МЕНЯЕМ КАРТИНКУ ПОГОДЫ
            if (data.weather && data.weather[0]) {
                const weatherCode = data.weather[0].icon.substring(0, 2);
                const isDay = data.weather[0].icon.includes('d');
                const weatherIcon = document.getElementById('weather-icon');
                if (weatherIcon) {
                    const imageUrl = getWeatherImage(weatherCode, isDay);
                    weatherIcon.innerHTML = `<img src="${imageUrl}" alt="${data.weather[0].description}" />`;
                }
            }
        })
        .catch(() => {
            document.getElementById("weather-temp").textContent = "--";
            document.getElementById("weather-feel").textContent = "";
            document.getElementById("weather-desc").textContent = "";
            
            // Устанавливаем стандартную картинку при ошибке
            const weatherIcon = document.getElementById('weather-icon');
            if (weatherIcon) {
                weatherIcon.innerHTML = `<img src="./img/weather/default.png" alt="Погода" />`;
            }
        });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    renderPartners();
    setInterval(nextPartners, 4000);
    
    initializeNews();
    
    setInterval(updateNews, 60000);
    
    setInterval(nextNews, 10000);
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    fetchWeather();
    setInterval(fetchWeather, 600000);
});