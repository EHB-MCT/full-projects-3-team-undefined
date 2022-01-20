// libraries
#include <SPI.h>
#include <SdFat.h>
#include <vs1053_SdFat.h>

SdFat sd;
vs1053 MP3player;
int8_t current_track = 0;

int BELL1 = 5;
int BELL2 = 4;

int distanceSensor = 0;                 // analog pin used to connect the sharp sensor
int distance = 0;                 // variable to store the values from sensor(initially zero)

int ringTime = 100;

int disconnectPin = 3;

bool phoneRinging = false;

void setup() {
  pinMode(disconnectPin, INPUT_PULLUP);
  pinMode(distanceSensor, INPUT);
  pinMode(BELL1, OUTPUT);
  pinMode(BELL2, OUTPUT);
}

void loop() {
  Serial.begin(115200);
  if (analogRead(distanceSensor) > 100 && phoneRinging == false) {
    phoneRinging = true;
    for (int i = 0; i < ringTime; i++) {
      ringBell();
      if (phoneRinging == false) {
        break;
      }
      checkRinging();
    }
  }
  if (!sd.begin(9, SPI_HALF_SPEED)) sd.initErrorHalt();
  if (!sd.chdir("/")) sd.errorHalt("sd.chdir");

  MP3player.begin();
  MP3player.setVolume(10,10);
}

void ringBell() {
  digitalWrite(BELL1, HIGH);
  digitalWrite(BELL2, LOW);
  delay(40);
  digitalWrite(BELL1, LOW);
  digitalWrite(BELL2, HIGH);
  delay(40);
}

void checkRinging() {
  bool state = digitalRead(disconnectPin);
  Serial.println(state);
  if (state == HIGH) {
    phoneRinging = false;
    MP3player.playMP3("track001.mp3");
    while (MP3player.isPlaying()) {
      Serial.println("playing");
    }
  }
}
