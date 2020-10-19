const COORDS = 'coords';
//기상정보API
const API_KEY="e44bd0892d94d2586c860b01d689444c";

const lang ="kr";
const exclude="daily";


//미세먼지API
const API_KEY2="idFJGUokSwnbs%2F%2FMIeXlphHPdclT2bxh22Hy0fFlUouh8o3VI%2BcQjE3aQRk%2FYr26Z%2F%2FvRRfO1u3X%2FyW64imcIA%3D%3D";

const numOfRows=1;
const pageNo=1;
const stationName="수내동";
const dataTerm="DAILY";
const ver=1.3;

/*****/
var cnt=0;
var daily;

//실시간 날씨
//https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric
//5일예보(3h)
//https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}
//일주일예보
//https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}&lang=kr&units=metric`
        
function setData1(json){
    console.log("와쓰");
    console.log(json);

    console.log("대표날씨:"+json.weather[0].main);
    console.log("온도: "+json.temp.day);//day,night,morn,night
    console.log("체감온도: "+json.feels_like.day);//day,night,morn,night
    console.log("습도: "+json.humidity);
    console.log("최고온도: "+json.temp.max);
    console.log("최저온도: "+json.temp.min);
    
    if(json.weather[0].main === "Clear"){
            $("#howsweather").attr("src", "./img/sunny.png");
            mainWeather="맑음";
        } else if(json.weather[0].main === "Clouds"){
            $("#howsweather").attr("src", "./img/cloudy.png");
            mainWeather="흐림";
        }

        document.querySelector("#main_weather").innerText=mainWeather;
        document.querySelector("#temp").innerText=json.temp.day;
        document.querySelector("#feel_like").innerText=json.feels_like.day;
        document.querySelector("#hum").innerText=json.humidity;
        document.querySelector("#temp_min").innerText=json.temp.max;
        document.querySelector("#temp_max").innerText=json.temp.min;

        if(cnt==1 || cnt==2){
            $(".change").css("display","none");
        }else{
            $(".change").css("display","block");
        }

}

function changeWhen(){
    var whenText=document.querySelector("#when");
    //alert("눌렀다!");
    if(cnt==0){
        cnt+=1;
        whenText.innerText="내일";
    }else if(cnt==1){
        cnt+=1;
        whenText.innerText="모레";
    }else{
        cnt=0;
        whenText.innerText="현재";
    }


    var when="daily["+cnt+"]";
    setData1(eval(when));

}


function getWeather(lat,lon){
    //데이터가 완전히 들어온 후 .then 실행
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}&lang=kr&units=metric`
        ).then(function(response){
            //내용물은 안보여짐
            //console.log(response);
            return response.json();
        }).then(function(json){
            daily=json.daily;
            //console.log(daily);

            var when="daily["+cnt+"]";
            //문자열을 코드로 인식하게함
            setData1(eval(when));

           
            
            getMisae();
        });
}

function getMisae(){
        
    //console.log("미세미세");
    
    var xhr = new XMLHttpRequest();
    var url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty'; /*URL*/
    var queryParams = '?' + encodeURIComponent('serviceKey') + '='+API_KEY2; /*Service Key*/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(numOfRows); /**/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(pageNo); /**/
    queryParams += '&' + encodeURIComponent('stationName') + '=' + encodeURIComponent(stationName); /**/
    queryParams += '&' + encodeURIComponent('dataTerm') + '=' + encodeURIComponent(dataTerm); /**/
    queryParams += '&' + encodeURIComponent('ver') + '=' + encodeURIComponent(ver); /**/
    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            //console.log('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
            //console.log(this.responseText);
            var jsonObj = conv2json(this.responseText);
            jsonObj=jsonObj.response.body.items.item;
            console.log(jsonObj);
            var now=jsonObj.dataTime;
            //document.querySelector("#now").innerText=now;
            
            console.log("미세먼지 등급:"+jsonObj.pm10Grade);
            console.log("미세먼지 농도: "+jsonObj.pm10Value);
            console.log("초미세먼지 등급: "+jsonObj.pm25Grade);
            console.log("초미세먼지 농도: "+jsonObj.pm25Value);
            console.log("일산화탄소 등급: "+jsonObj.coGrade);
            console.log("일산화탄소 지수: "+jsonObj.coValue);
            console.log("이산화질소 등급: "+jsonObj.no2Grade);
            console.log("이산화질소 지수: "+jsonObj.no2Value);
            
           var pm10Value=jsonObj.pm10Value;
            document.querySelector("#misae").innerText=pm10Value;
            if (pm10Value<=30){
                console.log("m1");
                $("#misaeV").attr("src", "./img/smile.png");
            } else if(pm10Value<=80){
                console.log("m2");
                $("#misaeV").attr("src", "./img/notgood.png");
            }else if(pm10Value<=150){
                console.log("m3");
                $("#misaeV").attr("src", "./img/notgood.png");
            }
            //document.querySelector("#chomisaeGrade").innerText=jsonObj.pm25Grade;
            document.querySelector("#chomisae").innerText=jsonObj.pm25Value;
            //document.querySelector("#coGrade").innerText=jsonObj.coGrade;
            document.querySelector("#coValue").innerText=jsonObj.coValue;
            //document.querySelector("#no2Grade").innerText=jsonObj.no2Grade;
            document.querySelector("#no2Value").innerText=jsonObj.no2Value;
           

        }
    };

    xhr.send('');

}


    

function saveCoords(coordsObj){
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));//저장되어서 다시 묻지 않음
}


function handleGeoSuccess(position){
    console.log(position);

    const latitude= position.coords.latitude;
    const longitude= position.coords.longitude;

    console.log(latitude+" "+longitude);

    const coordsObj = {//서현동: 127.12, 37.38
        latitude,
        longitude
        //latitude:latitude, longitude:logitude하는것과 같음
    };

    saveCoords(coordsObj);
    getWeather(latitude,longitude);
}

function handleGeoError(){
    console.log("Cant access geo location");
}


function askForCoords(){
    navigator.geolocation.getCurrentPosition(handleGeoSuccess,handleGeoError);
}



function loadCoords(){
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null || loadedCoords === 'undefined'){
        console.log("=== 새로받아온다 ===");
        askForCoords();//
    } else {
        console.log("=== 이미있다 ===");
        const parseCoords = JSON.parse(loadedCoords);
        
        getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}




/////////////////////////////////////////////////
/////////////////////  START  ///////////////////
/////////////////////////////////////////////////

init();

function init(){
    loadCoords();
}

////////////////////////////////////////////////
/////////////////////  JSON  ///////////////////
////////////////////////////////////////////////

function parseXml(xml) {
    var dom = null;
    if (window.DOMParser) {
        try{
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        } catch (e){
            dom = null;
        }
    } else if (window.ActiveXObject) {
        try{
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
        if (!dom.loadXML(xml)) // parse error ..
            {
                window.alert(dom.parseError.reason + dom.parseError.srcText);
            }
        } catch (e){
            dom = null;
        }
    } else{
     alert("cannot parse xml string!");
    }
        
        return dom;
   }
  
   function conv2json(xml){
    var dom = parseXml(xml);
    var jsonStr = xml2json(dom);
    var jsonObj = eval( "(" + jsonStr + ")" );
    
    return jsonObj;
   }
   



