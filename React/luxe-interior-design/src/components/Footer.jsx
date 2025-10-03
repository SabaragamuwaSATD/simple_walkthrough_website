import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="footer-section">
                    <h4 className="text-lg font-semibold mb-4">LUXE Studio</h4>
                    <p>Creating beautiful spaces that inspire and delight. Your vision, our expertise.</p>
                </div>
                <div className="footer-section">
                    <h4 className="text-lg font-semibold mb-4">Contact</h4>
                    <p>123 Design Avenue<br />New York, NY 10001</p>
                    <p>Phone: (555) 123-4567<br />Email: hello@luxestudio.com</p>
                </div>
                <div className="footer-section">
                    <h4 className="text-lg font-semibold mb-4">Hours</h4>
                    <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM<br />Sunday: Closed</p>
                </div>
                <div className="footer-section">
                    <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                    <a href="#" className="hover:text-gray-400">Instagram</a>
                    <a href="#" className="hover:text-gray-400">Pinterest</a>
                    <a href="#" className="hover:text-gray-400">Facebook</a>
                    <a href="#" className="hover:text-gray-400">LinkedIn</a>
                </div>
            </div>
            <div className="footer-bottom text-center mt-10 border-t border-gray-700 pt-4">
                <p className="text-sm">&copy; 2025 Luxe Interior Design Studio. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;