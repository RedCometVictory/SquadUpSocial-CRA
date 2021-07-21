import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Landing = () => {
  const userAuth = useSelector(state => state.auth);
  const { isAuthenticated } = userAuth;

  if (isAuthenticated) {
    <Redirect to="/dashboard" />
  }

  return (
    <main>
      <section className="hero hero-background">
        <div className="hero__content">
          <div className="hero__sidebar">
            <div className="hero__title">
              <h2>SquadUp with Friends</h2>
              <p>Create a community centered around you.</p>
              <div className="hero__buttons">
                <Link to="/register" className="btn btn-primary btn-overlay">Sign Up</Link> 
                <Link to="/login" className="btn btn-secondary btn-overlay">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;