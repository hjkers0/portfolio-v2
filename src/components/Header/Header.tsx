import './Header.css';
export default function Header({ setLanguage } : { setLanguage: (lang: string) => void }) {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-contact">
                    <a href="mailto:hjkerstenne@gmail.com" className="header-email" target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-envelope"></i>
                    </a>
                    <a href="https://www.github.com/hjkers0" className="header-github" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/hjkers/" className="header-linkedin" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin"></i>
                    </a>
                </div>
                <div className='header-language'>
                    <select 
                      onChange={(e) => setLanguage(e.target.value)} 
                      defaultValue="es"
                    >
                        <option value="es">
                            🇪🇸
                            ES
                        </option>
                        <option value="en">
                            🇺🇸
                            EN
                        </option>
                    </select>
                </div>
            </div>
        </header>
    );
}