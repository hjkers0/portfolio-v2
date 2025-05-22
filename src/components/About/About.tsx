import './About.css';
import { useState } from 'react';
import { translations } from '../../translations';

interface Skill {
  name: string;
  icon: string;
}

interface SkillsData {
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
}

type SkillCategory = keyof SkillsData | 'all';

interface AboutProps {
  lang: string;
}

export default function About({ lang }: AboutProps) {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('frontend');
  const t = translations[lang as keyof typeof translations]?.about || translations.es.about;

  const skillsData: SkillsData = {
    frontend: [
      { name: "Angular", icon: "devicon-angularjs-plain" },
      { name: "React", icon: "devicon-react-original" },
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "TypeScript", icon: "devicon-typescript-plain" },
      { name: "HTML5", icon: "devicon-html5-plain" },
      { name: "CSS3", icon: "devicon-css3-plain" },
      { name: "Responsive", icon: "fas fa-mobile-alt" }
    ],
    backend: [
      { name: "Node.js", icon: "devicon-nodejs-plain" },
      { name: "Express", icon: "devicon-express-original" },
      { name: "RESTful APIs", icon: "fas fa-exchange-alt" },
      { name: "MongoDB", icon: "devicon-mongodb-plain" },
      { name: "SQL", icon: "fas fa-database" }
    ],
    tools: [
      { name: "Vitest", icon: "devicon-vitejs-plain" },
      { name: "Jest", icon: "devicon-jest-plain" },
      { name: "Git", icon: "devicon-git-plain" },
      { name: "Docker", icon: "devicon-docker-plain" },
      { name: "Webpack", icon: "devicon-webpack-plain" },
      { name: "CI/CD", icon: "fas fa-cogs" }
    ]
  };
  
  const getActiveSkills = () => {
    return skillsData[activeCategory as keyof SkillsData] || [];
  };

  return (
    <div className="about-container">
      <h2>{t.title}</h2>
      <div className="about-content">
        <p className="intro" dangerouslySetInnerHTML={{ __html: t.intro }}></p>
        
        <div className="skills-container">
          <h3>{t.skills}</h3>
          
          <div className="skills-filter">
            <button 
              className={activeCategory === 'frontend' ? 'active' : ''} 
              onClick={() => setActiveCategory('frontend')}
            >
              {t.frontend}
            </button>
            <button 
              className={activeCategory === 'backend' ? 'active' : ''} 
              onClick={() => setActiveCategory('backend')}
            >
              {t.backend}
            </button>
            <button 
              className={activeCategory === 'tools' ? 'active' : ''} 
              onClick={() => setActiveCategory('tools')}
            >
              {t.tools}
            </button>
          </div>
          
          <div className="skills-cloud">
            {getActiveSkills().map((skill, index) => (
              <div 
                className="skill-bubble" 
                key={index}
                title={`${skill.name}`}
              >
                <i className={skill.icon}></i>
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        <p>{t.journey}</p>
        <p>{t.passion}</p>
      </div>
    </div>
  );
}