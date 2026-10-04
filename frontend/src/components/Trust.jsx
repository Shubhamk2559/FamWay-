import Icon from "./Icon.jsx";

const items = [
  { icon: "lock", title: "Encrypted connections", text: "All traffic is protected with HTTPS." },
  { icon: "shield", title: "Verified payments", text: "Every payment is checked before an order is marked paid." },
  { icon: "eye", title: "Full visibility", text: "Clear records of every order and payment attempt." },
];

export default function Trust() {
  return (
    <section className="section trust" id="security">
      <div className="container">
        <div className="section-head light">
          <h2>Security and trust, by design</h2>
          <p>We treat your money and your customers' data with care.</p>
        </div>
        <div className="grid grid-3">
          {items.map((t) => (
            <div className="trust-card" key={t.title}>
              <div className="icon-box dark"><Icon name={t.icon} /></div>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
