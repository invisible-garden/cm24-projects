#ifndef WIFI_CONFIG_H
#define WIFI_CONFIG_H

#include <WiFi.h>

const char* ssid = "YourSSID";  // Replace with your SSID
const char* password = "YourPassword";  // Replace with your Password

// Function to connect to WiFi with error handling
String connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");

  unsigned long startTime = millis();
  const unsigned long timeout = 15000;  // 15 seconds timeout

  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startTime >= timeout) {
      Serial.println("\nWiFi connection failed!");
      return "WiFi not connected";
    }
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nConnected to WiFi!");
  return "WiFi connected successfully";
}

#endif
