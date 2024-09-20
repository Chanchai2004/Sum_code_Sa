import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <div className='foot'>
      <footer className="footer mt-auto py-3">
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col-md-4">
              <h5>About Us</h5>
              <p>
                Welcome to our Cinema! We are dedicated to bringing you the best movie experiences with the latest blockbusters and classic films.
              </p>
              <p>© 2024 Cinema Co. All rights reserved.</p>
            </div>
            
            {/* Links Section */}
            <div className="col-md-2">
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="#">Home</a></li>
                <li><a href="#">Now Showing</a></li>
                <li><a href="#">Upcoming Movies</a></li>
                <li><a href="#">Membership</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
            
            {/* Guides Section */}
            <div className="col-md-2">
              <h5>Customer Service</h5>
              <ul className="list-unstyled">
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Refund Policy</a></li>
                <li><a href="#">Booking Guide</a></li>
                <li><a href="#">Accessibility</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div className="col-md-4">
              <h5>Follow Us</h5>
              <ul className="list-unstyled d-flex">
                <li className="mr-3"><a href="https://facebook.com" className="text-light"><FaFacebookF size={24} /></a></li>
                <li className="mr-3"><a href="https://twitter.com" className="text-light"><FaTwitter size={24} /></a></li>
                <li className="mr-3"><a href="https://instagram.com" className="text-light"><FaInstagram size={24} /></a></li>
                <li className="mr-3"><a href="https://google.com" className="text-light"><FaGoogle size={24} /></a></li>
              </ul>
              <p>Stay connected with us for the latest updates and offers.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
