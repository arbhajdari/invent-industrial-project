import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './About.css';

const TeamMember = ({ image, name, title, description }) => {
  return (
    <div className="team-card">
      <div className="team-image" style={{ backgroundImage: `url(${image})` }} />
      <div className="team-info">
        <h3 className="team-name">{name}</h3>
        <h4 className="team-title">{title}</h4>
        <p className="team-description">{description}</p>
      </div>
    </div>
  );
};

const About = ({ user }) => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      image: '/IMG_8410.jpg',
      name: 'Guri Haziri',
      title: 'guhaziri@york.citycollege.eu',
      description: 'INVENT Team'
    },
    {
      image: '/IMG_6512.jpg',
      name: 'Arb Hajdari',
      title: 'ahajdari@york.citycollege.eu',
      description: 'INVENT Team'
    },
    {
      image: '/IMG_6513.jpg',
      name: 'Lum Prekazi',
      title: 'lprekazi@york.citycollege.eu',
      description: 'INVENT Team'
    },
    {
      image: '/IMG_2084.png',
      name: 'Ari Seferi',
      title: 'aseferi@york.citycollege.eu',
      description: 'INVENT Team'
    },
    {
      image: '/600x600.jpg',
      name: 'Kron Beqiri',
      title: 'kbeqiri@york.citycollege.eu',
      description: 'INVENT Team'
    },
    {
      image: '/IMG_3.jpg',
      name: 'Ermis Zguri',
      title: 'ezguri@york.citycollege.eu',
      description: 'INVENT Team'
    }
  ];

  return (
    <div className="about-page">
      <Header 
        user={user}
        onLogout={() => {
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          navigate('/');
        }}
        onLoginClick={() => navigate('/')}
      />
      
      <div className="about-container">
        <h1 className="about-header">Our Team</h1>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              image={member.image}
              name={member.name}
              title={member.title}
              description={member.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default About; 