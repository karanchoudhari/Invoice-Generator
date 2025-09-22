import InvoiceForm from './Components/InvoiceForm/InvoiceForm'
import InvoicePreview from './Components/InvoicePreview/InvoicePreview'
import { useInvoice } from './Components/hooks/useInvoice'
import './index.css'

function App() {
  const { invoice, errors, isSubmitted, updateInvoice, addLineItem, removeLineItem, handleSubmit } = useInvoice()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
               Invoice Generator
            </span>
          </h1>
          <p className="text-gray-600">Create, preview and download invoices</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <InvoiceForm 
              invoice={invoice}
              errors={errors}
              updateInvoice={updateInvoice}
              addLineItem={addLineItem}
              removeLineItem={removeLineItem}
              isSubmitted={isSubmitted}
              handleSubmit={handleSubmit}
            />
          </div>
          
          <div className="w-full lg:w-1/2">
            <InvoicePreview invoice={invoice} isSubmitted={isSubmitted} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;