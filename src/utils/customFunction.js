export const Utils = {
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  getEmptyFormData: () => ({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    tags: '',
    isActive: true
  })
};