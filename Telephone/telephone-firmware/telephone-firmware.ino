#include <SoftwareSerial.h>

#define MP3_RX 8 // to TX
#define MP3_TX 7 // to RX

// Select storage device to TF card
static int8_t select_SD_card[] = {0x7e, 0x03, 0X35, 0x01, 0xef}; // 7E 03 35 01 EF
// Play with index: /01/001xxx.mp3
static int8_t play_first_song[] = {0x7e, 0x04, 0x41, 0x00, 0x01, 0xef}; // 7E 04 41 00 01 EF
// Play with index: /01/002xxx.mp3
static int8_t play_second_song[] = {0x7e, 0x04, 0x41, 0x00, 0x02, 0xef}; // 7E 04 41 00 02 EF
// Play the song.
static int8_t play[] = {0x7e, 0x02, 0x01, 0xef}; // 7E 02 01 EF
// Pause the song.
static int8_t pause[] = {0x7e, 0x02, 0x02, 0xef}; // 7E 02 02 EF

int BELL1 = 10;
int BELL2 = 11;

int distanceSensor = A0;                 // analog pin used to connect the sharp sensor
int distance = 0;                 // variable to store the values from sensor(initially zero)

int disconnectPin = 2;

int disconnectState = false;

bool coolDown = false;

volatile bool pickedUp = false;

unsigned long button_time = 0;
unsigned long last_button_time = 0;

// Define the Serial MP3 Player Module.
SoftwareSerial MP3(MP3_RX, MP3_TX);

void setup() {
  Serial.begin(9600);
  MP3.begin(9600);
  pinMode(disconnectPin, INPUT_PULLUP);
  pinMode(distanceSensor, INPUT);
  pinMode(BELL1, OUTPUT);
  pinMode(BELL2, OUTPUT);
  delay(3000);
  Serial.println("Telephone activated");
}

void loop() {

  distance = analogRead(distanceSensor);
  // disconnectState = digitalRead(disconnectPin);
  // Serial.println(distance);
  delay(10);
  checkSwitchState();
  if (coolDown == false && distance > 104 && !disconnectState) {
    ringBell();
    checkSwitchState();
    if (disconnectState) {
      Serial.println("play audio");
      //      send_command_to_MP3_player(select_SD_card, 5);
      send_command_to_MP3_player(play_first_song, 6);
      coolDown = true;
    }
  }
  if (coolDown) {
    delay(40000);
    Serial.println("Cooldown over");
    coolDown = false;
  }
}

void ringBell() {
  Serial.println("ringing");
  for (int i = 0; i < 4; i++) {
    checkSwitchState();
    if (disconnectState) {
      break;
    }
    for (int i = 0; i < 30; i++) {
      checkSwitchState();
      if (disconnectState) {
        break;
      }
      digitalWrite(BELL1, HIGH);
      digitalWrite(BELL2, LOW);
      delay(40);
      digitalWrite(BELL1, LOW);
      digitalWrite(BELL2, HIGH);
      delay(40);
    }
    delay(1000);
  }
  Serial.println("Stopped ringing");
}

void checkSwitchState() {
  disconnectState = digitalRead(disconnectPin);
}

void send_command_to_MP3_player(int8_t command[], int len) {
  Serial.print("\nMP3 Command => ");
  for (int i = 0; i < len; i++) {
    MP3.write(command[i]);
    Serial.print(command[i], HEX);
  }
  delay(1000);
}
