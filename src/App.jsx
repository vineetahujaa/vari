import React from 'react';
import './App.css';
import { WaitlistProvider } from './context/WaitlistContext';

import Header from './components/Header';
import Hero from './components/Hero';
import DataTicker from './components/DataTicker';
import Problem from './components/Problem';
import ThreatsRisks from './components/ThreatsRisks';
import Engine from './components/Engine';
import Intervention from './components/Intervention';
import Families from './components/Families';
import Banks from './components/Banks';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import WaitlistModal from './components/WaitlistModal';
import WaitlistPill from './components/WaitlistPill';

function App() {
  return (
    <WaitlistProvider>
      <div className="App">
        <Header />
        <Hero />
        <DataTicker />
        <Problem />
        <ThreatsRisks />
        <Engine />
        <Intervention />
        <Families />
        <Banks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
        <WaitlistModal />
        <WaitlistPill />
      </div>
    </WaitlistProvider>
  );
}

export default App;
