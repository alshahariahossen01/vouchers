import React, { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/admin/all');
      const settingsObj = {};
      response.data.settings.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/settings', { settings });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading settings..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600">Manage your website configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>General Settings</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                className="input-field"
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="Enter site name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Text
              </label>
              <textarea
                className="input-field"
                rows="3"
                value={settings.site_footer || ''}
                onChange={(e) => handleChange('site_footer', e.target.value)}
                placeholder="Enter footer text"
              />
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Contact Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                className="input-field"
                value={settings.support_email || ''}
                onChange={(e) => handleChange('support_email', e.target.value)}
                placeholder="support@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Phone
              </label>
              <input
                type="tel"
                className="input-field"
                value={settings.support_phone || ''}
                onChange={(e) => handleChange('support_phone', e.target.value)}
                placeholder="+880-123-456-789"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Payment Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Gateway URL
              </label>
              <input
                type="url"
                className="input-field"
                value={settings.payment_gateway_url || ''}
                onChange={(e) => handleChange('payment_gateway_url', e.target.value)}
                placeholder="https://api.payment-gateway.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Gateway Key
              </label>
              <input
                type="text"
                className="input-field"
                value={settings.payment_gateway_key || ''}
                onChange={(e) => handleChange('payment_gateway_key', e.target.value)}
                placeholder="Your payment gateway key"
              />
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold">Additional Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Mode
              </label>
              <select
                className="input-field"
                value={settings.maintenance_mode || 'false'}
                onChange={(e) => handleChange('maintenance_mode', e.target.value)}
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <select
                className="input-field"
                value={settings.default_currency || 'BDT'}
                onChange={(e) => handleChange('default_currency', e.target.value)}
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Preview</h2>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {settings.site_name || 'Voucher Platform'}
            </h1>
            <p className="text-gray-600 mb-4">
              Get instant digital services and vouchers for your favorite games and platforms
            </p>
            <div className="text-sm text-gray-500">
              <p>Support: {settings.support_email || 'support@example.com'}</p>
              <p>Phone: {settings.support_phone || '+880-123-456-789'}</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            {settings.site_footer || '© 2024 Voucher Platform. All rights reserved.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
