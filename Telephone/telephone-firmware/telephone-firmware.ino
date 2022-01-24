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

int disconnectPin = 2;

bool phoneRinging = false;

bool coolDown = false;

void setup() {
  pinMode(disconnectPin, INPUT_PULLUP);
  pinMode(distanceSensor, INPUT);
  pinMode(BELL1, OUTPUT);
  pinMode(BELL2, OUTPUT);
  // delay(30000);
  attachInterrupt(digitalPinToInterrupt(disconnectPin), pickedUpPhone, RISING);
  Serial.println("Telephone activated");
}

void loop() {
  Serial.begin(115200);
  distance = analogRead(distanceSensor);
  // Serial.println(distance);
  delay(10);
  if (coolDown == false && distance > 104) {
    ringBell(4);
  }
  //  if (analogRead(distanceSensor) > 100 && phoneRinging == false) {
  //    phoneRinging = true;
  //    for (int i = 0; i < ringTime; i++) {
  //      ringBell();
  //      if (phoneRinging == false) {
  //        break;
  //      }
  //      checkRinging(cd );
  //    }
  //  }
  //  if (!sd.begin(9, SPI_HALF_SPEED)) sd.initErrorHalt();
  //  if (!sd.chdir("/")) sd.errorHalt("sd.chdir");
  //
  //  MP3player.begin();
  //  MP3player.setVolume(10,10);
}

void ringBell(int amount) {
  for (int i = 0; i < amount; i++) {
    Serial.println("ringing");
    for (int i = 0; i < 30; i++) {
      //      digitalWrite(BELL1, HIGH);
      //      digitalWrite(BELL2, LOW);
      //      delay(40);
      //      digitalWrite(BELL1, LOW);
      //      digitalWrite(BELL2, HIGH);
      //      delay(40);
    }
    delay(1000);
  }
}

void pickedUpPhone() {
  Serial.println("Telephone was picked up");
}
