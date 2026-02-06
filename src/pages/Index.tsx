import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FiveElementsMenu from '@/components/FiveElementsMenu';
import VirtualTable from '@/components/VirtualTable';
import ReservationSection from '@/components/ReservationSection';
import ContactSection from '@/components/ContactSection';
import FortuneCookie from '@/components/FortuneCookie';
const Index = () => {
  return (
    <div className="min-h-screen bg-charcoal-dark">
      <Header />
      <main>
        <HeroSection />
        <FiveElementsMenu />
        <VirtualTable />
        <ReservationSection />
        <ContactSection />
      </main>
      <FortuneCookie />
    </div>
  );
};

export default Index;
