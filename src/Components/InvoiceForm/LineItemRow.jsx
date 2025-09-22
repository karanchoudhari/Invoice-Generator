import Input from '../UI/Input'
import Button from '../UI/Button'

const LineItemRow = ({ item, onChange, onRemove, errors }) => {
  const amount = (Number(item.quantity) * Number(item.rate)).toFixed(2)
  
  // Fixed function to format text with word wrapping after 15 words
  const formatTextWithLineBreaks = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    const lines = [];
    let currentLine = [];
    let wordCount = 0;
    
    words.forEach(word => {
      if (wordCount >= 15) {
        lines.push(currentLine.join(' '));
        currentLine = [word];
        wordCount = 1;
      } else {
        currentLine.push(word);
        wordCount++;
      }
    });
    
    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }
    return lines.join('\n');
  };

  const handleDescriptionChange = (e) => {
    const formattedText = formatTextWithLineBreaks(e.target.value);
    onChange(item.id, 'description', formattedText);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-4 py-3">
        <textarea
          value={item.description}
          onChange={handleDescriptionChange}
          placeholder="Item description"
          rows={Math.max(2, item.description.split('\n').length)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none whitespace-pre-wrap break-words"
          style={{ minHeight: '60px' }}
        />
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onChange(item.id, 'quantity', e.target.value)}
          error={errors.quantity}
        />
        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.rate}
          onChange={(e) => onChange(item.id, 'rate', e.target.value)}
          error={errors.rate}
        />
        {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate}</p>}
      </td>
      <td className="px-4 py-3 font-medium">₹{amount}</td>
      <td className="px-4 py-3">
        <Button onClick={onRemove} variant="danger" size="sm" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </td>
    </tr>
  )
}

export default LineItemRow;