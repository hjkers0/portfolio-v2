import './App.css'
import { useState } from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
function App() {
  const [language, setLanguage] = useState('es');

  return (
    <div className="app-container">
      <div className="background-gradient"></div>
      <div className="content-wrapper">
        <Header setLanguage={setLanguage}/>
        <Hero lang={language} />
        <About lang={language} />
      </div>
    </div>
  )
}

export default App
