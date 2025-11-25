// Синхронизация высоты
function syncHeaderBlocks() {
    const titleCard = document.getElementById("mainTitleCard");
    const dateCard = document.getElementById("dateWidgetCard");
    if (titleCard && dateCard) {
        dateCard.style.minHeight = titleCard.offsetHeight + "px";
    }
}
window.addEventListener("resize", syncHeaderBlocks);
window.addEventListener("DOMContentLoaded", syncHeaderBlocks);

// Партнёры
const partnersAll = [
    {
        src: "./img/Rostec.png",
        alt: "Ростех",
        name: "Ростех",
        key: "rostec",
    },
    { src: "./img/1С.jpg", alt: "1C", name: "1C", key: "1c" },
    { src: "./img/CROC.png", alt: "КРОК", name: "КРОК", key: "krok" },
    {
        src: "./img/astra.png",
        alt: "Астра",
        name: "Астра",
        key: "astra",
    },
    {
        src: "./img/Rosatom.png",
        alt: "Росатом",
        name: "Росатом",
        key: "rosatom",
    },
    {
        src: "./img/lyceum.png",
        alt: "Яндекс Лицей",
        name: "Яндекс Лицей",
        key: "yandex_lyceum",
    },
    {
        src: "./img/SAMSUNG.png",
        alt: "IT Школа",
        name: "IT Школа",
        key: "it_school",
    },
    {
        src: "./img/Solar.png",
        alt: "Солар",
        name: "Солар",
        key: "solar",
    },
    {
        src: "./img/ROSTELECOM.png",
        alt: "Ростелеком",
        name: "Ростелеком",
        key: "rostelecom",
    },
    {
        src: "./img/roscosmos.png",
        alt: "Роскосмос",
        name: "Роскосмос",
        key: "rosspace",
    },
];

const partnersDescriptions = {
    rostec: "Госкорпорация, развивающая высокотехнологичные отрасли в России.",
    "1c": "Экосистема ИТ-решений для бизнеса, образования и учёта.",
    krok: "Крупный ИТ-интегратор и поставщик облачных платформ.",
    astra: "Российский разработчик системы Astra Linux.",
    rosatom: "Госкорпорация по атомной энергии, лидер инноваций.",
    yandex_lyceum: "Проект Яндекса для обучения школьников программированию.",
    it_school: "Образовательная инициатива Samsung для ИТ-обучения.",
    solar: "Эксперт в кибербезопасности, цифровой защите.",
    rostelecom: "Национальный оператор связи, интернет и цифровые платформы.",
    rosspace: "Госкорпорация, объединяющая передовые предприятия для освоения и использования космоса в интересах страны.",
};

let partnerIndex = 0;
function renderPartners() {
    const grid = document.getElementById("partnersGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const N = partnersAll.length;
    for (let i = 0; i < 6; i++) {
        const p = partnersAll[(partnerIndex + i) % N];
        const cell = document.createElement("div");
        cell.className = "partner-cell";
        cell.setAttribute("data-partner", p.key);
        cell.innerHTML = `<img src="${p.src}" alt="${p.alt}"><div class="partner-name">${p.name}</div>`;
        grid.appendChild(cell);
    }
    bindModals();
}

function bindModals() {
    document.querySelectorAll(".partner-cell").forEach((el) => {
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

renderPartners();
setInterval(() => {
    partnerIndex = (partnerIndex + 6) % partnersAll.length;
    renderPartners();
}, 3000);

// Календарь
function renderCalendar() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDate = now.getDate();
    
    // Получаем первый день месяца и количество дней
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    let calendarHTML = `
        <div class="calendar-header">
            ${monthNames[currentMonth]} ${currentYear}
        </div>
        <div class="calendar-weekdays">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Вс</div>
        </div>
        <div class="calendar-days">
    `;
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
        calendarHTML += '<div class="calendar-day other-month"></div>';
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDate;
        const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        calendarHTML += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}">
                ${day}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    document.getElementById('calendar').innerHTML = calendarHTML;
}

// Дата/время
function leading0(n) {
    return n < 10 ? "0" + n : n;
}
function getRuWeekday(d) {
    return ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"][d.getDay()];
}
function getStudyWeek(now) {
    let year = now.getFullYear(),
        startMonth,
        startYear;
    if (now.getMonth() + 1 >= 9) {
        startMonth = 8;
        startYear = year;
    } else if (now.getMonth() + 1 >= 2) {
        startMonth = 1;
        startYear = year;
    } else {
        startMonth = 8;
        startYear = year - 1;
    }
    let start = new Date(startYear, startMonth, 1);
    while (start.getDay() !== 1) start.setDate(start.getDate() + 1);
    let diff = now - start;
    let weekNum = Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
    return weekNum < 1 ? 1 : weekNum;
}

function updateDateTime() {
    const now = new Date();
    document.getElementById("weekday").textContent = getRuWeekday(now);
    document.getElementById("time").textContent = `${leading0(
        now.getHours()
    )}:${leading0(now.getMinutes())}`;
    
    // Исправление названий месяцев
    const monthNames = {
        'january': 'января',
        'february': 'февраля', 
        'march': 'марта',
        'april': 'апреля',
        'may': 'мая',
        'june': 'июня',
        'july': 'июля',
        'august': 'августа',
        'september': 'сентября',
        'october': 'октября',
        'november': 'ноября',
        'december': 'декабря'
    };
    
    const monthKey = now.toLocaleString("en-US", { month: "long" }).toLowerCase();
    const monthName = monthNames[monthKey] || now.toLocaleString("ru-RU", { month: "long" });
    
    document.getElementById("fulldate").textContent = `${now.getDate()} ${monthName}`;
    
    // Обновляем календарь
    renderCalendar();
    setTimeout(syncHeaderBlocks, 50);
}

// Инициализация календаря при загрузке
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    updateDateTime();
});

