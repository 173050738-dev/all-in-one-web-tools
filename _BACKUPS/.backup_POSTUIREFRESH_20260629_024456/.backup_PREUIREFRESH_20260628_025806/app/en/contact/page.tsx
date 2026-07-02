import { Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Contact Us</h1>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>Get in touch with us</p>

      <div className='grid md:grid-cols-2 gap-8'>
        <div>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Advertising</h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              We offer advertising opportunities on our platform. Contact us to discuss brand exposure, sponsored content, and partnership opportunities.
            </p>
            <div className='flex items-center gap-3 text-gray-600 dark:text-gray-400'>
              <Mail className='h-5 w-5 text-primary-600 dark:text-primary-400' />
              <span>173050738@qq.com</span>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Technical Support</h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Having trouble using our tools? Need technical assistance? We're here to help you anytime.
            </p>
            <div className='flex items-center gap-3 text-gray-600 dark:text-gray-400'>
              <MessageSquare className='h-5 w-5 text-primary-600 dark:text-primary-400' />
              <span>173050738@qq.com</span>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>Send Message</h2>
          <form className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Your Name</label>
              <input
                type='text'
                className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all'
                placeholder='Enter your name'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Your Email</label>
              <input
                type='email'
                className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all'
                placeholder='Enter your email'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Message</label>
              <textarea
                rows={4}
                className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none'
                placeholder='Enter your message...'
              />
            </div>
            <button
              type='submit'
              className='w-full px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2'
            >
              <Send className='h-4 w-4' />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}