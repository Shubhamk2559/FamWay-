export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="logo" aria-label="FamWay home">
          <span className="logo-mark">F</span>
          <span className="logo-text">FamWay</span>
        </a>

        <nav className="nav-links" aria-label="Main">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#security">Security</a>
        </nav>

        <div className="nav-actions">
          <a href="#" className="btn btn-ghost btn-sm">Login</a>
          <a href="#" className="btn btn-primary btn-sm">Create Account</a>
        </div>
      </div>
    </header>
  );
}
