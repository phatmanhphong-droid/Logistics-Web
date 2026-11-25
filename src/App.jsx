import { useState } from 'react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import PortHeroCinematic from './components/PortHeroCinematic';
import TrackingResultPanel from './components/TrackingResultPanel';
import ServicesSection from './components/ServicesSection';
import QuoteCalculator from './components/QuoteCalculator';
import Footer from './components/Footer';
import { SAMPLE_SHIPMENTS } from './data/logisticsData';

export default function App() {
  const [trackingInput, setTrackingInput] = useState('VC-884210-VN');
  const [activeShipment, setActiveShipment] = useState(SAMPLE_SHIPMENTS['VC-884210-VN']);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState('road');

  const handleSearch = (rawCode) => {
    const normalized = rawCode.trim().toUpperCase();
    if (!normalized) {
      setErrorMessage('Vui lòng nhập mã vận đơn để tra cứu.');
      return;
    }

    const found = SAMPLE_SHIPMENTS[normalized];
    if (!found) {
      setErrorMessage(
        `Không tìm thấy vận đơn "${normalized}". Hãy thử các mã mẫu: VC-884210-VN, VC-551904-SG, VC-309412-US.`
      );
      return;
    }

    setErrorMessage('');
    setActiveShipment(found);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1E3A5F]">
      <CustomCursor />
      <Navbar />
      <main>
        <PortHeroCinematic />
        <TrackingResultPanel
          shipment={activeShipment}
          trackingInput={trackingInput}
          setTrackingInput={setTrackingInput}
          onSearch={handleSearch}
          errorMessage={errorMessage}
        />
        <ServicesSection onSelectMode={setSelectedMode} />
        <QuoteCalculator selectedMode={selectedMode} setSelectedMode={setSelectedMode} />
      </main>
      <Footer />
    </div>
  );
}
