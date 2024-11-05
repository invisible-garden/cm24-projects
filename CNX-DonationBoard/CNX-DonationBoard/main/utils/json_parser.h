#ifndef JSON_PARSER_H
#define JSON_PARSER_H

#include <ArduinoJson.h>

bool compareJsonResponses(String newResponse) {
  static String lastResponse = "";  // Stores the previous response

  if (newResponse != lastResponse) {
    lastResponse = newResponse;
    return true;  // The response has changed
  }

  return false;  // No change in the response
}

bool parseJsonResponse(String jsonResponse, String &chain, float &amount, String &currency, float &valueUsd, String &userName, String &wallet) {
  Serial.println("Parsing JSON response...");
  // Serial.println(jsonResponse);
  StaticJsonDocument<2048> doc;
  DeserializationError error = deserializeJson(doc, jsonResponse);

  if (error) {
    Serial.println(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return false;
  }

  JsonObject donation = doc["data"]["donationsByProjectId"]["donations"][0];
  Serial.println("Donation object:");
  serializeJson(donation, Serial);
  Serial.println();

  // Validate the donation object
  if (!donation.containsKey("chainType") || !donation["chainType"].is<String>() ||
      !donation.containsKey("amount") || !donation["amount"].is<float>() ||
      !donation.containsKey("currency") || !donation["currency"].is<String>() ||
      !donation.containsKey("valueUsd") || !donation["valueUsd"].is<float>() ||
      !donation.containsKey("user") || !donation["user"].is<JsonObject>() ||
      !donation["user"].containsKey("name") || !donation["user"]["name"].is<String>() ||
      !donation["user"].containsKey("walletAddress") || !donation["user"]["walletAddress"].is<String>()) {
    Serial.println(F("Invalid donation object"));
    return false;
  }

  chain = donation["chainType"].as<String>();
  amount = donation["amount"].as<float>();
  currency = donation["currency"].as<String>();
  valueUsd = donation["valueUsd"].as<float>();
  userName = donation["user"]["name"].as<String>();
  wallet = donation["user"]["walletAddress"].as<String>();

  return true;
}

#endif
