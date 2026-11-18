import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/Home.css';
import southImg from '../assets/south.jpg';
import hampiImg from '../assets/hampi.jpg';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
const navigate = useNavigate();

const handleSearch = (event) => {
  event.preventDefault();

  const query = searchTerm.trim();

  if (!query) {
    return;
  }

  navigate(`/explore?search=${encodeURIComponent(query)}`);
};
  const regions = [
  { name: 'North', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=500' },
  // South ki image URL update:
  { name: 'South', image:  southImg},
  { name: 'East', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500' },
  { name: 'West', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500' },
  { name: 'Central', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500' },
];

const featured = [
  {
    id: 2,
    title: 'Sanchi Stupa',
    location: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500'
  },
  {
    id: 3,
    title: 'Hampi',
    location: 'Karnataka',
    image: hampiImg
  },
  {
    id: 6,
    title: 'Konark Sun Temple',
    location: 'Odisha',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500'
  },
];
  const heroBg = 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1600';

  return (
    <div className="home-page">
      {/* Hero Section */}
    {/* Hero Section */}
<section
  id="home"
  className="hero-section"
  style={{ backgroundImage: `url(${heroBg})` }}
>
  <div className="hero-overlay"></div>

  <div className="hero-content">
    <h1 className="hero-title">
      Discover <br />
      India’s Heritage
    </h1>

    <p className="hero-subtitle">
      Explore. Learn. Preserve.
    </p>

    <form
      className="hero-search-box"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        placeholder="Search places, art, festivals..."
        className="hero-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button type="submit" className="hero-search-btn">
        🔍
      </button>
    </form>
  </div>
</section>
      

      {/* Main Content Sections */}
      <div className="home-container">
       {/* Explore by Region */}
      <h2 id="explore" className="section-heading"> Explore by Region</h2>

      <div className="regions-grid">{regions.map((reg, idx) => (
        <Link to={`/explore?region=${reg.name}`}key={idx}className="region-card"> <img src={reg.image} alt={reg.name} />
         <div className="region-overlay">
           <span className="region-name">{reg.name}</span>
          </div>
        </Link>))}
      </div>
        {/* Featured Heritage */}
        <div className="section-header-row">
          <h2 id="learn" className="section-heading" style={{ margin: 0 }}>Featured Heritage</h2>
         <Link to="/explore" className="view-all-text">View All &rarr;</Link>
        </div>
        <div className="featured-grid">
          {featured.map((item, idx) => (
            <div key={idx} className="heritage-card">
              <Link
  to={`/place/${item.id}`}
  style={{ display: "inline-block", position: "relative", zIndex: 10 }}
>
  <img src={item.image} alt={item.title} />
</Link>
              <div className="heritage-overlay">
                <h3 className="heritage-title">{item.title}</h3>
                <p className="heritage-location">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* community section */}
    
        <section id="community" className="community-section">

         <div className="community-heading">
           <span>OUR COMMUNITY</span>
           <h2>Be a Part of India's Heritage</h2>
           <p>Connect, explore and celebrate India's rich cultural heritage.  </p>
         </div>
          <div className="community-cards">
            <div className="community-card">
      <img
        src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=700"
        alt="Indian traditional art"
      />
      <div className="community-card-content">
        <h3>Share Your Story</h3>
        <p>Share your cultural experiences and interesting heritage stories.</p>
      </div>
    </div>

    <div className="community-card">
      <img
        src="https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=700"
        alt="Indian cultural celebration"
      />
      <div className="community-card-content">
        <h3>Discover Events</h3>
        <p>Explore India's festivals, exhibitions and cultural celebrations.</p>
      </div>
    </div>

    <div className="community-card">
      <img
        src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=700"
        alt="Indian heritage monument"
      />
      <div className="community-card-content">
        <h3>Connect with Explorers</h3>
        <p>Meet people who love travelling, history and Indian culture.</p>
      </div>
    </div>

  </div>

  <div className="community-bottom">
    <h3>Our Heritage, Our Stories, Our Community.</h3>
    <p>Let's preserve India's cultural legacy together.</p>
    <button>Join Our Community</button>
  </div>

</section>


      </div>
    </div>
  );
}