import React from 'react';
import { HeadphonesIcon, Mail, Phone, MessageCircle, Clock } from 'lucide-react';

const Support = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <HeadphonesIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600">We're here to help you with any questions or issues</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Contact Information */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-gray-600">support@voucher.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-gray-600">+880-123-456-789</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Live Chat</p>
                <p className="text-gray-600">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Support Hours</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Email Support</p>
                <p className="text-gray-600">24/7 - Response within 2 hours</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Phone Support</p>
                <p className="text-gray-600">9 AM - 6 PM (GMT+6)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Live Chat</p>
                <p className="text-gray-600">24/7 - Instant response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">How long does it take to deliver services?</h3>
            <p className="text-gray-600">
              Most services are delivered within 24 hours after payment confirmation. 
              Some services may be delivered instantly depending on the type.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept bKash, Nagad, Rocket, and Bank Transfer. All payments are processed securely.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">What if my order is not delivered?</h3>
            <p className="text-gray-600">
              If your order is not delivered within the promised timeframe, please contact our support team. 
              We will investigate and provide a full refund if necessary.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Can I cancel my order?</h3>
            <p className="text-gray-600">
              Orders can be cancelled within 1 hour of placement if payment has not been made. 
              Once payment is confirmed, cancellation is subject to our refund policy.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">How do I track my order?</h3>
            <p className="text-gray-600">
              You can track your order status in the "My Orders" section of your account. 
              You will also receive email notifications for status updates.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Send us a Message</h2>
        
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              className="input-field"
              rows="5"
              placeholder="Describe your issue or question..."
            />
          </div>

          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;
