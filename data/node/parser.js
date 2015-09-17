var fs = require('fs');

module.exports=function(filename){
    var input = fs.readFileSync(filename).toString()
        input = input.replace(/%(".*?")/g,"<img class='imageButton' src=$1>" );

    var rows = input.split('\n').map(function(row){return row.split(';')});
    rows = rows.map(function (row){
        return row.map(function(symbol){
            var expr = symbol.split(":=");
            if (expr.length===1) return symbol;
            var symbol = {
                value: expr,
                button: expr[0],
                action: function(){
                return expr[1];
            }};
            return symbol;
        });
    });
    return rows;
};