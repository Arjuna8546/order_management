import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ShoppingCart, User, Mail, Package, X } from 'lucide-react';
import { useState } from 'react';
import { addOrder } from '../endpoints/api';
import { toast } from 'sonner';

const FormPage = () => {
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(false)

  const products = [
    { id: 'laptop-dell', name: 'Dell Laptop XPS 13', cost: 1299.99 },
    { id: 'laptop-hp', name: 'HP Pavilion 15', cost: 899.99 },
    { id: 'laptop-mac', name: 'MacBook Air M2', cost: 1199.99 },
    { id: 'phone-iphone', name: 'iPhone 15 Pro', cost: 999.99 },
    { id: 'phone-samsung', name: 'Samsung Galaxy S24', cost: 799.99 },
    { id: 'tablet-ipad', name: 'iPad Air', cost: 599.99 },
    { id: 'headphones-sony', name: 'Sony WH-1000XM5', cost: 399.99 },
    { id: 'headphones-bose', name: 'Bose QuietComfort', cost: 329.99 }
  ];

  const formik = useFormik({
    initialValues: {
      customer_name: '',
      customer_id: '',
      quantity: 1,
      product: '',
      product_cost: '',
      user_email: ''
    },
    validationSchema: Yup.object({
      customer_name: Yup.string().required('Customer name is required'),
      customer_id: Yup.string().required('Customer ID is required'),
      quantity: Yup.number().min(1).required('Quantity is required'),
      product: Yup.string().required('Product is required'),
      product_cost: Yup.number().required('Product cost is required'),
      user_email: Yup.string().email('Invalid email').required('Email is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const selected = products.find(p => p.id === values.product);
      const totalCost = parseFloat(values.product_cost) * parseInt(values.quantity);

      const payload = {
        ...values,
        product: selected ? selected.name : '',
        total_cost: totalCost
      };

      try {
        const res = await addOrder(payload);

        if (res.data.success) {
          toast.success(`Order #${res.data.data.id} submitted successfully`);
          setShowSummary(false);
          resetForm();
        } else {
          toast.error('Failed to submit order. Please check your input.');
        }
      } catch (err) {
        toast.error('Something went wrong while submitting the order.');
      }finally{
        setLoading(false);
      }
    }
  });

  const handleProductChange = (productId) => {
    const selected = products.find(p => p.id === productId);
    formik.setFieldValue('product', productId);
    formik.setFieldValue('product_cost', selected ? selected.cost : '');
    setShowSummary(true);
  };

  const selectedProduct = products.find(p => p.id === formik.values.product);
  const totalCost = formik.values.product_cost && formik.values.quantity
    ? (parseFloat(formik.values.product_cost) * parseInt(formik.values.quantity)).toFixed(2)
    : '0.00';

  return (
    <div className="relative">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-black text-white p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" /> Product Entry Form
          </h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-8 space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" /> Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  onChange={formik.handleChange}
                  value={formik.values.customer_name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.customer_name && formik.errors.customer_name && (
                  <p className="text-red-500 text-sm">{formik.errors.customer_name}</p>
                )}
              </div>
              <div>
                <label className="font-medium">Customer ID</label>
                <input
                  type="text"
                  name="customer_id"
                  onChange={formik.handleChange}
                  value={formik.values.customer_id}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.customer_id && formik.errors.customer_id && (
                  <p className="text-red-500 text-sm">{formik.errors.customer_id}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="user_email"
                onChange={formik.handleChange}
                value={formik.values.user_email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {formik.touched.user_email && formik.errors.user_email && (
                <p className="text-red-500 text-sm">{formik.errors.user_email}</p>
              )}
            </div>
          </div>

          <div className="bg-neutral-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" /> Product Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Select Product</label>
                <select
                  name="product"
                  value={formik.values.product}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Choose a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ₹{product.cost}
                    </option>
                  ))}
                </select>
                {formik.touched.product && formik.errors.product && (
                  <p className="text-red-500 text-sm">{formik.errors.product}</p>
                )}
              </div>
              <div>
                <label className="font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  min={1}
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {formik.touched.quantity && formik.errors.quantity && (
                  <p className="text-red-500 text-sm">{formik.errors.quantity}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="font-medium">Unit Cost</label>
              <input
                type="number"
                name="product_cost"
                value={formik.values.product_cost}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {selectedProduct && showSummary && (
              <div className="relative mt-6 p-4 bg-white rounded-lg border border-indigo-200">
                <button
                  type="button"
                  onClick={() => setShowSummary(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  title="Hide Summary"
                >
                  <X className="w-4 h-4" />
                </button>
                <h4 className="font-semibold text-gray-800 mb-2">Order Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Product:</span>
                    <span className="font-medium">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit Price:</span>
                    <span>₹{formik.values.product_cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{formik.values.quantity}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span className="text-stone-900">₹{totalCost}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-8 py-3 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-black hover:scale-105'
                } text-white font-semibold rounded-lg transition-all duration-200 transform shadow-lg flex items-center gap-2`}
            >
              <ShoppingCart className="h-5 w-5" />
              {loading ? 'Submitting...' : 'Submit Order'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPage;