import Icon from "./Icon.jsx";

const steps = [
  { icon: "link", title: "Create a link", text: "Add a title and amount. Your payment link is ready instantly." },
  { icon: "share", title: "Share with customer", text: "Send the link by chat, SMS or email. It opens on any device." },
  { icon: "wallet", title: "Receive payment", text: "Your customer pays with UPI and you see the status on your dashboard." },
];

export default function HowItWorks() {
  return (
    <section className="section alt" id="how">
      <div className="container">
        <div className="section-head">
          <h2>How it works</h2>
          <p>Start collecting payments in three simple steps.</p>
        </div>
        <ol className="grid grid-3 steps">
          {steps.map((s, i) => (
            <li className="step" key={s.title}>
              <span className="step-num">{i + 1}</span>
              <div className="icon-box"><Icon name={s.icon} /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
