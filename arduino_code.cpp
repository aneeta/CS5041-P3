
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>  // Required for 16 MHz Adafruit Trinket
#endif

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>      // the adafruit Graphics Library
#include <Adafruit_SSD1306.h>  // adafruit library for display drivers
#include <ArduinoJson.h>

#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
#define NEOPIXEL_PIN 2
#define NUMPIXELS 24
#define OLED_RESET 4  // Reset pin # (or -1 if sharing Arduino reset pin) - // Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define BAUD_RATE 9600

#define LEFT_PIN 8
#define MIDDLE_PIN 9
#define RIGHT_PIN 13

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
Adafruit_NeoPixel pixels(NUMPIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

#define DELAYVAL 1000

void setup() {

  // Set up Arduino -> PC communication (Serial)
  Serial.begin(BAUD_RATE);

  // Set up Microbit -> Arduino communication (I2C)
  pinMode(LEFT_PIN, INPUT);
  pinMode(RIGHT_PIN, INPUT);
  pinMode(MIDDLE_PIN, INPUT);

  // OLED initialisation
  display.begin(SSD1306_SWITCHCAPVCC, 0x3D);
  display.clearDisplay();
  display.display();

  // Initialise the NeoPixel strips
  pixels.begin();
  pixels.setBrightness(20);
}


void loop() {

  // Refresh Displays
  pixels.clear();  // Set all pixel colors to 'off'
  pixels.show();

  // MICROBIT

  // Check for message
  byte part_of_plant_touched = 4;  // 0 = L, 1 = M, 2 = R

  if (digitalRead(LEFT_PIN) == HIGH) {

    part_of_plant_touched = 0;

  } else if (digitalRead(MIDDLE_PIN) == HIGH) {

    part_of_plant_touched = 1;

  } else if (digitalRead(RIGHT_PIN) == HIGH) {

    part_of_plant_touched = 2;
  }

  if (part_of_plant_touched != 4) {

    // Sending to Python code
    Serial.println(part_of_plant_touched);

    // OLED
    display.setCursor(0, 0);  // Start at top-left corner
    display.clearDisplay();
    display.setTextColor(WHITE);  // Draw white text
    display.println(F("Message Sent!"));
    display.display();            //refresh display

    // Informing user
    // The first NeoPixel in a strand is #0, second is 1, all the way up to the count of pixels minus one.
    for (int i = 0; i < NUMPIXELS; i++) {  // For each pixel...

      // pixels.Color() takes RGB values, from 0,0,0 up to 255,255,255
      pixels.setPixelColor(i, pixels.Color(0, 150, 0));
      pixels.show();  // Send the updated pixel colors to the hardware.
      // delay(DELAYVAL); // Pause before next pass through loop
    }

    // Prevent the HIGH pin from being read multiple times
    delay(DELAYVAL);
  }
}


StaticJsonDocument<128> doc;

// Receive JSON object from PC
void serialEvent() {

  // Parse JSON
  String payload = Serial.readStringUntil('\n');
  
  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    Serial.println(error.c_str());
    return;
  }

  pixels.clear();  // Set all pixel colors to 'off'
  pixels.show();

  // Extract JSON Colour Content
  String r = doc["r"];
  String g = doc["g"];
  String b = doc["b"];

  // Process JSON object
  byte i = 0;
  String loc = doc["l"];
  if (loc.toInt() == 0) {  // Left Stem
    i = 0;
  } else if (loc.toInt() == 1) {  // Middle Stem
    i = 8;
  } else {
    i = 16;  // Right Stem
  }

  byte max = i + 8;
  for (; i < max; i++) {  // For each pixel...

    // pixels.Color() takes RGB values, from 0,0,0 up to 255,255,255
    pixels.setPixelColor(i, pixels.Color(r.toInt(), g.toInt(), b.toInt()));
    pixels.show();  // Send the updated pixel colors to the hardware.
    delay(100);
  }

  // Process Message
  String message = doc["m"];
  display.setCursor(0, 0);  // Start at top-left corner
  display.clearDisplay();
  display.setTextColor(WHITE);  // Draw white text
  display.println(message);
  display.display();            //refresh display
}
