import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, settingsResponse] = await Promise.all([
          api.get('/products'),
          api.get('/settings')
        ]);
        
        setProducts(productsResponse.data.products.slice(0, 6)); // Show only first 6 products
        setSettings(settingsResponse.data.settings);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-2xl mb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {settings.site_name || 'Voucher Platform'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Get instant digital services and vouchers for your favorite games and platforms
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Get Started
            </Link>
            <Link to="/support" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-primary-600">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
            <p className="text-gray-600">Get your services delivered instantly after payment confirmation</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">Safe and secure payment processing with multiple payment options</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock customer support to help you with any issues</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Services</h2>
          <Link to="/register" className="text-primary-600 hover:text-primary-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">
                  ৳{product.price}
                </span>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "Fast and reliable service. Got my likes within minutes of payment!"
            </p>
            <p className="font-semibold">- Ahmed Rahman</p>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "Great customer support and instant delivery. Highly recommended!"
            </p>
            <p className="font-semibold">- Fatima Khan</p>
          </div>
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "Best platform for digital services. Easy to use and trustworthy."
            </p>
            <p className="font-semibold">- Mohammad Ali</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gray-100 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of satisfied customers and get instant digital services
        </p>
        <Link to="/register" className="btn-primary text-lg px-8 py-3">
          Create Account Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 border-t border-gray-200 mt-16">
        <p>{settings.site_footer || '© 2024 Voucher Platform. All rights reserved.'}</p>
      </footer>
    </div>
  );
};

export default Home;
