// src/utils/clipboard.ts - Copy to clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Check if clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const showCopyFeedback = (element: HTMLElement, success: boolean) => {
  const originalText = element.textContent;
  const icon = element.querySelector('svg');
  
  if (success) {
    element.textContent = 'Copied!';
    element.classList.add('bg-green-500', 'text-white');
    element.classList.remove('bg-pink-50', 'text-pink-600', 'hover:bg-pink-100');
    
    // Change icon to checkmark temporarily
    if (icon) {
      icon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      `;
    }
    
    // Reset after 2 seconds
    setTimeout(() => {
      element.textContent = originalText;
      element.classList.remove('bg-green-500', 'text-white');
      element.classList.add('bg-pink-50', 'text-pink-600', 'hover:bg-pink-100');
      
      if (icon) {
        icon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        `;
      }
    }, 2000);
  } else {
    element.textContent = 'Copy failed';
    element.classList.add('bg-red-500', 'text-white');
    element.classList.remove('bg-pink-50', 'text-pink-600', 'hover:bg-pink-100');
    
    setTimeout(() => {
      element.textContent = originalText;
      element.classList.remove('bg-red-500', 'text-white');
      element.classList.add('bg-pink-50', 'text-pink-600', 'hover:bg-pink-100');
    }, 2000);
  }
};
