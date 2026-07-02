import { Mail, MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>联系我们</h1>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-8'>在这里与我们取得联系</p>

      <div className='grid md:grid-cols-2 gap-8'>
        <div>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>广告合作</h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              我们提供中国站广告投放机会，欢迎品牌合作洽谈。我们提供品牌曝光、内容合作、赞助展示等多种合作方式。
            </p>
            <div className='flex items-center gap-3 text-gray-600 dark:text-gray-400'>
              <Mail className='h-5 w-5 text-primary-600 dark:text-primary-400' />
              <span>173050738@qq.com</span>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>技术支持</h2>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              在使用过程中遇到问题？需要技术协助？我们随时为您提供支持。
            </p>
            <div className='flex items-center gap-3 text-gray-600 dark:text-gray-400'>
              <MessageSquare className='h-5 w-5 text-primary-600 dark:text-primary-400' />
              <span>173050738@qq.com</span>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>发送消息</h2>
          <form className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>您的姓名</label>
              <input
                type='text'
                className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all'
                placeholder='请输入您的姓名'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>您的邮箱</label>
              <input
                type='email'
                className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all'
                placeholder='请输入您的邮箱'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>消息内容</label>
              <textarea
                rows={4}
                className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none'
                placeholder='请输入您的消息内容...'
              />
            </div>
            <button
              type='submit'
              className='w-full px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2'
            >
              <Send className='h-4 w-4' />
              发送消息
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}