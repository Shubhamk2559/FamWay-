import Icon from "./Icon.jsx";

const features = [
  { icon: "link", title: "Payment Links", text: "Create shareable links for any amount and send them over WhatsApp, SMS or email." },
  { icon: "qr", title: "UPI QR Payments", text: "Customers scan a QR or open their UPI app and pay in a few taps." },
  { icon: "wallet", title: "Razorpay Integration", text: "Cards, netbanking and wallets through Razorpay.", soon: true },
  { icon: "chart", title: "Transaction Tracking", text: "See every order and its payment status in real time on your dashboard." },
];

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-head">
          <h2>Everything you need to get paid</h2>
          <p>Simple tools that help you collect payments without the hassle.</p>
        </div>
        <div className="grid grid-4">
          {features.map((f) => (
            <article className="card" key={f.title}>
              <div className="icon-box"><Icon name={f.icon} /></div>
              <h3>
                {f.title}
                {f.soon && <span className="soon">Coming soon</span>}
              </h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
