try{
    
var $ = require('./common');
var parser = require('../../node/parser')
    var timer, part;
    var isRun = false;
    var part;
    var inrow;
    var choose;
    var choosenkey;
    var rowCount = 0;
    var keyrows = [];
    var systemrows = [];
    var tr = [];
    var tds = [];
    var keyboard = document.getElementById('keyboard');
    var SystemButtons = document.getElementById('systemButtons');
    
    var app = {
        initialize: function () {
            keyrows = parser(__dirname + "/../../../sets/qwerty.ru.dq")
            document.getElementById('app').onclick = chooseFunc;

            systemrows.push(["Шаг назад", "Очистить"]);

            loadButtons();

            $('#timeout')[0].onchange = changeTimeout;
            if (!window.localStorage.timeout) {
                window.localStorage.timeout = 1;
            }
            $('#timeout')[0].value = window.localStorage.timeout;


        }

    };

    function start() {
        if (isRun) return;
        isRun = true;
        var timeout = window.localStorage.timeout;

        choose = -1;
        part = 0;
        timer = setInterval(interval, timeout * 1000);

    }

    function stop() {
        isRun = false;

        clearInterval(timer);

    }

    function chooseFunc() {
        if (!isRun) return;

        if (part === 0) {
            part = 1;
            inrow = choose;
            choose = -1;

            tr[inrow].style.background = '#FFF';
            tr[inrow].style.color = '#000';
            return;
        }


        tds[inrow][choose].style.background = 'inherit';
        tds[inrow][choose].style.color = 'inherit';

        switch (choosenkey) {

            case "^":
                choose = inrow;
                part = 0;
                return;
                break;
            case "Шаг назад":
                document.getElementById('inputBox').innerHTML = document.getElementById('inputBox').innerHTML.slice(0, -1);
                part = 0;
                choose = -1;

                break;
            case "Очистить":
                api.clear()
                choose = -1;
                part = 0;
                break;

            case "Сказать":
                choose = -1;
                part = 0;

                break;
            default:
                    var value = choosenkey;
                    if(tds[inrow][choose].action) value=tds[inrow][choose].action();
                    document.getElementById('inputBox').innerHTML += value;
                break;
        }
        ;
        part = 0;
        choose = -1;


    }

    function addbuttons(arr, table) {
        if (arr[0].length > 0) {
            for (var row in arr) {
                tr.push(document.createElement('tr'));
                var td = [];
                for (var keyid in arr[row]) {
                    td[keyid] = document.createElement('td');
                    if ('object' === typeof arr[row][keyid]){
                        var keyobj=arr[row][keyid];
                        td[keyid].innerHTML=keyobj.button;
                        td[keyid].action=keyobj.action;
                        td[keyid].title = keyobj.value[1];
                    }
                    else {
                        td[keyid].innerHTML = arr[row][keyid];
                    }
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

    function loadButtons() {
        stop();
        keyboard.innerHTML = '';
        SystemButtons.innerHTML = '';
        rowCount = 0;
        tr = [];
        tds = [];
        addbuttons(keyrows, keyboard);
        addbuttons(systemrows, SystemButtons);
    }

    app.initialize();
    window.api = {
        clear: function () {
            document.getElementById('inputBox').innerHTML = '';
        },
        start: start,
        stop: stop,
        timeoutDialog: timeoutDialog,
        loadWords: loadWords,
        chooseFunc: chooseFunc
    }
    function interval() {


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
            return;
        }

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

    function changeTimeout() {

        var t = parseFloat(this.value);

        if (t === NaN) return false;
        this.style.display = "none"
        window.localStorage.timeout = t;
        if (!isRun) return;
        stop();
        start();
    }

    function timeoutDialog() {
        var timeoutDiv = $("#timeout")[0];

        timeoutDiv.style.display = "block";
        timeoutDiv.focus();
    }

    function loadWords() {
        window.frame.openDialog({
            type: 'open', // Either open or save
            title: 'Выберете файл...', // Dialog title, default is window title
            multiSelect: false // Allows multiple file selection

        }, function (error, file) {
            if (error) return;
            file = file[0];
            var rows = parser(file);
            stop();
            keyrows = rows;
            loadButtons();
            start();
        })
    }
}
catch(e){
    console.error(e)
}