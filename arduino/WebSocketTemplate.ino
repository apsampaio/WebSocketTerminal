#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>

ESP8266WebServer server;
WebSocketsServer webSocket = WebSocketsServer(81);

char* ssid = "SSID";
char* password = "PASSWORD";

void setup()
{
  Serial.begin(9600);
   while (!Serial);

  /*
  ==== ACCESS POINT ONLY ==========
  WiFi.mode(WIFI_AP);
  WiFi.softAP("NodeMCU", "password123");
  IPAddress myIP = WiFi.softAPIP();
  Serial.print("HotSpot IP:");
  Serial.println(myIP);
 ==================================
  */
 
  //==== WIFI ONLY ===============
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid,password);
  while(WiFi.status()!=WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
 //==================================
  
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  
  webSocket.loop();
  if(Serial.available() > 0){
    char c[] = {(char)Serial.read()};
    webSocket.broadcastTXT(c, sizeof(c));
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length){
  if(type == WStype_TEXT){
      for(int i = 0; i < length; i++)
        Serial.print((char) payload[i]);
      Serial.println();
  }
 
