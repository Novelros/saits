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
    document.getElementById(
        "fulldate"
    ).textContent = `${now.getDate()} ${now.toLocaleString("ru-RU", {
        month: "long",
    })}`;
    setTimeout(syncHeaderBlocks, 50);
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Погода
const API_KEY = "1df2eb92e9b510458f1e2edebaace0eb";
const CITY = "Moscow";

function fetchWeather() {
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&lang=ru&appid=${API_KEY}`
    )
        .then((r) => r.json())
        .then((data) => {
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
            document.getElementById("sunrise").textContent = formatTime(
                data.sys?.sunrise
            );
            document.getElementById("sunset").textContent = formatTime(
                data.sys?.sunset
            );
        })
        .catch(() => {
            document.getElementById("weather-temp").textContent = "--";
            document.getElementById("weather-feel").textContent = "";
            document.getElementById("weather-desc").textContent = "";
        });
}
fetchWeather();
setInterval(fetchWeather, 600000);
