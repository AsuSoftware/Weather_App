class Wheatherinfo {
  constructor() {
    localStorage.clear(); //clear for another user
    this.containerInfo = JSON.parse(window.localStorage.getItem("info")) || [];
    this.configurateDom();
  }

  //Configurate dom with the input's
  configurateDom() {
    //Input name
    this.inputName = document.getElementById("inp");

    //Input location
    this.inputLocation = document.getElementById("inpSearch");
    this.buttonLocation = document.getElementById("btnSearch");
    this.getInputValue(this.buttonLocation);
  }

  getInputValue(buttonloc) {
    buttonloc.addEventListener("click", () => {
      if (
        this.inputLocation.value.length > 0 &&
        this.inputName.value.length > 0
      ) {
        this.containerInfo.push(this.inputName.value, this.inputLocation.value);
        this.saveToLocalStorage();
        this.convertJson(this.inputLocation.value);
      }
      this.inputLocation.value = "";
    });
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

      xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
          resolve(this.response);
        } else if (this.status === 404) {
          reject(new Error(this.responseText));
        }
      };
      xhttp.onerror = function() {
        reject(new Error(this.responseText));
      };
    });
  }

  async convertJson(location) {
    console.log("hatz");
    try {
      const weather = await this.loadAjax(location);
      this.data = JSON.parse(weather);
      if (this.data.weather[0].description == "clear sky") {
        this.removeDom();
        this.sun();
      } else if (this.data.weather[0].description == "rain") {
        this.removeDom();
        this.rain();
      } else if (this.data.weather[0].description == "snow") {
        this.removeDom();
        this.snow();
      } else if (
        this.data.weather[0].description == "scattered clouds" ||
        this.data.weather[0].description == "overcast clouds" ||
        this.data.weather[0].description == "few clouds"
      ) {
        this.removeDom();
        this.clouds();
      } else if (this.data.weather[0].description == "fog") {
        this.removeDom();
        this.fog();
      } else if (this.data.weather[0].description == "mist") {
        this.removeDom();
        this.mist();
      } else if (this.data.weather[0].description == "broken clouds") {
        this.removeDom();
        this.brokenClouds();
      }
      console.log("success?", this.data);
      console.log(this.data.name);
    } catch (err) {
      console.log("eroare?", err);
    }
  }

  removeDom() {
    this.container = document.getElementById("cont-home");
    this.container.innerHTML = "";
    this.createNewDom(this.container);
  }

  createNewDom(container) {
    //Log out navbar

    this.nav = document.getElementById("navBar");
    if (document.getElementById("idLog") == null) {
      this.buttonLog = document.createElement("button");
      this.buttonLog.className = "log-out";
      this.buttonLog.id = "idLog";
      const btnI = document.createElement("i");
      btnI.className = "far fa-sign-out-alt";
      this.buttonLog.appendChild(btnI);
      this.nav.appendChild(this.buttonLog);
    } else {
      this.buttonLog = document.getElementById("idLog");
    }

    //first div container
    const divContMet = document.createElement("div");
    divContMet.className = "container-meteo";
    container.appendChild(divContMet);

    //second div container info
    const divContInfo = document.createElement("div");
    divContInfo.className = "container-info";
    divContMet.appendChild(divContInfo);

    //third div container for real info
    const divInfo = document.createElement("div");
    divInfo.className = "info";
    divContInfo.appendChild(divInfo);

    //location
    const location = document.createElement("div");
    location.className = "location";
    location.id = "loc";
    divInfo.appendChild(location);

    //Information..winter..sun..rain etc(win)
    const wind = document.createElement("div");
    const textW = document.createTextNode("Wind :");
    wind.appendChild(textW);
    wind.className = "wind";
    const win = document.createElement("div");
    win.className = "win";
    win.id = "wind";
    wind.appendChild(win);
    divInfo.appendChild(wind);
    //icon win
    const i = document.createElement("i");
    i.className = "fad fa-windsock";
    win.appendChild(i);

    //Humidity
    const humidity = document.createElement("div");
    humidity.className = "humidity";
    const textH = document.createTextNode("Humidity :");
    humidity.appendChild(textH);
    const divHum = document.createElement("div");
    divHum.className = "humi";
    divHum.id = "humy";
    humidity.appendChild(divHum);
    divInfo.appendChild(humidity);

    //icon humidity
    const iH = document.createElement("i");
    iH.className = "fas fa-humidity";
    divHum.appendChild(iH);

    //Pressure
    const pressure = document.createElement("div");
    pressure.className = "pressure";
    const textP = document.createTextNode("Pressure :");
    pressure.appendChild(textP);
    const divPres = document.createElement("div");
    divPres.className = "pres";
    divPres.id = "press";
    pressure.appendChild(divPres);
    divInfo.appendChild(pressure);

    //icon Pressure
    const iP = document.createElement("i");
    iP.className = "far fa-heat";
    divPres.appendChild(iP);

    //visibility
    const visibility = document.createElement("div");
    visibility.className = "visibility";
    const textV = document.createTextNode("Visibility :");
    visibility.appendChild(textV);
    const divVis = document.createElement("div");
    divVis.className = "visi";
    divVis.id = "visib";
    visibility.appendChild(divVis);
    divInfo.appendChild(visibility);

    //icon Visibility
    const iV = document.createElement("i");
    iV.className = "far fa-eye";
    divVis.appendChild(iV);

    //temperature
    const temperature = document.createElement("div");
    temperature.className = "temperature";
    const textT = document.createTextNode("Temperature :");
    temperature.appendChild(textT);
    const divTemp = document.createElement("div");
    divTemp.className = "temp";
    divTemp.id = "temper";
    temperature.appendChild(divTemp);
    divInfo.appendChild(temperature);

    if (this.data.main.temp > 18) {
      //icon Temperature
      const iT = document.createElement("i");
      iT.className = "fad fa-temperature-up";
      divTemp.appendChild(iT);
    } else {
      const iT = document.createElement("i");
      iT.className = "fal fa-temperature-down";
      divTemp.appendChild(iT);
    }

    //Icon meteo
    const meteoIcon = document.createElement("div");
    meteoIcon.className = "meteo-icon";
    meteoIcon.id = "meteoIco";
    this.divName = document.createElement("div");
    this.divName.className = "container-text";
    //date
    this.date = new Date();
    this.hours = this.date.getHours();
    this.date.setUTCSeconds(this.date.getUTCSeconds() + this.data.timezone);
    console.log(this.date);
    this.containerText = document.createElement("div");
    this.containerText.className = "containerText";

    this.conditionForDom();

    console.log(this.divName);
    meteoIcon.appendChild(this.divName);
    console.log(meteoIcon);
    divContMet.appendChild(meteoIcon);
    console.log(divContMet);
  }

  conditionForDom() {
    //Se l'ora e..
    // if hours > 7
    if (this.hours >= 7 && this.hours < 12) {
      if (this.data.main.temp < 18) {
        this.textName = document.createTextNode(
          "Good morning " +
            this.containerInfo[0] +
            ", today's weather says it is " +
            this.data.weather[0].description +
            ". Judging by the temperatures, I recommend you wear something that keeps you warm."
        );
      } else {
        this.textName = document.createTextNode(
          "Good morning " +
            this.containerInfo[0] +
            ", today's weather says it is " +
            this.data.weather[0].description
        );
      }

      this.containerText.appendChild(this.textName);

      if (this.date.getHours() >= 0 || this.date.getHours() < 12) {
        if (this.date.getMinutes() < 10) {
          this.createResponseTimeAmFor0();
        } else if (this.date.getMinutes() >= 10) {
          this.createResponseTimeAmFor10();
        }
      } else if (this.date.getHours() >= 12 || this.date.getHours() <= 0) {
        if (this.date.getMinutes() < 10) {
          this.createResponseTimePmFor0();
        } else if (this.date.getMinutes() >= 10) {
          this.createResponseTimePmFor10();
        }
      }

      this.getAppendChild();
    }
    // if hours > 12
    else if (this.hours >= 12 && this.hours < 16) {
      this.textName = document.createTextNode(
        "Good afternoon " +
          this.containerInfo[0] +
          ", today's weather says it is " +
          this.data.weather[0].description
      );
      this.containerText.appendChild(this.textName);

      if (this.date.getHours() >= 0 || this.date.getHours() < 12) {
        if (this.date.getMinutes() < 10) {
          this.createResponseTimeAmFor0();
        } else if (this.date.getMinutes() >= 10) {
          this.createResponseTimeAmFor10();
        }
      } else if (this.date.getHours() >= 12 || this.date.getHours() <= 0) {
        if (this.date.getMinutes() < 10) {
          this.createResponseTimePmFor0();
        } else if (this.date.getMinutes() >= 10) {
          this.createResponseTimePmFor10();
        }
      }
      this.getAppendChild();
    }
    // if hours > 16
    else if (this.hours >= 16) {
      this.textName = document.createTextNode(
        "Good evening " +
          this.containerInfo[0] +
          " Today's weather says it is " +
          this.data.weather[0].description
      );
      this.containerText.appendChild(this.textName);
      if (this.date.getHours() >= 0 || this.date.getHours() < 12) {
        if (this.date.getMinutes() < 10) {
          this.createResponseTimeAmFor0();
        } else if (this.date.getMinutes() >= 10) {
          this.createResponseTimeAmFor10();
        }
      } else if (this.date.getHours() >= 12 || this.date.getHours() <= 0) {
        if (this.date.getMinutes() < 10) {
          this.createResponseTimePmFor0();
        } else if (this.date.getMinutes() >= 10) {
          this.createResponseTimePmFor10();
        }
      }
      this.getAppendChild();
    }
  }

  getAppendChild() {
    this.divName.appendChild(this.containerText);
    this.divName.appendChild(this.textHour);
  }

  createResponseTimeAmFor0() {
    this.textHour = document.createTextNode(
      "The exact time for this location is:  " +
        this.date.getHours() +
        ":" +
        "0" +
        this.date.getMinutes() +
        " AM"
    );
  }

  createResponseTimePmFor0() {
    this.textHour = document.createTextNode(
      "The exact time for this location is:  " +
        this.date.getHours() +
        ":" +
        "0" +
        this.date.getMinutes() +
        " PM"
    );
  }

  createResponseTimeAmFor10() {
    this.textHour = document.createTextNode(
      "The exact time for this location is:  " +
        this.date.getHours() +
        ":" +
        this.date.getMinutes() +
        " AM"
    );
  }

  createResponseTimePmFor10() {
    this.textHour = document.createTextNode(
      "The exact time for this location is:  " +
        this.date.getHours() +
        ":" +
        this.date.getMinutes() +
        " PM"
    );
  }

  sun() {
    // Icon for weather
    this.icon = document.getElementById("meteoIco");
    this.i = document.createElement("i");
    if (this.date.getHours() >= 5) {
      this.i.className = "fas fa-sun";
    } else if (this.date.getHours() >= 20 || this.date.getHours() < 5) {
      this.i.className = "fas fa-moon";
    }

    this.icon.appendChild(this.i);
    this.createElements();
  }

  clouds() {
    // Icon for weather
    this.icon = document.getElementById("meteoIco");
    this.i = document.createElement("i");
    if (this.date.getHours() >= 5) {
      this.i.className = "fas fa-cloud";
    } else if (this.date.getHours() >= 20 || this.date.getHours() < 5) {
      this.i.className = "fas fa-moon-cloud";
    }
    this.icon.appendChild(this.i);
    this.createElements();
  }

  brokenClouds() {
    const icon = document.getElementById("meteoIco");
    const i = document.createElement("i");
    if (this.date.getHours() >= 5) {
      i.className = "fas fa-smoke";
    } else if (this.date.getHours() >= 20 || this.date.getHours() < 5) {
      this.i.className = "fas fa-clouds-moon";
    }

    icon.appendChild(i);
    this.createElements();
  }

  rain() {
    const icon = document.getElementById("meteoIco");
    const i = document.createElement("i");
    if (this.date.getHours() >= 5) {
      i.className = "fas fa-cloud-showers-heavy";
    } else if (this.date.getHours() >= 20 || this.date.getHours() < 5) {
      this.i.className = "fas fa-cloud-moon-rain";
    }

    icon.appendChild(i);
    this.createElements();
  }

  fog() {
    const icon = document.getElementById("meteoIco");
    const i = document.createElement("i");
    i.className = "fas fa-fog";
    icon.appendChild(i);
    this.createElements();
  }

  mist() {
    const icon = document.getElementById("meteoIco");
    const i = document.createElement("i");
    if (this.date.getHours() >= 5) {
      i.className = "fad fa-sun-cloud";
    } else if (this.date.getHours() >= 20 || this.date.getHours() < 5) {
      this.i.className = "fad fa-moon-cloud";
    }

    icon.appendChild(i);
    this.createElements();
  }

  snow() {
    const icon = document.getElementById("meteoIco");
    const i = document.createElement("i");
    i.className = "fas fa-snowflake";
    icon.appendChild(i);
    this.createElements();
  }

  createElements() {
    //Location
    const location = document.getElementById("loc");
    const span = document.createTextNode(this.data.name);
    location.appendChild(span);

    //Wind
    const wind = document.getElementById("wind");
    const span2 = document.createTextNode(this.data.wind.speed + " km/h");
    wind.appendChild(span2);

    //humidity
    const humidity = document.getElementById("humy");
    const span3 = document.createTextNode(this.data.main.humidity + " %");
    humidity.appendChild(span3);

    //pressure
    const pressure = document.getElementById("press");

    const span4 = document.createTextNode(
      this.data.main.pressure.toLocaleString() + " mb↓"
    );
    pressure.appendChild(span4);

    //visibility
    const visibility = document.getElementById("visib");
    const span5 = document.createTextNode(
      Math.floor(this.data.visibility / 1000) + " km"
    );
    visibility.appendChild(span5);

    //temperature
    const temperature = document.getElementById("temper");
    const span6 = document.createTextNode(
      Math.floor(this.data.main.temp) + "°"
    );
    temperature.appendChild(span6);

    this.buttonLog.addEventListener("click", () => {
      localStorage.clear(); //delete localStorage after press button
      console.log(localStorage);
      this.container.innerHTML = "";
      this.buttonLog.innerHTML = "";
      this.logOut(this.container);
    });
  }

  logOut(contenitor) {
    //title
    const divTitle = document.createElement("div");
    divTitle.className = "title";
    contenitor.appendChild(divTitle);
    const firstH2 = document.createElement("h2");
    firstH2.className = "title-h2";
    firstH2.textContent = "Welcome to the Weather App";
    divTitle.appendChild(firstH2);
    const secondH2 = document.createElement("h2");
    secondH2.className = "title2-h2";
    secondH2.textContent = "What is your name?";
    divTitle.appendChild(secondH2);

    //container input Name
    const divInput = document.createElement("div");
    divInput.className = "container-input";
    contenitor.appendChild(divInput); //Aggiungi il div per gli input
    const divName = document.createElement("div");
    divName.className = "container-input-name";
    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.placeholder = "name";
    inputName.className = "input-name";
    inputName.id = "inp";
    divName.appendChild(inputName);
    contenitor.appendChild(divInput);
    divInput.appendChild(divName);
    divName.appendChild(inputName);

    //container location
    const divLocationTitle = document.createElement("div");
    divLocationTitle.className = "location";
    const locationH2 = document.createElement("h2");
    locationH2.className = "location-h2";
    locationH2.textContent = "What is your location?";
    divLocationTitle.appendChild(locationH2);
    const inputLocation = document.createElement("input");
    inputLocation.type = "search";
    inputLocation.placeholder = "location";
    inputLocation.className = "search";
    inputLocation.id = "inpSearch";
    divLocationTitle.appendChild(inputLocation);
    //button location
    const btnSearch = document.createElement("button");
    btnSearch.type = "button";
    btnSearch.textContent = "Search";
    btnSearch.className = "search-button";
    btnSearch.id = "btnSearch";
    divLocationTitle.appendChild(btnSearch);
    divInput.appendChild(divLocationTitle);
    new Wheatherinfo();
  }

  saveToLocalStorage() {
    window.localStorage.setItem("info", JSON.stringify(this.containerInfo));
    console.log(window.localStorage);
  }
}

window.onload = () => {
  new Wheatherinfo();
};
