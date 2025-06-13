// src/App.tsx
import React from 'react';
import InvestmentChart from './components/InvestmentChart';

const App: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Inversión en Tiempo Real</h1>
    <InvestmentChart />
  </div>
);

export default App;
