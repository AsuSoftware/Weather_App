class Wheatherinfo {
    constructor() {
        localStorage.clear(); //clear for another user
        this.containerInfoName = window.localStorage.getItem("name");
        this.containerInfoLocation = window.localStorage.getItem("location");
        this.getElements();
    }

    getElements() {
        this.inputName = document.getElementById("input-name");
        this.inputLocation = document.getElementById("input-location");
        this.buttonInput = document.getElementById("input-button");
        this.buttonInput.addEventListener("click", () => {
            this.getInputValue();
        });
    }

    getInputValue() {
        if (
            this.inputName.value.length > 0 &&
            this.inputLocation.value.length > 0
        ) {

            this.saveToLocalStorage(); //save to local storage the information
            this.convertJson(this.inputLocation.value);

        }
    }

    loadAjax(location) {
        return new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest(); //Ajax request
            xhttp.open(
                "GET",
                `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=ab7c229dd5aeacf09c9e280238e87457`,
                true
            );
            xhttp.send();

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    resolve(this.response);
                } else if (this.status === 404) {
                    reject(new Error(this.responseText));
                }
            };
            xhttp.onerror = function () {
                reject(new Error(this.responseText));
            };
        });
    }

    async convertJson(location) {
        console.log("hatz");
        try {
            const weather = await this.loadAjax(location);
            this.data = JSON.parse(weather);

            console.log(this.data);
            const suny = this.showIcon("clear sky", this.sun());
            const rainy = this.showIcon("rain", this.rain());
            const snowy = this.showIcon("snow", this.snow());
            const scatteredClouds = this.showIcon("scattered clouds", this.clouds());
            const overcastClouds = this.showIcon("overcast clouds", this.clouds());
            const fewClouds = this.showIcon("few clouds", this.clouds());
            const fogy = this.showIcon("fog", this.fog());
            const misty = this.showIcon("mist", this.mist());
            const brokenCloudsy = this.showIcon("broken clouds", this.brokenClouds());

            console.log("success?", this.data);
            console.log(this.data.name);
        } catch (err) {
            console.log("eroare?", err);
        }
    }


    showIcon(descrizione, funzione) {
        if (this.data.weather[0].description == descrizione) {
            this.removeDom();
        }
    }

    removeDom() { //remove body

        this.section = document.getElementById('cont-home');
        this.section.innerHTML = '';
        this.createNewBody();
    }

    createNewBody() {

        //containerInfo
        const containerInfo = this.createElements('div', 'container-info');
        console.log(this.section, containerInfo);
        this.section.appendChild(containerInfo);
        //info
        this.info = this.createElements('div', 'info');
        containerInfo.appendChild(this.info);
        //location(Rome for ex)
        const location = this.createElements('div', 'location', 'location-id');
        this.info.appendChild(location);

        this.wind();
        this.humidity();
        this.pressure();
        this.visibility();
        this.temperature();

        this.containerMeteo();


        this.containerDescription = this.createElements('div', 'container-description');
        const message = this.conditionForTime(); //message based on time
        console.log(message);
        this.containerDescription.appendChild(this.descriptionText);
    }

    wind() {
        //wind
        const containerWind = this.createElements('div', 'container-wind', 'container-wind-id'); //container for wind info
        this.info.appendChild(containerWind);
        const windText = document.createTextNode('Wind :');
        containerWind.appendChild(windText);
        const containerWindValue = this.createElements('div', 'container-windValue', 'container-windValue-id');
        containerWind.appendChild(containerWindValue);
        const windValue = document.createTextNode(this.data.wind.speed + ' Km/h'); //valoarea lui wind de la server
        containerWindValue.appendChild(windValue);
        return containerWind;
    }

    humidity() {
        //Humidity
        const containerHumidity = this.createElements('div', "container-humidity", "container-humidity-id");
        this.info.appendChild(containerHumidity);
        const humidityText = document.createTextNode('Humidity :');
        containerHumidity.appendChild(humidityText);
        const containerHumidityValue = this.createElements('div', 'container-humidityValue', 'container-humidityValue-id');
        containerHumidity.appendChild(containerHumidityValue);
        const humidityValue = document.createTextNode(this.data.main.humidity + ' %');
        containerHumidityValue.appendChild(humidityValue);
        return containerHumidity;
    }

    pressure() {
        //Pressure
        const containerPressure = this.createElements('div', "container-pressure", "container-pressure-id");
        this.info.appendChild(containerPressure);
        const pressureText = document.createTextNode('Pressure :');
        containerPressure.appendChild(pressureText);
        const containerPressureValue = this.createElements('div', 'container-pressureValue', 'container-pressureValue-id');
        containerPressure.appendChild(containerPressureValue);
        const pressureValue = document.createTextNode(this.data.main.pressure + '  hPa');
        containerPressureValue.appendChild(pressureValue);
        return containerPressure;
    }

    visibility() {
        //Visibility
        const containerVisibility = this.createElements('div', "container-visibility", "container-visibility-id");
        this.info.appendChild(containerVisibility);
        const visibilityText = document.createTextNode('Visibility :');
        containerVisibility.appendChild(visibilityText);
        const containerVisibilityValue = this.createElements('div', 'container-visibilityValue', 'container-visibilityValue-id');
        containerVisibility.appendChild(containerVisibilityValue);
        const visibilityValue = document.createTextNode(this.data.visibility + ' Km');
        containerVisibilityValue.appendChild(visibilityValue);
        return containerVisibility;
    }

    temperature() {
        //Temperature
        const containerTemperature = this.createElements('div', "container-temperature", "container-temperature-id");
        this.info.appendChild(containerTemperature);
        const temperatureText = document.createTextNode('Temperature :');
        containerTemperature.appendChild(temperatureText);
        const containerTemperatureValue = this.createElements('div', 'container-temperatureValue', 'container-temperatureValue-id');
        containerTemperature.appendChild(containerTemperatureValue);
        const temperatureValue = document.createTextNode(this.data.main.temp + ' °C');
        containerTemperatureValue.appendChild(temperatureValue);
        return containerTemperature;
    }

    containerMeteo() {
        //Container Meteo(icon for weather, and information about time,and weather)
        const containerMeteo = this.createElements('div', 'container-meteo');
        this.section.appendChild(containerMeteo);
        const containerIcon = this.createElements('div', 'container-icon');
        //icon for Meteo(trebuie sa o bag intro functie aparte pentru a fii folosita de toti)
        const i = this.createElements('i', 'fad fa-sun-cloud');
        containerIcon.appendChild(i);
        containerMeteo.appendChild(containerIcon);
        return containerMeteo;
    }

    getTime() {
        this.date = new Date(); //create a date
        this.hours = this.date.getHours(); //get hours from pc
        this.date.setUTCSeconds(this.date.getUTCSeconds() + this.data.timezone); //get time from a location
        console.log(this.date);

    }

    conditionForTime() {
        this.getTime();
        if (this.date.getHours() >= 0 && this.date.getHours() < 12) { //AM
            this.format = 'AM'
            this.conditionForMinutes();

        } else if (this.date.getHours() > 12 && this.date.getHours() < 19) {
            this.format = 'PM'
            this.conditionForMinutes();


        } else if (this.date.getHours() >= 19 && this.date.getHours() < 0) {
            this.format = 'PM'
            this.conditionForMinutes();


        }
        this.conditionForMinutes();
    }

    conditionForMinutes() {
        if (this.date.getMinutes < 10) {
            //Description for container Meteo
            this.descriptionText = document.createTextNode(`Good Morning ${this.containerInfoName} ,today's weather says it is ${this.data.weather[0].description}. The exact time for this location is: ${this.date.getHours()}:0${this.date.getMinutes()} ${this.format}`);

        } else {
            console.log(this.containerInfoName); //null
            //Description for container Meteo
            this.descriptionText = document.createTextNode(`Good Morning ${this.containerInfoName} ,today's weather says it is ${this.data.weather[0].description}. The exact time for this location is: ${this.date.getHours()}:${this.date.getMinutes()} ${this.format}`);
        }
        return this.descriptionText;
    }

    //Functie de constructie pentru toate
    createElements(typeElement, nameClass, idElement) { //Creez o functie universala de constructie
        const container = document.createElement(typeElement);
        container.className = nameClass;
        container.id = idElement;
        return container;
    }

    sun() {
        console.log("merge si sun");
    }

    clouds() {
        console.log("merge si sun");
    }

    brokenClouds() {
        console.log("merge si broken");
    }

    rain() {
        console.log("merge si sun");
    }

    fog() {
        console.log("merge si sun");
    }

    mist() {
        console.log("merge si sun");
    }

    snow() {
        console.log("merge si sun");
    }


    saveToLocalStorage() {
        window.localStorage.setItem("name", this.inputName.value);
        window.localStorage.setItem("location", this.inputLocation.value);
        console.log(window.localStorage);

    }

}

window.onload = () => {
    new Wheatherinfo();
};
