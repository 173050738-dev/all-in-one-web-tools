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
    const subject = encodeURIComponent(`[Contacto Korelyy] De ${name.trim()}`);
    const body = encodeURIComponent(
      `Nombre: ${name.trim()}\nCorreo: ${email.trim()}\n\n${message.trim()}\n\n— Enviado desde el formulario de Korelyy Tools`
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
      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2'>Contáctanos</h1>
      <p className='text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mb-4 sm:mb-5'>Ponte en contacto con el equipo de Korelyy</p>

      <div className='grid md:grid-cols-2 md:gap-4 sm:p-5 gap-3 sm:gap-4'>
        <div>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 mb-6 sm:mb-8'>
            <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>Publicidad</h2>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              Oportunidades publicitarias en nuestra plataforma global. Llega a más de 1000 usuarios con exposición de marca, contenido patrocinado y colaboraciones.
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
            <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>Soporte Técnico</h2>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4'>
              ¿Tienes problemas usando nuestras herramientas? ¿Necesitas ayuda técnica? Respondemos en menos de 24 horas.
            </p>
            <div className='flex items-center gap-2 flex-wrap'>
              <MessageSquare className='h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0' />
              <a
                href={`mailto:${RECIPIENT}?subject=${encodeURIComponent('[Soporte Korelyy]')}`}
                className='text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 min-h-[32px] inline-flex items-center touch-manipulation'
              >
                {RECIPIENT}
              </a>
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2.5 sm:mb-3'>Enviar Mensaje</h2>
          <form className='space-y-4' onSubmit={handleSubmit} noValidate>
            <div>
              <label className='block text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1' htmlFor='c-name'>Tu Nombre</label>
              <input
                id='c-name'
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm sm:text-base min-h-[40px]'
                placeholder='Introduce tu nombre'
              />
            </div>
            <div>
              <label className='block text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1' htmlFor='c-email'>Tu Email</label>
              <input
                id='c-email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm sm:text-base min-h-[40px]'
                placeholder='tu@ejemplo.com'
              />
            </div>
            <div>
              <label className='block text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1' htmlFor='c-msg'>Mensaje</label>
              <textarea
                id='c-msg'
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none text-sm sm:text-base'
                placeholder='Describe tu duda o comentario...'
              />
            </div>
            <button
              type='submit'
              className='w-full px-4 sm:px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px] touch-manipulation disabled:opacity-50'
              disabled={!name.trim() || !email.trim() || !message.trim()}
            >
              <Send className='h-3.5 w-3.5' />
              {submitted ? 'Abriendo Email...' : 'Enviar por Email'}
            </button>
            {submitted && (
              <p className='text-xs sm:text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5'>
                <CheckCircle2 className='h-4 w-4' />
                Tu cliente de correo debería abrirse. Si no, escríbenos directamente a {RECIPIENT}.
              </p>
            )}
            <p className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500'>
              Usa tu cliente de correo por defecto. Ningún dato se sube a servidores.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
