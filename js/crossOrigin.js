function request(url, type, param, isasync, callback) {
    var myUrl = url
    var proxy = 'https://cors-anywhere.herokuapp.com/';
    var finalURL = proxy + myUrl;

    if(type.toUpperCase()=='GET') {
        $.ajax({
            url: proxy + myUrl,
            async: isasync,
            type: 'GET',
            dataType: 'text',
            complete: function(data) {
                callback(data)
            }
        })
    } else if(type.toUpperCase()=='POST') {
        $.ajax({
            url: proxy + myUrl,
            async: isasync,
            type: 'POST',
            data: param,
            dataType: 'text',
            complete: function(data) {
                callback(data)
            }
        })
    }

}