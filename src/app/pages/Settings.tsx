import React from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useConfig } from '../store/ConfigContext';
import { Switch } from '../components/ui/switch';

export function Settings() {
  const {
    config,
    updateFieldConfig,
    setDefaultTemplate,
    resetToDefault,
    updateBusiness,
    updateBank,
    updateInvoiceDefaults,
  } = useConfig();

  const handleBusinessChange = (field: keyof typeof config.business, value: string) => {
    updateBusiness({ [field]: value });
  };

  const handleBankChange = (field: keyof typeof config.bank, value: string) => {
    updateBank({ [field]: value });
  };

  const handleInvoiceDefaultsChange = (
    field: keyof typeof config.invoiceDefaults,
    value: string
  ) => {
    updateInvoiceDefaults({ [field]: value });
  };

  const templateOptions = [
    { value: 'classic', label: 'Classic', description: 'Traditional invoice with borders' },
    { value: 'modern', label: 'Modern', description: 'Clean design with blue accents' },
    { value: 'minimal', label: 'Minimal', description: 'Simple and elegant layout' },
    { value: 'professional', label: 'Professional', description: 'Corporate style with structured layout' },
    { value: 'elegant', label: 'Elegant', description: 'Clean minimal layout with light borders' },
    { value: 'gst', label: 'GST Form', description: 'Structured GST-style tax invoice layout' },
  ] as const;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your business settings and preferences</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Invoice Template Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Template</h2>
          <p className="text-sm text-gray-600 mb-4">Choose your preferred invoice design template</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templateOptions.map((template) => (
              <div
                key={template.value}
                onClick={() => setDefaultTemplate(template.value)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  config.defaultTemplate === template.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{template.label}</h3>
                  {config.defaultTemplate === template.value && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Dynamic Fields Configuration */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Fields Configuration</h2>
          <p className="text-sm text-gray-600 mb-4">
            Customize which fields appear in your invoice and their labels
          </p>
          <div className="space-y-4">
            {Object.entries(config.fields).map(([key, field]) => (
              <div key={key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Switch
                  checked={field.enabled}
                  onCheckedChange={(checked) => updateFieldConfig(key as any, checked)}
                  disabled={key === 'total'} // Total field is always required
                />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Field Name</Label>
                    <p className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                  <div>
                    <Label htmlFor={`label-${key}`} className="text-xs text-gray-500">Display Label</Label>
                    <Input
                      id={`label-${key}`}
                      value={field.label}
                      onChange={(e) => updateFieldConfig(key as any, field.enabled, e.target.value)}
                      className="h-8 text-sm"
                      disabled={!field.enabled}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">
              <strong>Note:</strong> Disabled fields will not appear in your invoices. You can also customize the display labels.
            </p>
            <Button variant="outline" size="sm" onClick={resetToDefault}>
              Reset to Default
            </Button>
          </div>
        </Card>

        {/* Business Information */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="settingsBusinessName">Business Name</Label>
              <Input
                id="settingsBusinessName"
                value={config.business.name}
                onChange={(e) => handleBusinessChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="settingsBusinessAddress">Business Address</Label>
              <Textarea
                id="settingsBusinessAddress"
                value={config.business.address}
                onChange={(e) => handleBusinessChange('address', e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settingsGST">GST Number</Label>
                <Input
                  id="settingsGST"
                  value={config.business.gst}
                  onChange={(e) => handleBusinessChange('gst', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settingsPAN">PAN Number</Label>
                <Input
                  id="settingsPAN"
                  value={config.business.pan}
                  onChange={(e) => handleBusinessChange('pan', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settingsMobile">Mobile Number</Label>
                <Input
                  id="settingsMobile"
                  type="tel"
                  value={config.business.mobile}
                  onChange={(e) => handleBusinessChange('mobile', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settingsEmail">Email</Label>
                <Input
                  id="settingsEmail"
                  type="email"
                  value={config.business.email}
                  onChange={(e) => handleBusinessChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Bank Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Default Bank Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settingsBankName">Bank Name</Label>
                <Input
                  id="settingsBankName"
                  value={config.bank.bankName}
                  onChange={(e) => handleBankChange('bankName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settingsBranch">Branch</Label>
                <Input
                  id="settingsBranch"
                  value={config.bank.branch}
                  onChange={(e) => handleBankChange('branch', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settingsAccount">Account Number</Label>
                <Input
                  id="settingsAccount"
                  value={config.bank.accountNumber}
                  onChange={(e) => handleBankChange('accountNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="settingsIFSC">IFSC Code</Label>
                <Input
                  id="settingsIFSC"
                  value={config.bank.ifsc}
                  onChange={(e) => handleBankChange('ifsc', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Invoice Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invoice Settings</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="settingsInvoicePrefix">Invoice Number Prefix</Label>
              <Input
                id="settingsInvoicePrefix"
                value={config.invoiceDefaults.invoicePrefix}
                onChange={(e) =>
                  handleInvoiceDefaultsChange('invoicePrefix', e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="settingsDefaultNotes">Default Invoice Notes</Label>
              <Textarea
                id="settingsDefaultNotes"
                value={config.invoiceDefaults.defaultNotes}
                onChange={(e) =>
                  handleInvoiceDefaultsChange('defaultNotes', e.target.value)
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="settingsPlaceOfSupply">Default Place of Supply</Label>
              <Input
                id="settingsPlaceOfSupply"
                value={config.invoiceDefaults.defaultPlaceOfSupply}
                onChange={(e) =>
                  handleInvoiceDefaultsChange('defaultPlaceOfSupply', e.target.value)
                }
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={() => resetToDefault()}>
            Reset All To Default
          </Button>
        </div>
      </div>
    </div>
  );
}
