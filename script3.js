window.onload = () => {
  //1
  setTimeout(() => new WeatherInfo(), 5000);
};

class WeatherInfo {
  constructor() {
    // 2
    this.displayBody();
    let localName = window.localStorage.getItem("name"); //Read Storage
    let localLocation = window.localStorage.getItem("location"); //Read Storage
    this.checkLocal(localName, localLocation); //Check if in local have something
  }

  displayBody() {
    document.getElementById("loading").style.display = "none";
    this.nav = document.getElementById("navBar");
    this.nav.style.display = "flex";
    this.section = document.getElementById("cont-home");
    this.section.style.display = "flex";
    document.getElementsByTagName("footer")[0].style.display = "flex";
  }

  //3
  checkLocal(name, location) {
    if (name == null && location == null) {
      //if..is null(is nothing there)

      this.getUserInput(); //get input from user
    } else {
      //else is something in local Storage
      this.convertJson(location); //call Server
      this.removeBody(); //First remove body
    }
  }

  getUserInput() {
    this.inputName = document.getElementById("input-name");
    this.inputLocation = document.getElementById("input-location");

    document.getElementById("input-button").addEventListener("click", () => {
      if (
        this.inputName.value.length > 0 &&
        this.inputLocation.value.length > 0
      ) {
        this.saveToLocalStorage();
        this.convertJson(this.inputLocation.value); //call Server with this location
        this.removeBody(); //First remove body
      }
    });
  }

