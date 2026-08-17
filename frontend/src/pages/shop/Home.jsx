import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/shop/Hero';
import Categories from '../../components/shop/Categories';
import AllProducts from '../../components/shop/AllProducts';
import Footer from '../../components/layout/Footer';
import './Home.css';

const siteTitle = 'Afsha Enterprises | Best Body Massagers in India';
const siteDescription = 'Afsha Enterprises offers premium electric, handheld, neck, shoulder, foot, and pain relief body massagers with fast delivery across India.';
const siteKeywords = 'Afsha Enterprises, body massager, electric massager, neck massager, pain relief massager, foot massager';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Afsha Enterprises" />
        <link rel="canonical" href="https://www.afshaenterprises.com/" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.afshaenterprises.com/" />
        <meta property="og:image" content="https://www.afshaenterprises.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
      </Helmet>

      <Hero />

      <Categories />

      <section className="section home-section">
        <div className="container">
          <AllProducts />
        </div>
      </section>
    </>
  );
}

export function HomeLayout() {
  return (
    <>
      <Navbar />
      <Home />
      <Footer />
    </>
  );
}
