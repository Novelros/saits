// Константы для Giphy API
const GIPHY_API_KEY = 'r7phsnCWf2U55hLerLPkRgWS0gtIjpoJ';
const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/random';

// Функция для получения случайной гифки с котами
async function fetchRandomCatGif() {
    try {
        const response = await fetch(`${GIPHY_API_URL}?api_key=${GIPHY_API_KEY}&tag=cat&rating=g`);
        
        if (!response.ok) {
            throw new Error(`Giphy API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.data && data.data.images && data.data.images.original) {
            return data.data.images.original.url;
        } else {
            return getFallbackCatGif();
        }
        
    } catch (error) {
        console.error('Error fetching cat gif:', error);
        return getFallbackCatGif();
    }
}

// Функция для получения резервной гифки (если API не работает)
function getFallbackCatGif() {
    const fallbackGifs = [
        'https://giphy.com/gifs/901mxGLGQN2PyCQpochttps://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2M4N2JrY290ODQ0dzI4b2VneGp2MzFoZDk5dXd5NGhrOTd5ZXpvYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/901mxGLGQN2PyCQpoc/giphy.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTNxYW94cXQwM2d1ejk3Y3RjbThqNHp0a3NuNTI5bW01dGU0Y2c1byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ev477g37MJORyOWfdG/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHljdzBhZmpvb20wYzE4cDhlcDVvMDRjOWc1YW9kMWN5amIzNjFhdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vPzbDN4rBxuvtpSpzF/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExd24zODhlYWJyd3hudXJkanl0aGtveGxxNHoxdTJxMWUwdmhxOHkzZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif',
        'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXl6MjF1cml2aGpubWw3dmtmdGlod2dpNjQxMWVxcWt2ajZuNzFzYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vFKqnCdLPNOKc/giphy.gif'
    ];
    
    const randomIndex = Math.floor(Math.random() * fallbackGifs.length);
    return fallbackGifs[randomIndex];
}

// Функция для обновления гифки с котом
async function updateCatGif() {
    const catGifElement = document.getElementById('cat-gif');
    if (!catGifElement) return;
    
    try {
        const gifUrl = await fetchRandomCatGif();
        catGifElement.src = gifUrl;
        catGifElement.alt = "Случайный кот";
        
        // Сохраняем текущую гифку в localStorage для избежания частых запросов
        localStorage.setItem('lastCatGif', gifUrl);
        localStorage.setItem('lastCatGifTime', Date.now());
        
    } catch (error) {
        console.error('Failed to update cat gif:', error);
        catGifElement.src = getFallbackCatGif();
        catGifElement.alt = "Кот (резервный вариант)";
    }
}

// Функция инициализации гифки (с кэшированием на 5 минут)
function initializeCatGif() {
    const lastGifTime = localStorage.getItem('lastCatGifTime');
    const lastGifUrl = localStorage.getItem('lastCatGif');
    
    const catGifElement = document.getElementById('cat-gif');
    if (!catGifElement) return;
    
    // Если прошло меньше 5 минут с последней загрузки, используем кэшированную гифку
    if (lastGifTime && lastGifUrl && (Date.now() - lastGifTime < 5 * 60 * 1000)) {
        catGifElement.src = lastGifUrl;
        catGifElement.alt = "Случайный кот (из кэша)";
    } else {
        // Иначе загружаем новую
        updateCatGif();
    }
}

function syncHeaderBlocks() {
    const titleCard = document.getElementById("mainTitleCard");
    const weatherWidget = document.querySelector(".weather-time-wrapper");
    if (titleCard && weatherWidget) {
        weatherWidget.style.minHeight = titleCard.offsetHeight + "px";
    }
}
window.addEventListener("resize", syncHeaderBlocks);
window.addEventListener("DOMContentLoaded", syncHeaderBlocks);

// Бегущая строка с цитатой (исправленная версия)
function createQuoteSlider() {
    const quote = "Когда я сплю, я не знаю ни страха, ни надежд, ни трудов, ни блаженств. Спасибо тому, кто изобрел сон. Это единые часы, ровняющие пастуха и короля, дуралея и мудреца. Одним только плох крепкий сон, говорят, что он смахивает на .....";
    const track = document.getElementById("quoteTrack");
    
    if (!track) return;
    
    // Очищаем трек
    track.innerHTML = "";
    
    // Создаем элемент с цитатой
    const quoteElement = document.createElement("span");
    quoteElement.className = "quote-text";
    quoteElement.textContent = quote + "     "; // Добавляем пробелы для разделения
    
    // Добавляем две копии для плавного перехода (бесконечная петля)
    for (let i = 0; i < 2; i++) {
        const clone = quoteElement.cloneNode(true);
        track.appendChild(clone);
    }
    
    // Рассчитываем длину цитаты и устанавливаем скорость анимации
    const quoteLength = quote.length;
    // Медленная скорость: примерно 10 секунд на 100 символов
    const animationDuration = Math.max(30, Math.floor(quoteLength * 0.3));
    
    // Устанавливаем скорость анимации через CSS
    track.style.animationDuration = `${animationDuration}s`;
    
    // Добавляем событие для перезапуска анимации при её завершении
    track.addEventListener('animationiteration', () => {
        // Плавный переход между цитатами
        track.style.transition = 'none';
        track.style.animation = 'none';
        
        // Небольшая задержка для сброса
        setTimeout(() => {
            track.style.animation = `quote-scroll ${animationDuration}s linear infinite`;
        }, 10);
    });
}

let newsItems = [];
let currentNewsIndex = 0;
let isNewsAnimating = false;

const SHEET_ID = '1CCOR3iJhLsZP4h0yBDC-kd9JvaY0JsbEluJIz2y5aSs';

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
    
    document.getElementById("time").textContent =
        `${leading0(now.getHours())}:${leading0(now.getMinutes())}`;
    
    const weekday = getRuWeekdayFull(now);
    document.getElementById("weekdayText").textContent =
        capitalizeFirst(weekday);
    document.getElementById("fulldate").textContent = formatRuDate(now);
    
    setTimeout(syncHeaderBlocks, 50);
}

const API_KEY = "1df2eb92e9b510458f1e2edebaace0eb";
const CITY = "Moscow";

function getWeatherImage(weatherCode, isDay) {
    const weatherImages = {
        '01': isDay ? './img/weather/sunny.png' : './img/weather/clear-night.png',
        '02': isDay ? './img/weather/partly-cloudy.png' : './img/weather/cloudy-night.png',
        '03': './img/weather/cloudy.png',
        '04': './img/weather/overcast.png',
        '09': './img/weather/rain.png',
        '10': './img/weather/rainy-day.png',
        '11': './img/weather/thunderstorm.png',
        '13': './img/weather/snow.png',
        '50': './img/weather/fog.png'
    };
    
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
            
            const weatherIcon = document.getElementById('weather-icon');
            if (weatherIcon) {
                weatherIcon.innerHTML = `<img src="./img/weather/default.png" alt="Погода" />`;
            }
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initializeCatGif();
    
    // Создаем бегущую строку с цитатой
    createQuoteSlider();
    
    // Новости
    initializeNews();
    
    // Таймеры для обновления
    setInterval(updateNews, 60000);
    setInterval(nextNews, 10000);
    
    // Дата и время
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Погода
    fetchWeather();
    setInterval(fetchWeather, 600000);
    
    // Обновление гифки с котом
    setInterval(updateCatGif, 300000);
});