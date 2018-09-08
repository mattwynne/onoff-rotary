const EventEmitter = require('events').EventEmitter;
const Gpio = require('onoff').Gpio;

/**
 * Creates a new Rotary Encoder using two GPIO pins
 * Expects the pins to be configured as pull-up
 *
 * @param pinA GPIO # of the first pin
 * @param pinB GPIO # of the second pin
 *
 * @returns EventEmitter
 */
function RotaryEncoder(pinA, pinB) {
	this.gpioA = new Gpio(pinA, 'in', 'both');
	this.gpioB = new Gpio(pinB, 'in', 'both');

	this.a = 0;
	this.b = 0;
	this.last = null;

	this.gpioA.watch((err, value) => {
		if (err) {
			this.emit('error', err);
			return;
		}
		if (this.last === 'a')
			return
		this.last = 'a'
		this.a = value;
		this.tick(-1);
	});

	this.gpioB.watch((err, value) => {
		if (err) {
			this.emit('error', err);
			return;
		}
		if (this.last === 'b')
			return
		this.last = 'b'
		this.b = value;
		this.tick(1);
	});
}

RotaryEncoder.prototype = EventEmitter.prototype;

RotaryEncoder.prototype.tick = function tick(direction) {
	const { a, b } = this;

	if (a === 1 && b === 1) {
		this.emit('rotation', direction);
	}
};

module.exports = function rotaryEncoder(pinA, pinB) {
	return new RotaryEncoder(pinA, pinB);
};
