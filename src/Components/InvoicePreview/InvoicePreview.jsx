import { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoicePreview = ({ invoice, isSubmitted }) => {
  const previewRef = useRef(null);
  const [qrValue, setQrValue] = useState("");
  
  const safeInvoice = invoice || {};
  
  useEffect(() => {
    if (safeInvoice) {
      const qrData = JSON.stringify({
        Invoice: safeInvoice.invoiceNumber || '',
        Client: safeInvoice.clientName || '',
        Date: safeInvoice.invoiceDate || '',
        Amount: `₹${safeInvoice.total?.toFixed(2) || '0.00'}`,
        Company: safeInvoice.companyName || '',
        GST: safeInvoice.companyGST || 'N/A'
      }, null, 2);
      
      setQrValue(qrData);
    }
  }, [safeInvoice]);

  const handleDownloadPDF = async () => {
    if (previewRef.current === null) return;

    try {
      // Create a clone of the element to avoid modifying the original
      const element = previewRef.current;
      const clone = element.cloneNode(true);
      
      // Remove any problematic styles before capturing
      clone.style.color = '#000000';
      clone.style.backgroundColor = '#ffffff';
      
      // Remove Tailwind classes that might use oklch
      clone.classList.remove('bg-white', 'text-gray-800', 'text-blue-800', 'bg-gray-50', 
                            'bg-yellow-50', 'text-yellow-800', 'text-blue-600', 
                            'bg-green-600', 'hover:bg-green-700', 'bg-gray-400');
      
      // Apply safe CSS styles directly
      clone.style.fontFamily = 'Arial, sans-serif';
      clone.style.color = '#000000';
      clone.style.backgroundColor = '#ffffff';
      
      // Process all child elements to remove problematic styles
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(el => {
        // Remove all classes to avoid oklch colors
        el.removeAttribute('class');
        
        // Apply safe inline styles
        el.style.color = '#000000';
        el.style.backgroundColor = el.tagName === 'TH' || el.tagName === 'TR' && el.getAttribute('style')?.includes('background') 
          ? '#f3f4f6' 
          : '#ffffff';
        el.style.borderColor = '#d1d5db';
        el.style.fontFamily = 'Arial, sans-serif';
        
        // Remove any inline styles that might contain oklch
        const style = el.getAttribute('style');
        if (style && style.includes('oklch')) {
          el.removeAttribute('style');
          el.style.color = '#000000';
          el.style.backgroundColor = '#ffffff';
          el.style.fontFamily = 'Arial, sans-serif';
        }
      });

      // Append clone to document temporarily
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          // Skip SVG elements that might cause issues
          return element.tagName === 'svg' || element.classList.contains('h-5') || element.classList.contains('w-5');
        }
      });

      // Remove clone from document
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      let heightLeft = imgHeight - pageHeight;
      let position = 0;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${safeInvoice.invoiceNumber || 'invoice'}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF generation failed. Please try again.');
    }
  };

  if (!invoice) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <p>No invoice data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Invoice Preview</h2>
        {isSubmitted ? (
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        ) : (
          <button 
            disabled
            className="flex items-center bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit Form First
          </button>
        )}
      </div>
      
      {!isSubmitted && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            📝 Please submit the form first to enable PDF download
          </p>
        </div>
      )}
      
      <div 
        ref={previewRef} 
        className="border-2 border-gray-200 p-8 rounded-lg bg-white"
        style={{ fontFamily: 'Arial, sans-serif' }} // Add fallback font
      >
        {/* Invoice Preview Content */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-300">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-blue-800 mb-3">INVOICE</h1>
            <div className="space-y-1 text-gray-700">
              <p className="font-semibold text-lg">{safeInvoice.companyName || 'Your Company Name'}</p>
              <p className="text-sm">{safeInvoice.companyAddress || '123 Business Street, City, State 12345'}</p>
              <p className="text-sm">{safeInvoice.companyEmail || 'billing@yourcompany.com'}</p>
              <p className="text-sm">{safeInvoice.companyPhone || '+1 (555) 123-4567'}</p>
              {safeInvoice.companyGST && (
                <p className="text-sm font-medium">GST: {safeInvoice.companyGST}</p>
              )}
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="mb-1">
              <span className="font-semibold text-gray-700">Invoice #: </span>
              <span className="text-blue-600 font-medium">{safeInvoice.invoiceNumber || 'INV-0000'}</span>
            </div>
            <div className="mb-1">
              <span className="font-semibold text-gray-700">Date: </span>
              <span>{safeInvoice.invoiceDate || new Date().toISOString().split('T')[0]}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Due Date: </span>
              <span>{safeInvoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-300">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
            <div className="space-y-1 text-gray-700">
              <p className="font-medium text-gray-900">{safeInvoice.clientName || "Client Name"}</p>
              {safeInvoice.clientGST && (
                <p className="text-sm">GST: {safeInvoice.clientGST}</p>
              )}
              {safeInvoice.clientEmail && (
                <p className="text-sm">{safeInvoice.clientEmail}</p>
              )}
              {safeInvoice.clientAddress && (
                <p className="text-sm whitespace-pre-line mt-2">{safeInvoice.clientAddress}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="mb-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {qrValue && (
                <QRCodeSVG 
                  value={qrValue} 
                  size={80}
                  level="M"
                  includeMargin={false}
                />
              )}
            </div>
            <div className="text-xs text-gray-500 text-center mt-1">
              Scan to verify<br/>invoice details
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 border-b-2 border-gray-300">Description</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700 border-b-2 border-gray-300 w-20">Qty</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-700 border-b-2 border-gray-300 w-28">Rate</th>
                <th className="text-right py-4 px-4 font-semibold text-gray-700 border-b-2 border-gray-300 w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(safeInvoice.lineItems || []).map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 align-top">
                    <div className="whitespace-pre-wrap break-words max-w-md text-gray-800">
                      {item.description || "Item description"}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center align-top text-gray-700">{item.quantity || 0}</td>
                  <td className="py-3 px-4 text-right align-top text-gray-700">₹{Number(item.rate || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right align-top font-medium text-gray-900">
                    ₹{(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end mb-6">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Subtotal:</span>
              <span>₹{safeInvoice.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">GST (18%):</span>
              <span>₹{safeInvoice.gst?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-300">
              <span className="text-gray-900">Total Amount:</span>
              <span className="text-blue-600">₹{safeInvoice.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
        
        {safeInvoice.notes && safeInvoice.notes.trim() !== 'Thank you for your business!' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">Notes:</h4>
            <p className="text-gray-600 whitespace-pre-line text-sm">{safeInvoice.notes}</p>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;