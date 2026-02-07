import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Cashier from './pages/Cashier/Cashier';
import Queue from './pages/Queue/Queue';
import Barista from './pages/Barista/Barista';
import Manager from './pages/Manager/Manager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/cashier" replace />} />
          <Route path="cashier" element={<Cashier />} />
          <Route path="queue" element={<Queue />} />
          <Route path="barista" element={<Barista />} />
          <Route path="manager" element={<Manager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
