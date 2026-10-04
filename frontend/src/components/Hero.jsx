import Icon from "./Icon.jsx";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="pill">
            <Icon name="bolt" size={14} /> Built for Indian businesses
          </span>
          <h1>
            Accept payments easily with <span className="grad">FamWay</span>
          </h1>
          <p className="lead">
            Create a payment link in seconds, share it anywhere, and get paid
            with UPI. Track every order and payment from one clean dashboard.
          </p>
          <div className="hero-cta">
            <a href="#" className="btn btn-primary btn-lg">Create Payment Link</a>
            <a href="#how" className="btn btn-outline btn-lg">See how it works</a>
          </div>
          <ul className="hero-points">
            <li><Icon name="check" size={16} /> No code needed</li>
            <li><Icon name="check" size={16} /> Works on every device</li>
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="pay-card">
            <div className="pay-head">
              <span className="logo-mark sm">F</span>
              <div>
                <strong>Aarav Stores</strong>
                <small>Payment request</small>
              </div>
              <span className="badge-paid">Paid</span>
            </div>
            <div className="pay-amount">₹2,499.00</div>
            <div className="pay-qr">
              {Array.from({ length: 49 }).map((_, i) => (
                <i key={i} className={(i * 7 + (i % 5) * 3) % 3 === 0 ? "on" : ""} />
              ))}
            </div>
            <div className="pay-foot">Scan with any UPI app</div>
          </div>
        </div>
      </div>
    </section>
  );
}
