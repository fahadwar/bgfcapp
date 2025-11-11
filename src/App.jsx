import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import FanZone from './pages/FanZone.jsx';
import Tickets from './pages/Tickets.jsx';
import Schedule from './pages/Schedule.jsx';
import Auth from './pages/Auth.jsx';
import Onboarding from './pages/Onboarding.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fan-zone" element={<FanZone />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
