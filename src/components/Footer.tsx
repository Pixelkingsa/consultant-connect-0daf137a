
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-auto">
      <div className="container max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="text-xl font-medium tracking-tight">
              Vamna<span className="text-accent font-normal">.</span>
            </Link>
            <p className="text-primary-foreground/80 text-sm max-w-xs">
              Join our team of fragrance consultants and start your journey to financial freedom.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Consultants</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/opportunity" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Opportunity
                </Link>
              </li>
              <li>
                <Link to="/compensation" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Compensation Plan
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Consultant Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-primary-foreground/80 hover:text-accent text-sm transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-xs">
            &copy; {currentYear} Vamna Fragrances. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <img 
              src="https://assets.ycodeapp.com/assets/app18099/Images/payment-methods-light.svg" 
              alt="Payment methods" 
              className="h-6" 
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
