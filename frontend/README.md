# 📈 Interactive Range Chart

Bienvenido! Este proyecto es una aplicación en React para visualizar un gráfico interactivo con la evolución del valor de un stock en el tiempo.  

## 🚀 Requisitos

- Node.js (v22 o superior recomendado)
- npm (v10 o superior)

Puedes verificar tu versión ejecutando:

```bash
node -v
npm -v
```

# 🛠 Instalación y ejecución local

1. Clona este repositorio


2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm start
```

4. Abre tu navegador en:

```arduino
http://localhost:3000
```

# ✨ Características principales
Este gráfico fue diseñado con un enfoque en la simplicidad, claridad visual y experiencia de usuario. A continuación se describen sus principales atributos e interacciones:

# 🧩 Funcionalidades destacadas

- Minimalismo visual:

    - Los ejes y la cuadrícula no están dibujados, lo que aporta limpieza visual.

    - El eje X muestra solo dos valores: fecha de inicio y de fin.

    - El eje Y está limitado a un máximo de 3 marcas, expresadas en millones (ej. 1.6M).

    - En el eje X se simplifica la fecha mostrando solo el mes y el año (ej. jun. 2025).

- Atractivo visual:

    - La línea del gráfico es más gruesa que lo habitual, lo que mejora la percepción estética.

    - Al pasar el mouse sobre la línea, se destaca el punto correspondiente con un círculo, facilitando la lectura.

    - La información del punto activo (hover) se muestra en un pequeño cuadro ubicado en una posición relativa al punto. Esto genera una sensación visual de estar navegando a través del tiempo y observando la evolución del valor de manera contextual e intuitiva.

- Interacción UX intuitiva:

    - Al hacer clic en dos puntos del gráfico, se resaltan con círculos rojos.

    - Se muestra el valor exacto de cada punto (con separador de miles y sin redondear), junto con la variación porcentual entre ambos.

    - La posición de los valores está ajustada de forma relativa al punto del gráfico, mejorando la legibilidad contextual.

# 🛠 Funciones secundarias

- Zoom horizontal mediante scroll o gesto de pellizcar.

- Arrastre (pan) tanto en eje X como Y para explorar diferentes secciones del gráfico.

# 💡 Posibles mejoras futuras

- Agregar filtros de rango temporal predefinido (ej. "Últimos 3 meses", "YTD").

- Habilitar zoom vertical, además del horizontal ya disponible.

- Permitir comparar el rendimiento contra un índice de referencia (por ejemplo, el S&P 500).

- Implementar selección por arrastrado horizontal, donde el usuario pueda elegir un rango dinámicamente y ver la variación en tiempo real.

- Añadir sombreado bajo la curva para mejorar la percepción visual del área, funcionalidad que se intentó implementar pero no fue completada en esta versión.

# 🧩 Tecnologías utilizadas

- React

- Chart.js (con plugin de zoom)

- react-chartjs-2

- TypeScript