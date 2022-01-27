#include <Adafruit_NeoPixel.h>
#define PIN 5
#define NUMPIXELS 5
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

int dir = 1;
int bright = 97;

void setup()  {

  strip.begin();
  strip.show();

}

void loop() {
  uint32_t blueFade = strip.ColorHSV(3303,255,bright); 
  strip.fill(blueFade);                                 
  strip.show();                                        
  bright = bright + dir;                                
  if(bright > 100 || bright < 1) dir = dir * -1;       
  delay(30);                                          
  }
