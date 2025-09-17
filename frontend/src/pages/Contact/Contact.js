import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Contact.css';

const InfoCard = ({ title, children }) => {
  return (
    <div className="info-card">
      <h2 className="card-title">{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

const Contact = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="contact-page">
      <Header 
        user={user}
        onLogout={() => {
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          navigate('/');
        }}
        onLoginClick={() => navigate('/')}
      />
      
      <div className="contact-container">
        <div className="info-cards">
          <InfoCard title="Contact Information">
            <p className="info-text">Email: acadreg@york.citycollege.eu</p>
            <p className="info-text">Phone: (+30) 2310 224186, 275575</p>
            <p className="info-text">Address: 3, Leontos Sofou Street,
            546 26 Thessaloniki, Greece.</p>
          </InfoCard>

          <InfoCard title="Our Departments">
            <p className="info-text">Computer Science</p>
            <p className="info-text">Business Administration and Economics</p>
            <p className="info-text">Humanities</p>
            <p className="info-text">Psychology</p>
          </InfoCard>

          <InfoCard title="Our Facilities">
            <p className="info-text">Library</p>
            <p className="info-text">Student support services</p>
            <p className="info-text">Student clubs & sports</p>
          </InfoCard>
        </div>

        <div className="campus-section">
          <h1 className="campus-title">Campus Location</h1>
          <div className="campus-map">
            <img 
              src={`${process.env.PUBLIC_URL}/Capture.JPG`}
              alt="Campus Map"
              className="map-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 