var timer, part;
var smsPart = 0;
var isRun = false;
var part;
var inrow;
var choose;
var choosenkey;
var startacc;
var rowCount = 0;
var keyrows = [];
var fastwords = new Array();
fastwords[0] = new Array();
var systemrows = [];
var tr = [];
var tds = [];
var keyboard = document.getElementById('keyboard');
var fastButtons = document.getElementById('fastButtons');
var SystemButtons = document.getElementById('SystemButtons');
var wordList = document.getElementById("wordList");

var watchID;

var success = function() {
    alert('Message sent successfully');
};
var error = function(e) {
    alert('Message Failed:' + e);
};
function onSuccess(acceleration) {
    var beatValue = 1 / document.getElementById('beatValue').value;
    if ((acceleration.x + acceleration.y + acceleration.z > startacc + beatValue) || (acceleration.x + acceleration.y + acceleration.z < startacc - beatValue))
    {
        chooseFunc();
    }
}

function onError() {
    alert('onError!');
}
;

var app = {
    // Application Constructor
    initialize: function() {


          keyrows.push("qwertyuiop");
        keyrows.push("asdfghjkl");
        keyrows.push("zxcvbnm");
        keyrows.push([" ", ", ", ". ", "! ", "? ", "; "]);
      

        if (window.localStorage.fastworlds) {
            fastwords[0] = (window.localStorage.fastworlds.split('!@#'));
        }
        systemrows.push([Backspace", "Clear"]);
        
        loadButtons();
        if (window.localStorage.timeout) {
            document.getElementById('timeout').value = window.localStorage.timeout;
        }
        onSettings();
        document.addEventListener("menubutton", onSettings, false);
    }

};

function start() {
    isRun = true;
    document.getElementById('startbutton').style.display = "none";
    document.getElementById('stopbutton').style.display = "inherit";
    var timeout = document.getElementById('timeout').value;
    window.localStorage.timeout = document.getElementById('timeout').value;
    choose = -1;
    part = 0;
    timer = setInterval(function()
    {


        if (part === 0) {
            if (choose > -1) {
                tr[choose].style.background = '#FFF';
                tr[choose].style.color = '#000';
            }
            if (choose < tr.length - 1) {
                choose++;
            }
            else {
                choose = 0;
            }
            tr[choose].style.background = '#000';
            tr[choose].style.color = '#FFF';
        }

        if (part === 1) {
            if (choose > -1) {
                tds[inrow][choose].style.background = 'inherit';
                tds[inrow][choose].style.color = 'inherit';
            }
            if (choose < tds[inrow].length - 1) {
                choose++;
            }
            else {
                choose = 0;
            }
            choosenkey = tds[inrow][choose].innerHTML;
            tds[inrow][choose].style.background = '#000';
            tds[inrow][choose].style.color = '#FFF';
        }
    }, timeout * 1000);

}
function stop() {
    isRun = false;
    document.getElementById('startbutton').style.display = "inherit";
    document.getElementById('stopbutton').style.display = "none";
    clearInterval(timer);
    
}
function chooseFunc() {
    if (isRun) {
        if (part === 0) {
            part = 1;
            inrow = choose;
            choose = -1;

            tr[inrow].style.background = '#FFF';
            tr[inrow].style.color = '#000';

        }
        else {
            switch (choosenkey) {
                case "^":
                    tds[inrow][choose].style.background = 'inherit';

                    tds[inrow][choose].style.color = 'inherit';
                    choose = inrow;
                    part = 0;
                    break;
                case "Backspace":
                    tds[inrow][choose].style.background = 'inherit';
                    tds[inrow][choose].style.color = 'inherit';
                    document.getElementById('inputBox').innerHTML = document.getElementById('inputBox').innerHTML.slice(0, -1);
                    part = 0;
                    choose = -1;

                    break;
                case "Clear":
                    tds[inrow][choose].style.background = 'inherit';
                    tds[inrow][choose].style.color = 'inherit';
                    document.getElementById('inputBox').innerHTML = '';
                    choose = -1;
                    part = 0;
                    break;

               default:
                    document.getElementById('inputBox').innerHTML += choosenkey;  
                    tds[inrow][choose].style.background = 'inherit';
                    tds[inrow][choose].style.color = 'inherit';

                    part = 0;
                    choose = -1;
                    break;
            }
            ;
        }
    }
}

function addbuttons(arr, table) {
    if (arr[0].length > 0) {
        for (var row in arr) {
            tr.push(document.createElement('tr'));
            var td = [];
            for (var keyid in arr[row]) {
                td[keyid] = document.createElement('td');
                td[keyid].innerHTML = arr[row][keyid];
                tds[rowCount] = td;
                tr[tr.length - 1].appendChild(td[keyid]);
            }
            td.push(document.createElement('td'));
            td[td.length - 1].innerHTML = "^";
            tds[rowCount] = td;
            tr[tr.length - 1].appendChild(td[td.length - 1]);
            table.appendChild(tr[tr.length - 1]);
            rowCount++;

        }
    }
}
function onSettings() {

    if (document.getElementById('settings').style.display === "none") {
        if (fastwords[0].length > 0) {
            wordList.innerHTML = "";
            for (var word in fastwords[0]) {
                var select = document.createElement('option');
                select.innerHTML = fastwords[0][word];
                select.value = word;
                wordList.appendChild(select);
            }
        }
        if (window.localStorage.sosNumber) {
            document.getElementById('sosNumber').value = window.localStorage.sosNumber;
        }
        document.getElementById('settings').style.display = "block";
        document.getElementById('settingsBack').style.display = "block";
    }
    else {
        document.getElementById('settings').style.display = "none";
        document.getElementById('settingsBack').style.display = "none";
    }
}

function addFast(text) {

    fastwords[0].push(text);
    window.localStorage.fastworlds = fastwords[0].join('!@#');

    loadButtons();
}
function loadButtons() {
    keyboard.innerHTML = '';
    SystemButtons.innerHTML = '';
    fastButtons.innerHTML = '';
    rowCount = 0;
    tr = [];
    tds = [];
        addbuttons(fastwords, fastButtons);
   addbuttons(keyrows, keyboard);
 addbuttons(systemrows, SystemButtons);
}
function getSelection(o) {

    var selectedOptions = [];

    for (var i in o.options)
    {
        if (o.options[i].selected === true) {
            selectedOptions.push(o.options[i].value);
            o.options[i].selected = false;
        }
    }

    return selectedOptions;

}
function removeFast() {
    var toDelete = getSelection(wordList);

    for (i in toDelete) {
        console.log(toDelete[i]);
        fastwords[0].splice(toDelete[i] - i, 1);
    }
    wordList.innerHTML = "";
    for (var word in fastwords[0]) {
        var select = document.createElement('option');
        select.innerHTML = fastwords[0][word];
        select.value = word;
        wordList.appendChild(select);
    }
    window.localStorage.fastworlds = fastwords[0].join('!@#');
    loadButtons();
}

function successInit(result) {    
    // display the extracted text   
    alert(result); 
    // make the purchase
    inappbilling.buy(successPurchase, errorCallback,"donate");

}    
function errorCallback(error) {
   alert(error); 
} 

function successPurchase(productId) {
   alert("Your item has been purchased!");
} 


app.initialize();

    document.addEventListener('mousemove',function(e){
  if( e.target.getAttribute('unselectable')=='on' )
    e.target.ownerDocument.defaultView.getSelection().removeAllRanges();
},false);
function Say(text){
new Audio("http://translate.google.com/translate_tts?tl=RU&q="+encodeURI(text)).play();
}
