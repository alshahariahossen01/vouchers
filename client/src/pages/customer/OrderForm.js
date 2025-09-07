import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderForm = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    player_id: '',
    payment_method: '',
    notes: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post('/orders', formData);
      toast.success('Order placed successfully!');
      navigate('/my-orders');
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id === parseInt(formData.product_id));

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Place New Order</h1>
        <p className="text-gray-600">Select a service and provide your details</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service *
            </label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Choose a service...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ৳{product.price}
                </option>
              ))}
            </select>
          </div>

          {/* Product Details */}
          {selectedProduct && (
            <div className="p-4 bg-primary-50 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">
                {selectedProduct.name}
              </h3>
              <p className="text-primary-700 mb-2">
                {selectedProduct.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary-600">
                  ৳{selectedProduct.price}
                </span>
                <span className="text-sm text-primary-600 bg-primary-100 px-2 py-1 rounded">
                  {selectedProduct.category}
                </span>
              </div>
            </div>
          )}

          {/* Player ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player ID *
            </label>
            <input
              type="text"
              name="player_id"
              value={formData.player_id}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your player ID"
            />
            <p className="text-sm text-gray-500 mt-1">
              This is where the service will be delivered
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['bKash', 'Nagad', 'Rocket', 'Bank Transfer'].map((method) => (
                <label key={method} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment_method"
                    value={method}
                    checked={formData.payment_method === method}
                    onChange={handleChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Any special instructions or additional information..."
            />
          </div>

          {/* Order Summary */}
          {selectedProduct && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Player ID:</span>
                  <span className="font-medium">{formData.player_id || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">{formData.payment_method || 'Not selected'}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span className="text-primary-600">৳{selectedProduct.price}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !formData.product_id || !formData.player_id || !formData.payment_method}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Placing Order...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Place Order</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Payment Instructions */}
      <div className="mt-8 card">
        <h3 className="text-lg font-semibold mb-4">Payment Instructions</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>1. Complete your order by clicking "Place Order"</p>
          <p>2. You will receive payment details via email</p>
          <p>3. Make payment using your selected method</p>
          <p>4. Send payment confirmation with transaction ID</p>
          <p>5. Your service will be delivered within 24 hours</p>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
