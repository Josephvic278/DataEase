import React from 'react'
import 'boxicons/css/boxicons.min.css';
import { createAuthAxios } from '@/api/authAxios';
import authAxios from '@/api/authAxios';
const ContactPage = () => {
  const authAxios = createAuthAxios()
  const supportOptions = [
    {
      icon: 'bx bx-help-circle',
      title: 'FAQs',
      description: 'Find quick answers to our most commonly asked questions.',
      linkText: 'Visit FAQ',
      link: '/support/faqs',
    },
    {
      icon: 'bx bx-chat',
      title: 'Whatsapp',
      description: 'Chat with our support team via whatsapp on 09164661632 for immediate help.',
      linkText: 'Start Chat',
      link: 'https://wa.me/+2349164661632?text=Hi%20Dataease!!!',
    },
    {
      icon: 'bx bx-envelope',
      title: 'Email Support',
      description: 'Reach out to us via email for assistance on any issue.',
      linkText: 'Contact Us',
      link: 'mailto:support@example.com',
    },
    {
      icon: 'bx bx-book',
      title: 'Knowledge Base',
      description: 'Explore guides and articles to make the most of our services.',
      linkText: 'Learn More',
      link: '#knowledge-base',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-semibold text-center text-vibrantGreen mb-10">Support Center</h1>
      <p className="text-center text-gray-600 mb-8">
        Need help? Explore our support options below to find the assistance you need.
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {supportOptions.map((option, index) => (
          <a
            href={option.link}
            key={index}
            className="flex items-start p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
          >
            <div
              className="p-4 rounded-full bg-green-100 flex items-center h-10 justify-center text-vibrantGreen mr-4"
              style={{ minWidth: '50px', minHeight: '50px' }}
            >
              <i className={`${option.icon} text-3xl`}></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{option.title}</h2>
              <p className="text-gray-600 mt-1">{option.description}</p>
              <span className="text-vibrantGreen mt-2 inline-block font-medium">{option.linkText} &rarr;</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
export default ContactPage