# Racional API

Este proyecto es una API de inversión construida con NestJS y PostgreSQL. Permite crear usuarios, registrar compras de acciones, consultar movimientos y más.

## 🚀 Requisitos

- Node.js (vXX o superior)
- npm
- Docker (para la base de datos)

## 🔧 Instalación

1. **Clona el repositorio**:

```bash
git clone https://github.com/tu-usuario/racional.git
cd racional
```

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

(Aquí puedes pegar los curl o ejemplos que tienes guardados, luego los pulimos juntos)