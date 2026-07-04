'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Copy } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const RECIPIENT = '173050738@qq.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    const subject = encodeURIComponent(`[Korelyy 联系表单] 来自 ${name.trim()}`);
    const body = encodeURIComponent(
      `姓名：${name.trim()}\n邮箱：${email.trim()}\n\n${message.trim()}\n\n—— 来自 Korelyy 工具站联系表单`
    );
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(RECIPIENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2'>联系我们</h1>
      <p className='text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5'>与 Korelyy 团队取得联系</p>

      <div className='grid md:grid-cols-2 md:gap-4 sm:p-5 gap-3 sm:gap-4'>
        <div>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 mb-6 sm:mb-8'>
            <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>广告合作</h2>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              全球工具站广告投放机会，覆盖千款工具用户。欢迎洽谈品牌曝光、内容合作、赞助展示等多种合作方式。
            </p>
            <div className='flex items-center gap-2 flex-wrap'>
              <Mail className='h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0' />
              <button
                type='button'
                onClick={copyEmail}
                className='text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1 min-h-[32px] touch-manipulation'
              >
                {RECIPIENT}
                <Copy className='h-3.5 w-3.5 opacity-60' />
              </button>
              {copied && <CheckCircle2 className='h-4 w-4 text-green-500' />}
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5'>
            <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>技术支持</h2>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              遇到使用问题？需要技术协助？我们 24 小时内回复每一封来信。
            </p>
            <div className='flex items-center gap-2 flex-wrap'>
              <MessageSquare className='h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0' />
              <a
                href={`mailto:${RECIPIENT}?subject=${encodeURIComponent('[Korelyy 技术支持工单]')}`}
                className='text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 min-h-[32px] inline-flex items-center touch-manipulation'
              >
                {RECIPIENT}
              </a>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>发送消息</h2>
          <form className='space-y-4' onSubmit={handleSubmit} noValidate>
            <div>
              <label className='block text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1' htmlFor='c-name'>您的姓名</label>
              <input
                id='c-name'
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm sm:text-base min-h-[40px]'
                placeholder='请输入您的姓名'
              />
            </div>
            <div>
              <label className='block text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1' htmlFor='c-email'>您的邮箱</label>
              <input
                id='c-email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm sm:text-base min-h-[40px]'
                placeholder='you@example.com'
              />
            </div>
            <div>
              <label className='block text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1' htmlFor='c-msg'>消息内容</label>
              <textarea
                id='c-msg'
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none text-sm sm:text-base'
                placeholder='请描述您的问题或反馈...'
              />
            </div>
            <button
              type='submit'
              className='w-full px-4 sm:px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50'
              disabled={!name.trim() || !email.trim() || !message.trim()}
            >
              <Send className='h-3.5 w-3.5' />
              {submitted ? '正在打开邮件客户端...' : '通过邮件发送'}
            </button>
            {submitted && (
              <p className='text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5'>
                <CheckCircle2 className='h-4 w-4' />
                系统已自动打开您的邮件客户端。如无反应，请直接发邮件至 {RECIPIENT}。
              </p>
            )}
            <p className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500'>
              提交后调用系统默认邮件客户端，不会上传任何数据到服务器。
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
