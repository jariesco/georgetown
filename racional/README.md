# API de inversión

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

# 🧩 Modelo de Datos

La estructura de la base de datos sigue un modelo relacional con las siguientes entidades y relaciones:

#### 📄 Relaciones principales

- User

  - Tiene una relación **uno a muchos** con Transaction.

  - Tiene una relación **uno a muchos** con Portfolio.

- Portfolio

  - Tiene una relación **uno a muchos** con PortfolioEntry (cada entrada representa una inversión individual en un Stock).

  - Tiene una relación **uno a muchos** con Order (órdenes de compra o venta asociadas a ese portafolio).

- Stock

  - Tiene una relación **uno a muchos** con PortfolioEntry (puede haber muchas entradas para un mismo stock en distintos portafolios o momentos).

  - Tiene una relación **uno a muchos** con Order (una acción puede ser parte de muchas órdenes).

```pgsql
User
 ├── Portfolio
 │    ├── PortfolioEntry → Stock
 │    └── Order         → Stock
 └── Transaction
 ```

**Se puso foco en crear multiples portafolios por usuario, basado en la experiencia propia en que ha surgido el interés de tener portafolios customizados para evaluarlos y compararlos, y para gestionar mejor la distribucion del riesgo.**


# 📌 Consideraciones

- Actualmente, los endpoints para crear órdenes o editar portafolios están estructurados principalmente en torno al portfolioId.

- Sin embargo, una mejora importante a considerar, por seguridad, sería vincular también estas operaciones explícitamente al userId (está vinculado pero sólo desde el código).

# 🧪 Ejemplos de requests 

*Están también en georgetown/test.http y se pueden probar con extension de vscode para http, postman, curl o codigo para requests http*

**Recomendado probar en el mismo orden en que están**

#### CREAR USUARIO

```http
POST http://localhost:3000/users
Content-Type: application/json

{
  "fullName": "Carlos Alcaraz",
  "email": "carlos@example.com",
  "birthdate": "1992-06-01"
}
```

#### MOSTRAR USUARIOS

```http
GET http://localhost:3000/users
Content-Type: application/json
```


#### DEPOSITAR

```http
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "userId": 1,
  "type": "DEPOSIT",
  "amount": 3500
}
```

#### RETIRAR

```http
POST http://localhost:3000/transactions
Content-Type: application/json

{
  "userId": 1,
  "type": "WITHDRAW",
  "amount": 500
}
```

#### CREAR STOCK 1

```http
POST http://localhost:3000/stock
Content-Type: application/json

{
  "ticker": "AAPL",
  "name": "Apple"
}
```

#### CREAR STOCK 2

```http
POST http://localhost:3000/stock
Content-Type: application/json

{
  "ticker": "TSLA",
  "name": "Tesla"
}
```

#### CREAR PORTAFOLIO

```http
POST http://localhost:3000/portfolio
Content-Type: application/json

{
  "userId": 1,
  "name": "Acciones regalonas"
}
```

#### COMPRAR

```http
POST http://localhost:3000/order
Content-Type: application/json

{
  "portfolioId": 1,
  "stockId": 1,
  "type": "BUY",
  "amount": 1000
}
```

#### VENDER

```http
POST http://localhost:3000/order
Content-Type: application/json

{
  "portfolioId": 1,
  "stockId": 1,
  "type": "SELL",
  "amount": 400
}
```

#### EDITAR USUARIO

```http
PATCH http://localhost:3000/users/1
Content-Type: application/json

{
  "fullName": "Carlitos Alcaraz"
}
```

#### EDITAR PORTAFOLIO

```http
PATCH http://localhost:3000/portfolio/1
Content-Type: application/json

{
  "name": "Portafolio regalon"
}
```

#### RESUMEN PORTAFOLIO

```http
GET http://localhost:3000/portfolio/1/summary
Content-Type: application/json
```

#### ULTIMAS ORDENES DE USUARIO

```http
GET http://localhost:3000/order/1/orders?limit=5
Content-Type: application/json
```