  loadAjax(location) {
    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest(); //Ajax request
      xhttp.open(
        "GET",
        `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=a910fee0cd049472598ab5bd81087ac5`,
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
  //4
  async convertJson(location) {
    console.log("hatz");
    try {
      const weather = await this.loadAjax(location); //Wait response from Ajax
      this.data = JSON.parse(weather); //convert the server response in js object
      console.log(this.data);

      this.showIcon("clear sky", this.sun());
      this.showIcon("rain", this.rain());
      this.showIcon("ligth rain", this.rain());
      this.showIcon("haze", this.haze());
      this.showIcon("snow", this.snow());
      this.showIcon("scattered clouds", this.clouds());
      this.showIcon("overcast clouds", this.clouds());
      this.showIcon("few clouds", this.clouds());
      this.showIcon("fog", this.fog());
      this.showIcon("mist", this.mist());
      this.showIcon("broken clouds", this.brokenClouds());

      console.log("success?", this.data);
    } catch (err) {
      console.log("eroare?", err);
      this.removeBody();
      this.createError();
    }
  }

  createError() {
    this.nav.style.display = "none";
    document.getElementsByTagName("footer")[0].style.display = "none";
    const container = this.createElements("div", "cont", "container");
    const content = this.createElements("div", "content");
    container.appendChild(content);
    const contentH2 = this.createElements("h2");
    const textH2 = document.createTextNode("404");
    contentH2.appendChild(textH2);
    content.appendChild(contentH2);
    const messageError = this.createElements("h4");
    const textError = document.createTextNode("Opps! Page not found");
    messageError.appendChild(textError);
    content.appendChild(messageError);
    const descriptionError = this.createElements("p");
    const textDescription = document.createTextNode(
      "It looks like the page was not found because you may have typed the wrong location or the server is not responding at this time"
    );
    descriptionError.appendChild(textDescription);
    content.appendChild(descriptionError);
    const buttonBack = this.createElements(
      "button",
      "back-button",
      "error-button"
    );
    const textBackButton = document.createTextNode("Back to Home");
    buttonBack.appendChild(textBackButton);
    content.appendChild(buttonBack);
    this.section.appendChild(container);
    this.moveEffect(container);
    buttonBack.addEventListener("click", () => {
      this.removeBody();
      console.clear();
      this.createFormBody(); //This is the initial body
      window.localStorage.clear();
      this.checkLocal();
      this.nav.style.display = "flex";
      document.getElementsByTagName("footer")[0].style.display = "flex";
    });
  }

  moveEffect(contenitor) {
    //mose effect for error section
    if (this.nav.style.display == "none") {
      window.onmousemove = e => {
        let x = -e.clientX / 5,
          y = -e.clienty / 5;
        contenitor.style.backgroundPositionX = x + "px";
        contenitor.style.backgroundPositionY = y + "px";
      };
    }
  }

  showIcon(descrizione, funzione) {
    //Condition for show icon
    if (this.data.weather[0].description == descrizione) {
      this.displayContent();
    }
  }

  removeBody() {
    this.section.innerHTML = "";
  }

  //5
  displayContent() {
    //Display body

    //nav log-out
    this.button_Log_Out = this.createElements("button", "log-out", "id-log");
    const icon_Log_Out = this.createElements("i", "far fa-sign-out-alt");
    this.button_Log_Out.appendChild(icon_Log_Out);
    this.nav.appendChild(this.button_Log_Out);
    this.button_Log_Out.addEventListener("click", () => {
      this.removeBody();
      this.nav.removeChild(this.button_Log_Out);
      this.createFormBody(); //This is the initial body
      window.localStorage.clear();
      this.checkLocal();
    });

    //containerInfo
    const containerInfo = this.createElements("div", "container-info");
    this.section.appendChild(containerInfo);
    //info
    this.info = this.createElements("div", "info");
    containerInfo.appendChild(this.info);
    this.location(); //create container for location
    const wind = this.createWeatherInfo(
      "container-wind",
      "container-wind-id",
      "Wind :",
      this.data.wind.speed,
      " Km/h",
      "fad fa-windsock"
    ); //create wind info
    const humidity = this.createWeatherInfo(
      "container-humidity",
      "container-humidity-id",
      "Humidity :",
      this.data.main.humidity,
      " %",
      "fas fa-humidity"
    );
    const pressure = this.createWeatherInfo(
      "container-pressure",
      "container-pressure-id",
      "Pressure :",
      this.data.main.pressure.toLocaleString(),
      " hPa",
      "far fa-heat"
    );
    const visibility = this.createWeatherInfo(
      "container-visibility",
      "container-visibility-id",
      "Visibility :",
      Math.floor(this.data.visibility / 1000),
      " Km",
      "far fa-eye"
    );
    const temperature = this.conditionForTemperature(); //condition for icon Temperature
    this.containerMeteo(); //apelez functia pentru a prelua icaoana creata si a puneo in body aici

    this.containerDescription = this.createElements(
      "div",
      "container-description"
    );
    this.message = this.conditionForTime(); //message based on time
    console.log(this.message);
    this.containerDescription.appendChild(this.message);
    this.container_Meteo.appendChild(this.containerDescription);
  }

  createWeatherInfo(
    nameClass,
    nameId,
    nodeText,
    dataServer,
    valueForData,
    classIcon
  ) {
    //container for show info for wind,rain etc..
    const container = this.createElements("div", nameClass, nameId);
    this.info.appendChild(container); //append container info
    const text = document.createTextNode(nodeText);
    container.appendChild(text);
    const containerValue = this.createElements(
      "div",
      "container-Value",
      "container-Value-id"
    );
    container.appendChild(containerValue);
    const value = document.createTextNode(dataServer + valueForData); //valoarea de la server pentru fiecare element
    containerValue.appendChild(value);
    const icon = this.createElements("i", classIcon);
    container.appendChild(icon);
    return container;
  }

  conditionForTime() {
    this.getTime();

    if (this.hours > 0 && this.hours <= 12 || this.hours == '00') {
      //AM
      this.format = "AM";
      const condition = this.conditionForMinutes("Good Morning");
      return condition;
    } else if (this.hours > 12 && this.hours <= 19) {
      this.format = "PM";
      const condition = this.conditionForMinutes("Good Afternoon");
      return condition;
    } else if (this.hours > 19) {
      this.format = "PM";
      const condition = this.conditionForMinutes("Good Evening");
      return condition;
    }
  }

  getTime() {
    this.date = new Date(); //create a date
    this.hours = this.date.getHours(); //get hours from pc
    this.date.setUTCSeconds(this.date.getUTCSeconds() + this.data.timezone); //get time from a location
  }

  conditionForMinutes(text) {
    if (this.date.getMinutes() < 10) {
      //Description for container Meteo
      const descriptionText = document.createTextNode(
        `${text} ${localStorage.name}, today's weather says it is ${
          this.data.weather[0].description
        }. The exact time for this location is : ${this.date.getHours() - 1}:0${this.date.getMinutes()} ${
          this.format
        }`
      );

      return descriptionText;
    } else {
      //Description for container Meteo
      const descriptionText = document.createTextNode(
        `${text} ${localStorage.name}, today's weather says it is ${
          this.data.weather[0].description
        }. The exact time for this location is : ${this.date.getHours() - 1}:${this.date.getMinutes()} ${
          this.format
        }`
      );
      return descriptionText;
    }
  }

  location() {
    //location(Rome for ex)
    const location = this.createElements("div", "location", "location-id");
    this.info.appendChild(location);
    const textLocation = document.createTextNode(this.data.name);
    location.appendChild(textLocation);
  }

  containerMeteo() {
    //Container Meteo(icon for weather, and information about time,and weather)
    this.container_Meteo = this.createElements("div", "container-meteo");
    const containerIcon = this.createElements("div", "container-icon");
    //icon for Meteo(trebuie sa o bag intro functie aparte pentru a fii folosita de toti)

    containerIcon.appendChild(this.i);
    this.container_Meteo.appendChild(containerIcon);
    this.section.appendChild(this.container_Meteo);
  }

  //icon for a temperature condition (termometer)
  conditionForTemperature() {
    if (this.data.main.temp > 18) {
      const iconForTemperature = this.createWeatherInfo(
        "container-temperature",
        "container-temperature-id",
        "Temperature :",
        Math.floor(this.data.main.temp),
        " °C",
        "fad fa-temperature-up"
      );
      return iconForTemperature;
    } else {
      const iconForTemperature = this.createWeatherInfo(
        "container-temperature",
        "container-temperature-id",
        "Temperature :",
        Math.floor(this.data.main.temp),
        " °C",
        "fal fa-temperature-down"
      );
      return iconForTemperature;
    }
  }

  //create icon for Weather
  sun() {
    this.iconName("fas fa-sun", "fas fa-sun");
  }

  clouds() {
    this.iconName("fas fa-cloud", "fas fa-moon-cloud");
  }

  brokenClouds() {
    this.iconName("fas fa-smoke", "fas fa-clouds-moon");
  }

  rain() {
    this.iconName("fas fa-cloud-showers-heavy", "fas fa-cloud-moon-rain");
  }

  fog() {
    this.iconName("fas fa-fog", "fas fa-fog");
  }

  mist() {
    this.iconName("fad fa-sun-cloud", "fad fa-moon-cloud");
  }

  snow() {
    this.iconName("fas fa-snowflake", "fas fa-snowflake");
  }

  haze() {
    this.iconName("far fa-sun-haze", "fad fa-cloud-moon-rain");
  }

  iconName(classNameDay, classNameNight) {
    //icon for morning and evening
    this.getTime();
    this.i = document.createElement("i");

    if (this.date.getHours() >= 5) {
      //se l'ora e piu grande di 5 si mattina
      this.i.className = classNameDay;
    } else if (this.date.getHours() >= 20 || this.date.getHours() < 5) {
      this.i.className = classNameNight;
    }
  }

  createFormBody() {
    const form = this.createElements("form", "box");
    this.section.appendChild(form);
    const title = this.createElements("h2", "title");
    const titleText = document.createTextNode("Welcome to the Weather App");
    title.appendChild(titleText);
    form.appendChild(title);
    const titleName = this.createElements("h2", "title-name");
    const textTitleName = document.createTextNode("What is your name?");
    titleName.appendChild(textTitleName);
    form.appendChild(titleName);
    const inputForName = this.createElements("input", "", "input-name");
    inputForName.type = "text";
    inputForName.placeholder = "Name";
    form.appendChild(inputForName);
    const titleLocation = this.createElements("h2", "location-h2");
    const textTitleLocation = document.createTextNode("What is your location?");
    titleLocation.appendChild(textTitleLocation);
    form.appendChild(titleLocation);
    const inputForLocation = this.createElements("input", "", "input-location");
    inputForLocation.type = "search";
    inputForLocation.placeholder = "Location";
    form.appendChild(inputForLocation);
    const inputButton = this.createElements("input", "", "input-button");
    inputButton.type = "button";
    inputButton.value = "Enter";
    form.appendChild(inputButton);
    return form;
  }

  //Document construction for everything
  createElements(typeElement, nameClass, idElement) {
    const container = document.createElement(typeElement);
    container.className = nameClass;
    container.id = idElement;
    return container;
  }

  saveToLocalStorage() {
    window.localStorage.setItem("name", this.inputName.value);
    window.localStorage.setItem("location", this.inputLocation.value);
    console.log(window.localStorage);
  }
}
