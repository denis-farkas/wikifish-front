import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p className="text-center mb-0">
          &copy; {currentYear} WikiPoisson - Tous droits réservés
        </p>
      </div>
    </footer>
  );
};

export default Footer;
