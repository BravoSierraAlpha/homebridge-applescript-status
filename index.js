var Service;
var Characteristic;

var applescript = require('applescript');

module.exports = (homebridge) => {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory('homebridge-applescript-status', 'AppleScript', AppleScriptAccessory);
}

const ApplescriptAccessory = (log, config) => {
	this.log = log;
	this.service = 'Switch';
	this.config = config
}

class AppleScriptAccessory {

	setState (powerOn, callback) {
		const state = powerOn ? 'on' : 'off';
		let command = this.config[state];

		if (this.config.type === 'file') {
			applescript.execFile(command, done);
		} else {
			command = command.replace(/''/g, '"');

			applescript.execString(command, done);
		}

		const done = (err) => {
			if (err) {
				accessory.log('Error: ' + err);
				callback(err || new Error('Error setting ' + this.config.name + ' to ' + state));
			} else {
				accessory.log('Set ' + this.config.name + ' to ' + state);
				callback(null);
			}
		}
	}

	retrieveSwitchState () {
		let command = this.config.status;
		if (!command) return

		if (this.config.type === 'file') {
			applescript.execFile(command, done);
		} else {
			command = command.replace(/''/g, '"');

			applescript.execString(command, done);
		}

		const done = (err, response) => {
			setTimeout(this.retrieveSwitchState, 1000);

			if (err) return;

			this.switchService.setCharacteristic(Characteristic.On, !!response);
		}
	}

	getServices () {
		const informationService = new Service.AccessoryInformation();
		const switchService = new Service.Switch(this.config.name);

		informationService
			.setCharacteristic(Characteristic.Manufacturer, 'Applescript Manufacturer')
			.setCharacteristic(Characteristic.Model, 'Applescript Model')
			.setCharacteristic(Characteristic.SerialNumber, 'Applescript Serial Number');

		switchService
			.getCharacteristic(Characteristic.On)
			.on('set', this.setState.bind(this));

		this.switchService = switchService;
		this.retrieveSwitchState();

		return [switchService];
	}
}
