import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-gray-100">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-semibold mb-6">Let's Create Together</h2>
                <p className="text-lg text-gray-600 mb-10">
                    Ready to transform your space? We'd love to hear about your project and discuss how we can bring your vision to life. Schedule a consultation with our design team today.
                </p>
                <a href="#" className="inline-block px-8 py-3 bg-yellow-600 text-white rounded-full text-lg font-semibold transition duration-300 hover:bg-yellow-500">
                    Get In Touch
                </a>
            </div>
        </section>
    );
};

export default Contact;