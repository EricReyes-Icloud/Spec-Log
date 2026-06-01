import "@/styles/footer.css";

const SOCIAL_LINKS = [
  { label: "github.com/ericreyes", href: "https://github.com/ericreyes" },
  { label: "linkedin.com/in/ericreyes", href: "https://linkedin.com/in/ericreyes" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.label}
              className="footer-link"
            >
              [{link.label}]
            </a>
          ))}
        </div>

        <p className="footer-comment">
          {'/* Suscríbete a Spec Log... */'}
        </p>
      </div>
    </footer>
  );
}
