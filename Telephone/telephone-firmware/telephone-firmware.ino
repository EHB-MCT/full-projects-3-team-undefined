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

void setup() {
  Serial.begin(115200);
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
    }
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
