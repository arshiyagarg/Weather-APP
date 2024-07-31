const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccess = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-SearchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFoundClass = document.querySelector(".not-found-page")


let currentTab = userTab;
const API_key = "57dceb3ee57d3ede95531e9c9e636dc8";
currentTab.classList.add("current-tab");

getFromSessionStorage();

userTab.addEventListener('click',() =>{
    switchTab(userTab);
});

searchTab.addEventListener('click',() =>{
    switchTab(searchTab);
});

function switchTab(tab){
    if(tab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = tab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            grantAccess.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFoundClass.classList.remove("active")

            searchForm.classList.add("active"); 
        }
        else{
            // switching to user weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            notFoundClass.classList.remove("active")
            getFromSessionStorage();
        }
    }
}


function  getFromSessionStorage(){
    const localCoordiantes = sessionStorage.getItem("user-coordinates");
    if(!localCoordiantes){
        grantAccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordiantes);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;

    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metrics`
        );
        let data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        loadingScreen.classList.remove("active");
        alert("Can't fetch information")
    }
}

function renderWeatherInfo(data){
    //firstly we have to fetch the info
    if(data != undefined){
        const cityName = document.querySelector("[data-cityName]");
        const countryIcon = document.querySelector("[data-countryIcon]");
        const desc = document.querySelector("[data-WeatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp = document.querySelector("[data-temp]");
        const windspeed = document.querySelector("[data-windspeed]");
        const humidity = document.querySelector("[data-humidity]");
        const cloudiness = document.querySelector("[data-clouds]");
    
    
        cityName.innerText = data?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
        desc.innerText = data?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
        temp.innerText = `${(((data?.main?.temp)-273).toFixed(2))} °C` ;
        windspeed.innerText = `${data?.wind?.speed} m/s`;
        humidity.innerText = `${data?.main?.humidity} %`;
        cloudiness.innerText = `${data?.clouds?.all} %`;

    }

    else{
        notFoundClass.classList.add("active");
    }

}


const grantAccessBtn = document.querySelector("[data-GrantAccess]");
grantAccessBtn.addEventListener('click',getLocation);

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Location Access not available");
    }
}

function showPosition(position){
    const userCoordinates= {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const searchInput = document.querySelector("[data-SearchInput]");

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccess.classList.remove("active");
    notFoundClass.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metrics`);
        if(!response.ok){
            throw new Error("Error Occured")
        }
        const data = await response.json();
        loadingScreen.classList.remove("active");
        notFoundClass.classList.remove("active")
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        console.log(e)
        loadingScreen.classList.remove("active");
        notFoundClass.classList.add("active");
        // alert("Data Not Found")
    }
}