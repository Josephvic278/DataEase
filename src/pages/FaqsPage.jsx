import React, { useState } from 'react';
import { createAuthAxios } from '@/api/authAxios';

const FaqsPage = () => {
  const authAxios = createAuthAxios()
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is our service about?",
      answer: "We provide data, airtime, cable subscription, electricity subscription, and education pins to make various services more accessible and affordable for students and other users.",
    },
    {
      question: "How do I purchase a package?",
      answer: "Select your vendor and package, enter necessary details, and proceed to checkout. Payment options will appear to complete your purchase.",
    },
    {
      question: "Can I get a refund?",
      answer: "Refunds are provided for specific cases. If you need one, reach out to our support with your purchase details.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept transfers to your virtual account, paystack, monnify and manual funding. If you come across any issues funding your account feel free to contact the customer service",
    },
    {
      question: "How can I contact customer support?",
      answer: "Our support team is available via the contact form on our site or at dataease247@gmail.com.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-semibold text-center text-vibrantGreen mb-10">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            onClick={() => toggleFAQ(index)}
            className="bg-gray-50 p-5 rounded-lg shadow-md cursor-pointer transition-all duration-300 border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">{faq.question}</h2>
              <span
                className={`p-2 rounded-full transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : 'rotate-0'
                }`}
                style={{
                  backgroundColor: '#32CD32', // Vibrant green
                  color: 'white',
                  height: '30px',
                  width: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                ▼
              </span>
            </div>
            <p
              className={`text-gray-600 mt-2 transition-all duration-300 overflow-hidden ${
                openIndex === index ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'
              }`}
              style={{ maxHeight: openIndex === index ? '200px' : '0px' }}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqsPage;
