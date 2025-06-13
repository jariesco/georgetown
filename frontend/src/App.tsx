// src/App.tsx
import React from 'react';
import InvestmentChart from './components/InvestmentChart';

const App: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
    <h1>Inversión en Tiempo Real</h1>
    <InvestmentChart />
  </div>
);

export default App;
