#ifndef HTTPS_REQUEST_H
#define HTTPS_REQUEST_H

#include <WiFiClientSecure.h>

String sendRequest() {
  const char* host = "mainnet.serve.giveth.io";
  const int httpsPort = 443;

  WiFiClientSecure client;
  client.setInsecure();  // For testing purposes only, use secure connection in production

  if (!client.connect(host, httpsPort)) {
    Serial.println("Connection failed!");
    return "";
  }

  // Modified GraphQL query without fragments
  String postData = R"({
    "operationName": "DonationsByProjectId",
    "variables": {
      "projectId": 14410,
      "take": 1,
      "skip": 0,
      "orderBy": {
        "field": "CreationDate",
        "direction": "DESC"
      },
      "status": "verified"
    },
    "query": "query DonationsByProjectId($take: Int, $skip: Int, $traceable: Boolean, $qfRoundId: Int, $projectId: Int!, $searchTerm: String, $orderBy: SortBy, $status: String) { donationsByProjectId( take: $take skip: $skip traceable: $traceable qfRoundId: $qfRoundId projectId: $projectId searchTerm: $searchTerm orderBy: $orderBy status: $status ) { donations { __typename id anonymous amount valueUsd currency transactionId transactionNetworkId chainType createdAt donationType status onramperId user { name walletAddress avatar } } totalCount totalUsdBalance } }"
  })";

  // Construct the HTTPS request
  String request = String("POST ") + "/graphql HTTP/1.1\r\n" +
                   "Host: " + host + "\r\n" +
                   "Content-Type: application/json\r\n" +
                   "Content-Length: " + postData.length() + "\r\n" +
                   "Connection: close\r\n\r\n" + postData;

  client.print(request);

  // Read response headers
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") {
      break;
    }
  }

  // Read the response body
  String response = "";
  while (client.available()) {
    response += client.readString();
  }

  client.stop();
  return response;
}

#endif
