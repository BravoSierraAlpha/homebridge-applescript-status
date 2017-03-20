var Service;
var Characteristic;

var applescript = require('applescript');

module.exports = (homebridge) => {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory('homebridge-applescript-status', 'AppleScript', AppleScriptAccessory);
}

class AppleScriptAccessory {

	constructor (log, config) {
		this.log = log;
		this.service = 'Switch';
		this.config = config;

		this.retrieveSwitchState = this.retrieveSwitchState.bind(this)

		this.on = false
	}

	setState (on, callback) {
		const state = on ? 'on' : 'off';
		let command = this.config[state];

		if (this.on === on) return callback()

		const done = (err) => {
			if (err) {
				this.log('Error: ' + err);
				callback(err || new Error('Error setting ' + this.config.name + ' to ' + state));
			} else {
				this.on = on

				this.log('Set ' + this.config.name + ' to ' + state);
				callback(null);
			}
		}

		if (this.config.type === 'file') {
			applescript.execFile(command, done);
		} else {
			command = command.replace(/''/g, '"');

			applescript.execString(command, done);
		}
	}

	retrieveSwitchState () {
		let command = this.config.status;
		if (!command) return

		const done = (err, on) => {
			setTimeout(this.retrieveSwitchState, (this.config.statusCheckInterval || 1) * 1000);

			if (err) return;

			this.on = !!on

			this.switchService.setCharacteristic(Characteristic.On, !!on);
		}

		if (this.config.type === 'file') {
			applescript.execFile(command, done);
		} else {
			command = command.replace(/''/g, '"');

			applescript.execString(command, done);
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
