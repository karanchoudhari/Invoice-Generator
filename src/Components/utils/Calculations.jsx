export const calculateTotals = (invoice) => {
  const subtotal = invoice.lineItems.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0)
  }, 0)
  
  const gst = subtotal * 0.18
  const total = subtotal + gst
  
  return {
    ...invoice,
    subtotal: parseFloat(subtotal.toFixed(2)),
    gst: parseFloat(gst.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  }
};