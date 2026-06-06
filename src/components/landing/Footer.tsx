import Image from "next/image";
import "@/styles/footer.css";

const SOCIAL_LINKS = [
  { label: "github.com/eric_reyes", href: "https://github.com/EricReyes-Icloud", icon: "/icono github.png" },
  { label: "linkedin.com/in/eric_reyes", href: "https://www.linkedin.com/in/eric-reyes-b96418343/", icon: "/icono linkedin.png" },
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
              <Image
                src={link.icon}
                alt=""
                width={20}
                height={20}
                className="footer-icon"
              />
              {link.label}
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
