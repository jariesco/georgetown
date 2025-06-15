// src/App.tsx
import React from 'react';
// import InvestmentChart from './components/InvestmentChart';
import SimpleChart from './components/SimpleChart3';
// import SimpleChart from './components/Sample';
// import SimpleRangeChart from './components/Sample2'

const App: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
    <h1>Inversión en Tiempo Real</h1>
    <SimpleChart />
  </div>
);

export default App;