setInterval(updateDateTime, 1000);
updateDateTime();

// Погода
const API_KEY = "1df2eb92e9b510458f1e2edebaace0eb";
const CITY = "Moscow";

function getWeatherBackground(weatherCode, isDay) {
    const weatherBackgrounds = {
        // Ясная погода
        '01': isDay ? './img/weather/sunny.gif' : './img/weather/clear-night.gif',
        // Небольшая облачность
        '02': isDay ? './img/weather/partly-cloudy.gif' : './img/weather/cloudy-night.gif',
        // Облачно
        '03': './img/weather/cloudy.gif',
        '04': './img/weather/overcast.gif',
        // Дождь
        '09': './img/weather/rain.gif',
        '10': './img/weather/rainy-day.gif',
        // Гроза
        '11': './img/weather/thunderstorm.gif',
        // Снег
        '13': './img/weather/snow.gif',
        // Туман
        '50': './img/weather/fog.gif'
    };
    
    return weatherBackgrounds[weatherCode] || './img/weather/default.gif';
}
function fetchWeather() {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=ru&appid=${API_KEY}`
    )
        .then((r) => r.json())
        .then((data) => {
            // Обновляем данные погоды
            document.getElementById("weather-temp").textContent = data.main
                ? data.main.temp > 0
                    ? `+${Math.round(data.main.temp)}`
                    : `${Math.round(data.main.temp)}`
                : "--";
            document.getElementById("weather-feel").textContent = data.main
                ? `По ощущению ${
                      data.main.feels_like > 0 ? "+" : ""
                  }${Math.round(data.main.feels_like)}`
                : "";
            document.getElementById("weather-desc").textContent = data
                .weather?.[0]
                ? data.weather[0].description[0].toUpperCase() +
                  data.weather[0].description.slice(1)
                : "";
            document.getElementById("weather-wind").textContent = data.wind
                ? `${data.wind.speed} м/с`
                : "--";
            document.getElementById("weather-pressure").textContent = data.main
                ? `${Math.round(data.main.pressure * 0.750062)} мм рт. ст.`
                : "--";
            document.getElementById("weather-humidity").textContent = data.main
                ? `${data.main.humidity}%`
                : "--";
            const formatTime = (ts) => {
                if (!ts) return "--:--";
                const d = new Date(ts * 1000);
                return leading0(d.getHours()) + ":" + leading0(d.getMinutes());
            };
            document.getElementById("sunrise-time").textContent = formatTime(
                data.sys?.sunrise
            );
            document.getElementById("sunset-time").textContent = formatTime(
                data.sys?.sunset
            );
            
        // Устанавливаем фон погоды в зависимости от условий
        if (data.weather && data.weather[0]) {
            const weatherCode = data.weather[0].icon.substring(0, 2);
            const isDay = data.weather[0].icon.includes('d');
            const weatherCard = document.getElementById('weatherCard');
            if (weatherCard) {
                const background = getWeatherBackground(weatherCode, isDay);
                weatherCard.style.backgroundImage = `url("${background}")`;
                weatherCard.style.backgroundSize = 'cover';
                weatherCard.style.backgroundPosition = 'center';
                weatherCard.style.backgroundRepeat = 'no-repeat';
            }
        }
        })
        .catch((error) => {
            console.error('Ошибка получения погоды:', error);
            document.getElementById("weather-temp").textContent = "--";
            document.getElementById("weather-feel").textContent = "";
            document.getElementById("weather-desc").textContent = "";
        });
}

fetchWeather();
setInterval(fetchWeather, 600000);