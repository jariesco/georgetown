// src/App.tsx
import React from 'react';
// import InvestmentChart from './components/InvestmentChart';
// import SimpleChart from './components/SimpleChart3';
// import SimpleChart from './components/Sample';
// import SimpleChart from './components/Sample2'
// import SimpleChart from './components/Sample3'
// import SimpleChart from './components/SimpleChart4';
// import SimpleChart from './components/Sample4';
// import SimpleChart from './components/Sample5';
import SimpleChart from './components/SimpleChart5';

const App: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
    <h1>Valor Stock</h1>
    <SimpleChart />
  </div>
);

export default App;
