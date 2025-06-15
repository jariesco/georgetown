# Racional API

Este proyecto es una API de inversión construida con NestJS y PostgreSQL. Permite crear usuarios, registrar ordenes de compra/venta, editar informacion, consultar movimientos y más.

## 🚀 Requisitos

- Node.js (v22 o superior)
- npm (v10 o superior)
- Docker (para la base de datos)

## 🔧 Instalación

1. **Clona el repositorio**


2. Instala dependencias:

```bash
npm install
```

3. Configura el entorno:

Crea un archivo .env en la raíz con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin
DB_NAME=racional
```

4. Inicia la base de datos en Docker (solo la primera vez):

```bash
docker run --name racional-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=racional \
  -p 5432:5432 \
  -d postgres
```

Si ya tienes el contenedor creado, simplemente inicia con:

```bash
docker start racional-db
```

5. Ejecuta la API en modo desarrollo:

```bash
npm run start:dev
```

# ✅ Verificación

Una vez corriendo, puedes verificar que la API funciona accediendo a:

```bash
curl http://localhost:3000
```

O probando los endpoints (ver sección "Ejemplos de requests").

# 🧪 Ejemplos de requests 

*Están también en georgetown/test.http y se pueden probar con extension de vscode para http, postman o codigo para requests http*

**Recomendado probar en el mismo orden en que están**

### CREAR USUARIO

```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "fullName": "Carlos Alcaraz",
  "email": "carlos@example.com",
  "birthdate": "1992-06-01"
}
```

### MOSTRAR USUARIOS
GET http://localhost:3000/users
Content-Type: application/json


### DEPOSITAR
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "userId": 1,
  "type": "DEPOSIT",
  "amount": 3500
}


### RETIRAR
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "userId": 1,
  "type": "WITHDRAW",
  "amount": 500
}

### CREAR STOCK 1
POST http://localhost:3000/stock
Content-Type: application/json

{
  "ticker": "AAPL",
  "name": "Apple"
}

### CREAR STOCK 2
POST http://localhost:3000/stock
Content-Type: application/json

{
  "ticker": "TSLA",
  "name": "Tesla"
}

### CREAR PORTAFOLIO
POST http://localhost:3000/portfolio
Content-Type: application/json

{
  "userId": 1,
  "name": "Acciones regalonas"
}

### COMPRAR
POST http://localhost:3000/order
Content-Type: application/json

{
  "portfolioId": 1,
  "stockId": 1,
  "type": "BUY",
  "amount": 1000
}

### VENDER
POST http://localhost:3000/order
Content-Type: application/json

{
  "portfolioId": 1,
  "stockId": 1,
  "type": "SELL",
  "amount": 400
}

### EDITAR USUARIO
PATCH http://localhost:3000/users/1
Content-Type: application/json

{
  "fullName": "Carlitos Alcaraz"
}

### EDITAR PORTAFOLIO
PATCH http://localhost:3000/portfolio/1
Content-Type: application/json

{
  "name": "Portafolio regalon"
}

### RESUMEN PORTAFOLIO
GET http://localhost:3000/portfolio/1/summary
Content-Type: application/json

### ULTIMAS ORDENES DE USUARIO
GET http://localhost:3000/order/1/orders?limit=5
Content-Type: application/json