# 🌡️ Sistema de Monitoramento Ambiental com ESP32

Projeto de Internet das Coisas (IoT) desenvolvido para monitorar temperatura, umidade e luminosidade utilizando um ESP32, sensores ambientais, uma API REST e um dashboard web.

## 📌 Sobre o projeto

O sistema coleta informações ambientais por meio de dois sensores:

- **DHT11:** responsável pela medição de temperatura e umidade.
- **LDR:** responsável pela leitura da luminosidade do ambiente.

Os dados são enviados pelo ESP32 via Wi-Fi para uma API desenvolvida com Node.js e Express. As medições são armazenadas em um banco de dados MySQL utilizando Prisma ORM.

O dashboard permite visualizar os dados coletados por meio de indicadores, gráficos e uma tabela de histórico.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| ESP32 | Coleta e envio dos dados |
| Arduino IDE | Programação do microcontrolador |
| C++ | Programação do ESP32 |
| DHT11 | Sensor de temperatura e umidade |
| LDR | Sensor de luminosidade |
| Node.js | Execução do backend |
| Express.js | Desenvolvimento da API |
| Prisma ORM | Integração com o banco de dados |
| MySQL | Armazenamento das medições |
| HTML | Estrutura do dashboard |
| CSS | Estilização |
| JavaScript | Consumo da API |
| Chart.js | Gráficos de monitoramento |

## ⚙️ Funcionamento

1. O ESP32 realiza a leitura dos sensores.
2. Os dados são organizados em formato JSON.
3. As medições são enviadas para a API por uma requisição HTTP POST.
4. A API recebe os dados e os armazena no MySQL.
5. O dashboard consulta as medições utilizando requisições HTTP GET.
6. Os gráficos, indicadores e a tabela são atualizados automaticamente.

### Fluxo do sistema

```text
DHT11 ───┐
         │
LDR ─────┤
         ▼
       ESP32
         │
        Wi-Fi
         │
         ▼
      API REST
         │
         ▼
     Prisma ORM
         │
         ▼
       MySQL
         │
         ▼
     Dashboard
```

## 🔌 Montagem do circuito

### Componentes

- ESP32
- Sensor DHT11
- Módulo LDR
- LED
- Resistor
- Protoboard
- Jumpers
- Cabo USB

### Conexões

| Componente | Conexão |
|---|---|
| DHT11 — OUT | GPIO 23 |
| LDR — AO | GPIO 34 |
| LED | GPIO 18 |
| VCC dos sensores | 3V3 |
| GND dos sensores | GND |

O LED é utilizado para indicar as condições de luminosidade do ambiente.

### 📸 Fotos do circuito

**Montagem completa**

![Montagem do ESP32](./docs/i1%20(1).jpeg)

**Sensores conectados**

![Sensores do projeto](./docs/i2.jpeg)


### 🎥 Vídeo do IoT

[Assistir ao funcionamento do circuito](./docs/v1.mp4)

## 💻 Dashboard web

O dashboard apresenta as informações coletadas pelo ESP32 em uma interface de monitoramento.

### Funcionalidades

- Indicador de temperatura.
- Indicador de umidade.
- Indicador de luminosidade.
- Gráfico de temperatura.
- Gráfico de umidade.
- Gráfico de luminosidade.
- Tabela com histórico de medições.
- Atualização automática a cada 10 segundos.
- Botão para atualizar os dados manualmente.
- Alternância entre última medição e média das medições.
- Indicador de recebimento de dados recentes.

### 📸 Imagens do dashboard

**Página principal**

![Dashboard](./docs/g1.png)

**Gráficos**

![Gráficos de monitoramento](./docs/g2.png)

## 🗄️ Banco de dados

O banco de dados MySQL é responsável pelo armazenamento das medições.

### Modelo Prisma

```prisma
model Medicao {
  id            Int      @id @default(autoincrement())
  data          DateTime @default(now())
  temperatura   Float
  umidade       Float
  luminosidade  Float
}
```

### Exemplo de JSON

```json
{
  "temperatura": 25.5,
  "umidade": 60.2,
  "luminosidade": 2544
}
```

### Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/medicoes` | Cadastrar medição |
| GET | `/medicoes` | Listar medições |
| GET | `/medicoes/ultima` | Consultar última medição |

## 📁 Estrutura do projeto

```text
projeto-iot/
│
├── src/
│   ├── controllers/
│   │   └── medicaoController.js
│   ├── routes/
│   │   └── medicao.routes.js
│   └── data/
│       └── prisma.js
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── arduino/
│   └── monitoramento.ino
│
├── assets/
│   ├── imagens/
│   │   ├── montagem-iot.jpg
│   │   ├── sensores.jpg
│   │   ├── funcionamento.jpg
│   │   ├── dashboard.png
│   │   ├── graficos.png
│   │   └── tabela.png
│   └── videos/
│       ├── funcionamento-iot.mp4
│       └── dashboard.mp4
│
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🚀 Como executar

### Instalar dependências

```bash
npm install
```

### Configurar o banco

Criar um arquivo `.env`:

```env
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"
```

### Preparar o Prisma

```bash
npx prisma generate
npx prisma migrate deploy
```

### Iniciar a API

```bash
node server.js
```

### Configurar o ESP32

No Arduino IDE, configurar a rede Wi-Fi e o endereço IP do computador que está executando a API.

O ESP32 e o computador devem estar conectados à mesma rede.

### Acessar o dashboard

Com o servidor em execução, abrir a página web do sistema.

## 📊 Resultados

O sistema permite acompanhar as condições ambientais por meio de medições armazenadas no banco de dados.

Os gráficos apresentam as variações de temperatura, umidade e luminosidade, enquanto os indicadores permitem consultar os valores mais recentes ou a média dos registros retornados pela API.

A integração entre ESP32, API REST, MySQL e dashboard possibilita o monitoramento e a visualização dos dados coletados.

## 🎯 Conhecimentos aplicados

- Internet das Coisas (IoT)
- Eletrônica e sensores
- Programação em C++
- Comunicação HTTP
- Desenvolvimento de APIs REST
- Banco de dados relacional
- Desenvolvimento web
- Visualização de dados

## 👩‍💻 Autoria

**Pietra Vitória Fernandes Lopes**
**Luiza Amaral Corazin**
**Giovana Corrêa**
**Clara Antonacci**
**Julia Novo**
**Beatriz Albuquerque**

Curso Técnico em Análise e Desenvolvimento de Sistemas — SENAI."# Monitoramento_iot" 
