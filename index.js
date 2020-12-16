var Service, Characteristic;
var request = require('sync-request');

var url 

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-simple-switch", "SimpleHttpSwitch", SimpleHttpSwitch);
}


function SimpleHttpSwitch(log, config) {
    this.log = log;

    // url info
    this.url = config["url"];
    this.sendimmediately = config["sendimmediately"];
    this.name = config["name"];
}

SimpleHttpSwitch.prototype = {

    httpRequest: function (url, body, method, username, password, sendimmediately, callback) {
        request({
                    url: url,
                    body: body,
                    method: method,
                    rejectUnauthorized: false
                },
                function (error, response, body) {
                    callback(error, response, body)
                })
    },

    getPowerState: function (callback) {
        var body;

        var res = request('POST', this.url, {});
        if(res.statusCode > 400){
            this.log('HTTP power function failed');
            callback(error, false);
        }else{
            this.log('HTTP power function succeeded!');
            var info = JSON.parse(res.body);
            this.log(res.body);
            this.log(info);
            callback(null, info);
        }
    },

    setPowerState: function(powerOn, callback) {
        var body;

		var res = request('POST', this.url, {});
		if(res.statusCode > 400){
			this.log('HTTP power function failed');
			callback(error);
		}else{
			this.log('HTTP power function succeeded!');
            var info = JSON.parse(res.body);
            this.log(res.body);
            this.log(info);
			callback();
		}

    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        var informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, "Luca Manufacturer")
                .setCharacteristic(Characteristic.Model, "Luca Model")
                .setCharacteristic(Characteristic.SerialNumber, "Luca Serial Number");

        switchService = new Service.Switch(this.name);
        switchService
                .getCharacteristic(Characteristic.On)
                .on('get', this.getPowerState.bind(this))
                .on('set', this.setPowerState.bind(this));

    
        return [switchService];
    }
};