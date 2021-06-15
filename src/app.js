var express = require('express');
var path = require('path');
var routes = require('./routes');

var app = express();

app.set('port', process.env.PORT || 1984);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(routes);
app.use(express.static(__dirname + '/static/'));

app.listen(app.get('port'), function() {
    console.log('iview-proxy started on port ' + app.get('port'));
});