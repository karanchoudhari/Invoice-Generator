import LineItemRow from './LineItemRow'
import Button from '../UI/Button'
import Input from '../UI/Input'

const InvoiceForm = ({ invoice, errors, updateInvoice, addLineItem, removeLineItem, isSubmitted, handleSubmit }) => {
  const safeInvoice = invoice || {
    companyName: '',
    companyGST: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientGST: '',
    lineItems: [],
    subtotal: 0,
    gst: 0,
    total: 0,
    notes: ''
  };

  const safeErrors = errors || {};

  const handleInputChange = (field, value) => {
    // Special handling for GST fields to limit to 15 characters
    if ((field === 'companyGST' || field === 'clientGST') && value.length > 15) {
      return;
    }
    
    // Special handling for client name to allow only letters and spaces
    if (field === 'clientName') {
      value = value.replace(/[0-9]/g, '');
    }
    
    updateInvoice(field, value)
  }

  const handleLineItemChange = (id, field, value) => {
    const index = safeInvoice.lineItems.findIndex(item => item.id === id)
    if (index !== -1) {
      updateInvoice(`lineItems.${index}.${field}`, value)
    }
  }

  // Function to format address with word wrapping (25 characters per line)
  const formatAddressWithLineBreaks = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + ' ' + word).length > 25) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += (currentLine ? ' ' : '') + word;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  };

  const handleAddressChange = (e) => {
    const formattedText = formatAddressWithLineBreaks(e.target.value);
    handleInputChange('clientAddress', formattedText);
  };

  const onSubmit = () => {
    handleSubmit();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold ml-3 text-gray-800">Invoice Details</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Company Name
          </label>
          <Input
            type="text"
            value={safeInvoice.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Company Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company GST Number (max 15 characters)
          </label>
          <Input
            type="text"
            value={safeInvoice.companyGST}
            onChange={(e) => handleInputChange('companyGST', e.target.value)}
            placeholder="GSTIN Number"
            maxLength="15"
            error={safeErrors.companyGST}
          />
          {safeErrors.companyGST && <p className="text-red-500 text-xs mt-1">{safeErrors.companyGST}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Number
          </label>
          <Input
            type="text"
            value={safeInvoice.invoiceNumber}
            onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            placeholder="INV-001"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Invoice Date
          </label>
          <Input
            type="date"
            value={safeInvoice.invoiceDate}
            onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <Input
            type="date"
            value={safeInvoice.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
          />
        </div>
      </div>
      
      <div className="border-t pt-4 mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name *
            </label>
            <Input
              type="text"
              value={safeInvoice.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              placeholder="Client Name"
              error={safeErrors.clientName}
              required
            />
            {safeErrors.clientName && <p className="text-red-500 text-xs mt-1">{safeErrors.clientName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client GST Number (max 15 characters)
            </label>
            <Input
              type="text"
              value={safeInvoice.clientGST}
              onChange={(e) => handleInputChange('clientGST', e.target.value)}
              placeholder="GSTIN Number"
              maxLength="15"
              error={safeErrors.clientGST}
            />
            {safeErrors.clientGST && <p className="text-red-500 text-xs mt-1">{safeErrors.clientGST}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <Input
              type="email"
              value={safeInvoice.clientEmail}
              onChange={(e) => handleInputChange('clientEmail', e.target.value)}
              placeholder="client@example.com"
              error={safeErrors.clientEmail}
            />
            {safeErrors.clientEmail && <p className="text-red-500 text-xs mt-1">{safeErrors.clientEmail}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Address (auto line break after 25 characters)
            </label>
            <textarea
              value={safeInvoice.clientAddress}
              onChange={handleAddressChange}
              placeholder="Client Address - text will automatically wrap after 25 characters"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800">Line Items</h3>
          <Button onClick={addLineItem} variant="primary" className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </Button>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Qty
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeInvoice.lineItems.map((item, index) => (
                <LineItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  onChange={handleLineItemChange}
                  onRemove={() => removeLineItem(item.id)}
                  errors={safeErrors}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between mb-1 text-lg">
          <span className="font-medium">Subtotal:</span>
          <span>₹{safeInvoice.subtotal?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between mb-1 text-lg">
          <span className="font-medium">GST (18%):</span>
          <span>₹{safeInvoice.gst?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-2 border-t">
          <span>Total:</span>
          <span>₹{safeInvoice.total?.toFixed(2) || '0.00'}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          value={safeInvoice.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Notes or additional information"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Button 
          onClick={onSubmit} 
          variant="primary" 
          className="w-full py-3 text-lg"
        >
          {isSubmitted ? '✓ Form Submitted' : 'Submit Invoice Form'}
        </Button>
        {!isSubmitted && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            Submit the form to enable PDF download
          </p>
        )}
      </div>
    </div>
  )
}

export default InvoiceForm;