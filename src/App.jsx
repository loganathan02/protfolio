import React, { useEffect } from 'react';
import { Mail, Phone, MapPin, ExternalLink, Code, Server, Database, Wrench } from 'lucide-react';

function App() {
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav>
        <div className="container nav-content">
          <a href="#" className="logo">Loganathan<span>.</span></a>
          <ul className="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-blob"></div>
          <div className="container">
            <div className="hero-content animate-on-scroll">
              <span className="hero-greeting">Hi, my name is</span>
              <h1 className="hero-title">Loganathan.</h1>
              <h2 className="hero-subtitle">I build things for the web.</h2>
              <p className="hero-desc">
                I'm a creative and detail-oriented Full Stack Developer with 2 years of hands-on experience in building scalable web applications using modern technologies like React, Node.js, PHP, and MySQL. Passionate about writing clean code and delivering efficient solutions.
              </p>
              <a href="#contact" className="btn btn-primary">Get In Touch</a>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Where I've Worked</h2>
            
            <div className="timeline">
              <div className="timeline-item animate-on-scroll delay-1">
                <div className="timeline-dot"></div>
                <div className="glass-card">
                  <h3 className="experience-title">FullStack Developer</h3>
                  <div className="experience-company">Version Technology, Chennai</div>
                  <div className="experience-date">May 2024 – Present</div>
                  
                  <div className="project-box">
                    <h4 className="project-title">Billing Application</h4>
                    <ul className="project-details">
                      <li>Developed a full-stack billing system using React (Frontend) and Node.js (Backend).</li>
                      <li>Implemented invoice generation, payment tracking, and customer management.</li>
                      <li>Designed REST APIs for seamless frontend-backend communication.</li>
                      <li>Integrated database for secure data handling.</li>
                    </ul>
                  </div>

                  <div className="project-box">
                    <h4 className="project-title">School Management System & Parent Portal</h4>
                    <ul className="project-details">
                      <li>Built a complete school management system with a dedicated parent web app using MERN stack and PostgreSQL.</li>
                      <li>Features include student records, attendance tracking, and communication modules.</li>
                      <li>Focused on usability and structured data management.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills">
          <div className="container">
            <h2 className="section-title animate-on-scroll">My Toolkit</h2>
            
            <div className="skills-grid">
              <div className="glass-card animate-on-scroll">
                <div className="skill-category">
                  <h3><Code className="inline-block mr-2" size={24} /> Frontend & UI</h3>
                  <div className="skill-list">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">Angular</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">TypeScript</span>
                    <span className="skill-tag">HTML5 / CSS3</span>
                    <span className="skill-tag">Material UI</span>
                    <span className="skill-tag">Tailwind CSS</span>
                    <span className="skill-tag">Bootstrap</span>
                    <span className="skill-tag">SASS</span>
                    <span className="skill-tag">Styled Components</span>
                  </div>
                </div>
              </div>

              <div className="glass-card animate-on-scroll delay-1">
                <div className="skill-category">
                  <h3><Server className="inline-block mr-2" size={24} /> Backend & APIs</h3>
                  <div className="skill-list">
                    <span className="skill-tag">Node.js</span>
                    <span className="skill-tag">PHP (Basics)</span>
                    <span className="skill-tag">CodeIgniter 4</span>
                    <span className="skill-tag">Laravel (Basics)</span>
                    <span className="skill-tag">RESTful APIs</span>
                    <span className="skill-tag">Axios</span>
                    <span className="skill-tag">JSON</span>
                  </div>
                </div>
              </div>

              <div className="glass-card animate-on-scroll delay-2">
                <div className="skill-category">
                  <h3><Database className="inline-block mr-2" size={24} /> Databases</h3>
                  <div className="skill-list">
                    <span className="skill-tag">MySQL</span>
                    <span className="skill-tag">MongoDB</span>
                    <span className="skill-tag">PostgreSQL</span>
                  </div>
                </div>
              </div>

              <div className="glass-card animate-on-scroll delay-3">
                <div className="skill-category">
                  <h3><Wrench className="inline-block mr-2" size={24} /> Tools & Platforms</h3>
                  <div className="skill-list">
                    <span className="skill-tag">Git & GitHub</span>
                    <span className="skill-tag">CI/CD</span>
                    <span className="skill-tag">VS Code</span>
                    <span className="skill-tag">Postman & Swagger</span>
                    <span className="skill-tag">Firebase Hosting</span>
                    <span className="skill-tag">Cloudways & Plesk</span>
                    <span className="skill-tag">XAMPP</span>
                    <span className="skill-tag">Putty & Filezilla</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Education & Certifications</h2>
            
            <div className="edu-grid">
              <div className="glass-card animate-on-scroll">
                <h3>Bachelor of Information Technology</h3>
                <p style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>Manakula Vinayagar Engineering College, Puducherry</p>
                <p>2019 - 2023</p>
                <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>CGPA: 7.9 / 10</p>
              </div>

              <div className="glass-card animate-on-scroll delay-1">
                <h3 style={{ marginBottom: '1rem' }}>Certifications & Internships</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <li style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                    <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0.2rem' }}>Fullstack Course</div>
                    <div>Accord Info Matrix, Chennai (2024)</div>
                  </li>
                  <li style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                    <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0.2rem' }}>Internship</div>
                    <div>FlutterFlow, Askan Technology, Pondicherry (2023)</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <div className="container">
            <div className="glass-card contact-container animate-on-scroll">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get In Touch</h2>
              <p>I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <a href="mailto:loganathanmvit@gmail.com" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>loganathanmvit@gmail.com</a>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+91 9994134604</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>Chennai</span>
                </div>
              </div>

              <a href="mailto:loganathanmvit@gmail.com" className="btn btn-primary" style={{ marginTop: '2rem' }}>Say Hello</a>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Built with React, Node.js, and Vanilla CSS by Loganathan</p>
      </footer>
    </>
  );
}

export default App;
