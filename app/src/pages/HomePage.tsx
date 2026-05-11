import HeroSection from '@/sections/home/HeroSection';
import MeridianTransition from '@/sections/home/MeridianTransition';
import PhilosophySection from '@/sections/home/PhilosophySection';
import TreatmentsSection from '@/sections/home/TreatmentsSection';
import SocialProofSection from '@/sections/home/SocialProofSection';
import InkMapSection from '@/sections/home/InkMapSection';
import ChiStoryStrip from '@/sections/home/ChiStoryStrip';
import GiftCardsSection from '@/sections/home/GiftCardsSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MeridianTransition />
      <PhilosophySection />
      <TreatmentsSection />
      <SocialProofSection />
      <InkMapSection />
      <ChiStoryStrip />
      <GiftCardsSection />
    </main>
  );
}
