import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import Clients from './pages/Clients';
import Fournisseurs from './pages/Fournisseurs';
import Tresorerie from './pages/Tresorerie';
import Personnel from './pages/Personnel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="stocks" element={<Stocks />} />
          <Route path="clients" element={<Clients />} />
          <Route path="fournisseurs" element={<Fournisseurs />} />
          <Route path="tresorerie" element={<Tresorerie />} />
          <Route path="personnel" element={<Personnel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
