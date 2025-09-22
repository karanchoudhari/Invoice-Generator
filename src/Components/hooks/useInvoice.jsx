import { useState } from 'react'
import { calculateTotals } from '../utils/Calculations'

export const useInvoice = () => {
  const [invoice, setInvoice] = useState({
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientGST: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    companyName: 'Your Company Name',
    companyAddress: '123 Business Street, City, State 12345',
    companyEmail: 'billing@yourcompany.com',
    companyPhone: '+1 (555) 123-4567',
    companyGST: '',
    lineItems: [
      { id: 1, description: '', quantity: 1, rate: 0 }
    ],
    notes: 'Thank you for your business!',
    subtotal: 0,
    gst: 0,
    total: 0
  })

  const [errors, setErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateField = (field, value) => {
    let error = ''
    
    switch(field) {
      case 'clientEmail':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          error = 'Invalid email address'
        }
        break
      case 'clientName':
        if (!value.trim()) {
          error = 'Client name is required'
        } else if (/[0-9]/.test(value)) {
          error = 'Client name should contain only letters'
        }
        break
      case 'companyGST':
      case 'clientGST':
        if (value && value.length > 15) {
          error = 'GST number should not exceed 15 characters'
        } else if (value && !/^[a-zA-Z0-9]*$/.test(value)) {
          error = 'GST number should contain only letters and numbers'
        }
        break
      case 'quantity':
        if (isNaN(value) || value < 0 || value === '') {
          error = 'Must be a positive number'
        }
        break
      case 'rate':
        if (isNaN(value) || value < 0 || value === '') {
          error = 'Must be a positive number'
        }
        break
      default:
        break
    }
    
    setErrors(prev => ({ ...prev, [field]: error }))
    return error === ''
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Client Name validation
    if (!invoice.clientName.trim()) {
      newErrors.clientName = 'Client name is required'
    } else if (/[0-9]/.test(invoice.clientName)) {
      newErrors.clientName = 'Client name should contain only letters'
    }
    
    // Email validation
    if (invoice.clientEmail && !/\S+@\S+\.\S+/.test(invoice.clientEmail)) {
      newErrors.clientEmail = 'Invalid email address'
    }
    
    // GST validation
    if (invoice.companyGST && invoice.companyGST.length > 15) {
      newErrors.companyGST = 'GST number should not exceed 15 characters'
    }
    
    if (invoice.clientGST && invoice.clientGST.length > 15) {
      newErrors.clientGST = 'GST number should not exceed 15 characters'
    }
    
    // Line items validation
    invoice.lineItems.forEach((item, index) => {
      if (isNaN(item.quantity) || item.quantity < 0 || item.quantity === '') {
        newErrors[`quantity_${index}`] = 'Quantity must be a positive number'
      }
      if (isNaN(item.rate) || item.rate < 0 || item.rate === '') {
        newErrors[`rate_${index}`] = 'Rate must be a positive number'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateInvoice = (field, value) => {
    if (field.startsWith('lineItems.')) {
      const [_, index, subField] = field.split('.')
      const updatedLineItems = [...invoice.lineItems]
      updatedLineItems[index] = { ...updatedLineItems[index], [subField]: value }
      
      validateField(subField, value)
      
      setInvoice(prev => {
        const updated = { ...prev, lineItems: updatedLineItems }
        return calculateTotals(updated)
      })
    } else {
      validateField(field, value)
      
      setInvoice(prev => {
        const updated = { ...prev, [field]: value }
        return calculateTotals(updated)
      })
    }
  }

  const addLineItem = () => {
    setInvoice(prev => {
      const newLineItem = {
        id: Date.now(),
        description: '',
        quantity: 1,
        rate: 0
      }
      const updated = {
        ...prev,
        lineItems: [...prev.lineItems, newLineItem]
      }
      return calculateTotals(updated)
    })
  }

  const removeLineItem = (id) => {
    if (invoice.lineItems.length <= 1) return
    
    setInvoice(prev => {
      const updated = {
        ...prev,
        lineItems: prev.lineItems.filter(item => item.id !== id)
      }
      return calculateTotals(updated)
    })
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitted(true)
      return true
    }
    return false
  }

  return {
    invoice,
    errors,
    isSubmitted,
    updateInvoice,
    addLineItem,
    removeLineItem,
    validateField,
    handleSubmit,
    setIsSubmitted
  }
}