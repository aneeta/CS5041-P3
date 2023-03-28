
// Global variables

const samples = 32                     // for calibrating capacitive sensors
const threshold = 15                     // Threshold to permit natural fluctuations in capacitance without interaction

let p0_calibration = 0
let p1_calibration = 0
let p2_calibration = 0


// Set up 
pins.setPull(DigitalPin.P0, PinPullMode.PullNone) // pins.setPull(DigitalPin.P<X>, PinPullMode.PullNone)
pins.setPull(DigitalPin.P1, PinPullMode.PullNone)
pins.setPull(DigitalPin.P2, PinPullMode.PullNone)


// Get readings of the ambient capacitance 
function getPinReadings() {

    let p0_reading = 0
    let p1_reading = 0
    let p2_reading = 0

    for (let index = 0; index <= samples; index++) {

        // Read analog pins
        p0_reading += pins.analogReadPin(AnalogPin.P0)
        p1_reading += pins.analogReadPin(AnalogPin.P1)
        p2_reading += pins.analogReadPin(AnalogPin.P2)

        // Write to digital pins 
        pins.digitalWritePin(DigitalPin.P0, 1)
        pins.digitalWritePin(DigitalPin.P1, 1)
        pins.digitalWritePin(DigitalPin.P2, 1)

        // Pause to allow to stabilise 
        basic.pause(1)
    }

    return [p0_reading, p1_reading, p2_reading]
}

function calibratePins() {
    let readings = getPinReadings()

    // Calibrate each pin 
    p0_calibration = readings[0] / samples
    p1_calibration = readings[1] / samples
    p2_calibration = readings[2] / samples

}

// Start sensing on pin 
function sensePins() {

    let readings = getPinReadings()

    // Sense each pin 
    let p0_state = (p0_calibration + threshold) - (readings[0] / samples)
    let p1_state = (p1_calibration + threshold) - (readings[1] / samples)
    let p2_state = (p2_calibration + threshold) - (readings[2] / samples)

    return [p0_state, p1_state, p2_state]
}

function clearDigitalPins(){

    pins.digitalWritePin(DigitalPin.P8, 0)
    pins.digitalWritePin(DigitalPin.P9, 0)
    pins.digitalWritePin(DigitalPin.P13, 0)

}

// Main code - https://www.bareconductive.com/blogs/resources/how-to-create-a-touch-sensor-for-the-micro-bit-with-electric-paint

function main() {

    // Calibrate pins at the beginning (may need to repeat sometimes)

    while (p0_calibration == 0 || p1_calibration == 0 || p2_calibration == 0) {
        calibratePins()
    }

    basic.showIcon(IconNames.Yes);
    basic.clearScreen()

    // Clear Digital Pins
    clearDigitalPins();

    // Start sensing
    basic.showIcon(IconNames.Heart);
    basic.clearScreen()

    forever(() => {

        let sense_results = sensePins()

        // Find index of minimum value
        let index = 0
        let min_v = sense_results[0]

        for(let i = 1; i < sense_results.length; i++){ // find the biggest difference in capacitance 
            if(sense_results[i] < min_v){
                min_v = sense_results[i]
                index = i
            }
        }

        if(min_v >= 0){ // No pins touched
            return 
        }

        basic.showNumber(index)

        if (index == 0) { // P0 pin 
    
            // Digital write to PIN 8 on Arduino 
            pins.digitalWritePin(DigitalPin.P8, 1)

        } else if (index == 1) { // P1 Pin 

            // Digital write to PIN 9 on Arduino
            pins.digitalWritePin(DigitalPin.P9, 1)

        } else if (index == 2) { // P2 Pin 

            // Digital write to PIN 10 on Arduino 
            pins.digitalWritePin(DigitalPin.P13, 1)

        }
        
        basic.clearScreen()

        // Allow time for the pins to stabilise 
        basic.pause(50) // may need to increase depending on Arduino loop time 

        // Clear Pins
        clearDigitalPins();
    });

}

input.onButtonPressed(Button.A, function() {
    main()
})