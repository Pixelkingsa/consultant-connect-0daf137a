
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="text-2xl font-medium tracking-tight"
      aria-label="Vamna Fragrances"
    >
      Vamna<span className="text-accent font-normal">.</span>
    </Link>
  );
};

export default Logo;
