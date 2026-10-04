export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <a href="#top" className="logo light">
            <span className="logo-mark">F</span>
            <span className="logo-text">FamWay</span>
          </a>
          <p className="footer-tag">Simple, trusted payment collection.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#security">Security</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} FamWay. All rights reserved.
      </div>
    </footer>
  );
}
