  var app = module.exports = require('appjs');
  app.serveFilesFrom(__dirname + '/content');
  
  var menubar = app.createMenu([{
    label:'Программа',
    submenu:[
      {
        label:'Запустить',
        action: function(){
          window.api.start();
        }
      },
      {
        label:'Остановить',
        action: function(){
          window.api.stop();
        }
      },
      {
        label:'Поменять скорость переключения',
        action: function(){
          window.api.timeoutDialog();
        }
      },
      {
        label:'Выбрать набор',
        action: function(){
          window.api.loadWords();
        }
      },{
        label:'Очистить',
        action: function(){
          window.api.clear();
        }
      },
      {
        label:'Выйти',
        action: function(){
          process.exit();
        }
      }
    ]
  }]);
  
  
  menubar.on('select',function(item){
    console.log("menu item "+item.label+" clicked");
  });
  
  var window = app.createWindow({
    icons  : __dirname + '/content/icons',
      
      
  });
  
  window.on('create', function(){
    console.log("Window Created");
    window.frame.show();
    window.frame.center();
    window.frame.maximize();
    window.frame.setMenuBar(menubar);
  });
  window.on('ready', function(){
    this.Function('return '+function(require, process, Buffer){
          var Module = require('module'),
              path = require('path'),
              nodeCompile = Module.prototype._compile
  
          Module.prototype._compile = function(content, filename){
            if (inBrowser) {
              return browserCompile.call(this, content, filename);
            } else {
              return nodeCompile.call(this, content, filename);
            }
          };
  
          var inBrowser = true;
          document.mainModule = require('./content/js/index.js');
          inBrowser = false;
  
          function browserCompile(content, filename) {
            var self = this;
            this.exports = {};
            this.children = [];
            content = content.replace(/^\#\!.*/, '');
  
            function require(request){
              inBrowser = true;
              request = self.require(request);
              inBrowser = false;
              return request;
            }
  
            require.resolve = function(request){
              return Module._resolveFilename(request, self);
            };
  
            require.main = document.mainModule;
            var argNames = ['exports', 'require', 'module', '__filename', '__dirname', 'global', 'process', 'Buffer', content];
            var args = [this.exports, require, this, filename, path.dirname(filename), window, process, Buffer];
            return Function.apply(null, argNames).apply(this.exports, args);
          }
        })().call(this, require, process, Buffer);
  
    function FKey (id){return (id[0]==="F")?parseInt(id.slice(1)):false}
  
    function Command_Option_J(e){ return e.keyCode === 74 && e.metaKey && e.altKey }
      window.addEventListener('keydown', function(e){
    var fk = FKey(e.keyIdentifier);
      if (fk===12 || Command_Option_J(e)) {
        window.frame.openDevTools();
        return;
      }
        switch (fk){
          case 6:
                window.api.start();
                break;
  
          case 7:
                window.api.stop();
                break;
          case 8:
                window.api.clear();
                break;
  
        }
  
    });


  });
  
  
  window.on('close', function(){
    process.exit(0);
  });
/*
  require('./node/cordovaNet').onevent = function(event){
    if(event.event==="touchstart"){
      window.api.chooseFunc();
    }
  };*/