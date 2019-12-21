#include <FastLED.h>
#include <Warrolight.h>

#define STRIP_NUM_LEDS 150

int NUM_LEDS = STRIP_NUM_LEDS;

#define DATA_PIN 6

// Define the array of leds
CRGB leds[STRIP_NUM_LEDS];
CRGB leds2[STRIP_NUM_LEDS];

void setupLeds(int numLeds, int dataPin1) {
  NUM_LEDS = numLeds;

  FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, STRIP_NUM_LEDS);    
    
  FastLED.setMaxPowerInVoltsAndMilliamps(5, 150);

  for (int i = 0; i < NUM_LEDS; i++) {   
    writeLeds(i,0,0,0);
  }

  for(int i=0;i<1;i++){
    writeLeds(0+i*STRIP_NUM_LEDS, 0, 0, 0); // Black
    writeLeds(1+i*STRIP_NUM_LEDS, 255, 0, 0); // Red
    writeLeds(2+i*STRIP_NUM_LEDS, 0, 255, 0); // Green
    writeLeds(3+i*STRIP_NUM_LEDS, 0, 0, 255); // Blue   
  }

  FastLED.show();
}

void writeLeds(int pos, byte r, byte g, byte  b) {  
	leds[pos].red = r;
	leds[pos].green = g;
	leds[pos].blue = b;
}

void writeLedsHSB(int pos, byte h, byte s, byte  b) {
  if (pos < 150) {
    leds[pos].setHSV(h, s, b);
  }
}

void showLeds() {
    FastLED.show();
}

void writeLedFrame(char data[], int offset) {  
  int encoding = data[0+offset];
  if(encoding == ENCODING_RGB) {       
    for (int i = 0; i < NUM_LEDS; i++) {
      writeLeds(i, data[1+i * 3 + offset], data[1+1 + i * 3 + offset], data[1+2 + i * 3+offset]);
      //writeLeds(i, i, 0, 0);
    }
  } else {
    Serial.println("Unexpected encoding byte");
  }
  FastLED.show();
}
