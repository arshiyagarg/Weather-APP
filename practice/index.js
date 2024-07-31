console.log("Hi Arshiya")
const API_key = "57dceb3ee57d3ede95531e9c9e636dc8";


async function fetchWeatherDetails(){
    try{
        const city = "goa";
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metrics`);
        
        const data = await response.json();
        console.log('Weather Details',data);


        // let temp = ((data?.main?.temp.toFixed(2))-273).toFixed(2);

        // let newPara = document.createElement('p');
        // newPara.textContent = `${temp} °C`

        // document.body.appendChild(newPara);

        // console.log("Function Ends")

        renderWeatherData(data);
    
    }
    catch(err){
        console.log('Wrong Call')
    }
}

async function getCustomWeatherDetails(){

    try{
        let latitude = 15.335;
        let longitude = 18.635;
    
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metrics`);
        let data = await response.json();
    
        console.log(data);

        renderWeatherData(data);
    }
    catch(err){

    }

}


async function renderWeatherData(data){
        let temp = ((data?.main?.temp.toFixed(2))-273).toFixed(2);

        let newPara = document.createElement('p');
        newPara.textContent = `${temp} °C`

        document.body.appendChild(newPara);

        console.log("Function Ends")   
}


async function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("Permission not Available")
    }
}


function showPosition(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    console.log(`latitide : ${lat}
        
        
        longitude : ${lon}`)
}