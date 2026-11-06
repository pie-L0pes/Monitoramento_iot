
#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

const char* ssid = "WIFI";
const char* senha = "SENHA WIFI";

const char* url = "http://IPCOMPUTADOR:3000/medicoes";

#define DHTPIN 23
#define DHTTYPE DHT11

const int ldrPin = 34;
const int ledPin = 18;

DHT dht(DHTPIN, DHTTYPE);

const int limite = 2500;

const unsigned long intervaloEnvio = 5000;
const unsigned long intervaloLED = 500;

unsigned long ultimoEnvio = 0;
unsigned long ultimaLeituraLED = 0;

bool ledLigado = false;

void conectarWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println("Conectando ao WiFi...");

  WiFi.begin(ssid, senha);

  int tentativas = 0;

  while (WiFi.status() != WL_CONNECTED && tentativas < 20) {
    delay(500);
    Serial.print(".");
    tentativas++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi conectado!");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFalha ao conectar!");
  }
}

void controlarLED(int luminosidade) {

  bool novoEstado = luminosidade < limite;

  // LED ATIVO EM LOW
  digitalWrite(ledPin, novoEstado ? LOW : HIGH);

  if (novoEstado != ledLigado) {
    ledLigado = novoEstado;

    Serial.print("LED: ");
    Serial.println(ledLigado ? "LIGADO" : "DESLIGADO");
  }
}

void enviarDados(float temperatura, float umidade, int luminosidade) {

  if (WiFi.status() != WL_CONNECTED) {
    conectarWiFi();

    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("Sem WiFi. Envio cancelado.");
      return;
    }
  }

  HTTPClient http;

  http.begin(url);
  http.setTimeout(5000);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"temperatura\":" + String(temperatura, 1) + ",";
  json += "\"umidade\":" + String(umidade, 1) + ",";
  json += "\"luminosidade\":" + String(luminosidade);
  json += "}";

  Serial.println("\nEnviando para API:");
  Serial.println(json);

  int resposta = http.POST(json);

  Serial.print("HTTP: ");
  Serial.println(resposta);

  if (resposta > 0) {
    Serial.println(http.getString());
  } else {
    Serial.println(http.errorToString(resposta));
  }

  http.end();
}

void lerSensores() {

  float umidade = dht.readHumidity();
  float temperatura = dht.readTemperature();

  int luminosidade = analogRead(ldrPin);

  controlarLED(luminosidade);

  Serial.println("\n----------------------");

  Serial.print("LDR: ");
  Serial.println(luminosidade);

  if (isnan(umidade) || isnan(temperatura)) {
    Serial.println("DHT11 nao respondeu!");
    return;
  }

  Serial.print("Temperatura: ");
  Serial.print(temperatura);
  Serial.println(" C");

  Serial.print("Umidade: ");
  Serial.print(umidade);
  Serial.println(" %");

  enviarDados(temperatura, umidade, luminosidade);
}

void setup() {

  Serial.begin(9600);

  pinMode(ldrPin, INPUT);
  pinMode(ledPin, OUTPUT);

  digitalWrite(ledPin, HIGH);

  analogReadResolution(12);

  dht.begin();

  Serial.println("Sistema iniciado!");

  conectarWiFi();

  delay(2000);

  lerSensores();

  ultimoEnvio = millis();
  ultimaLeituraLED = millis();
}

void loop() {

  unsigned long agora = millis();

  if (agora - ultimaLeituraLED >= intervaloLED) {
    ultimaLeituraLED = agora;

    int luminosidade = analogRead(ldrPin);
    controlarLED(luminosidade);
  }

  if (agora - ultimoEnvio >= intervaloEnvio) {
    ultimoEnvio = agora;

    lerSensores();
  }
}



