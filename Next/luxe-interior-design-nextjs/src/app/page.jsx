import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ModernParallax from '../components/ModernParallax';
import Services from '@/components/Services';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';

export default function Home() {
    return (
        <main className="w-full">
            <section id="parallax">
                <ModernParallax />
            </section>

            <section id="home">
                <Hero />
            </section>
            
            <section id="services">
                <Services />
            </section>
            
            <section id="portfolio">
                <Portfolio />
            </section>
            
            <section id="about">
                <About />
            </section>
            
            <section id="contact">
                <Contact />
            </section>
        </main>
    );
}