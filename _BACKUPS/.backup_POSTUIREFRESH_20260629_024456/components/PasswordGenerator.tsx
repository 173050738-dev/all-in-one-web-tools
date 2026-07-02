'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

interface PasswordGeneratorProps {
  locale?: string;
}

export default function PasswordGenerator({ locale = 'zh' }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
    setCopied(false);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (includeUppercase && includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2) return { level: 'weak', label: locale === 'zh' ? '弱' : 'Weak', color: 'text-red-500', bg: 'bg-red-500', bgLight: 'bg-red-50 dark:bg-red-900/20' };
    if (score <= 4) return { level: 'medium', label: locale === 'zh' ? '中' : 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500', bgLight: 'bg-yellow-50 dark:bg-yellow-900/20' };
    return { level: 'strong', label: locale === 'zh' ? '强' : 'Strong', color: 'text-green-500', bg: 'bg-green-500', bgLight: 'bg-green-50 dark:bg-green-900/20' };
  };

  const strength = getStrength();
  const StrengthIcon = strength.level === 'weak' ? ShieldAlert : strength.level === 'medium' ? Shield : ShieldCheck;

  const t = {
    title: locale === 'zh' ? '密码生成器' : 'Password Generator',
    subtitle: locale === 'zh' ? '一键生成安全随机密码，本地生成，永不外泄' : 'Generate secure random passwords locally. Never leaves your device.',
    passwordLength: locale === 'zh' ? '密码长度' : 'Password Length',
    characters: locale === 'zh' ? '字符类型' : 'Character Types',
    uppercase: locale === 'zh' ? '大写字母 (A-Z)' : 'Uppercase (A-Z)',
    lowercase: locale === 'zh' ? '小写字母 (a-z)' : 'Lowercase (a-z)',
    numbers: locale === 'zh' ? '数字 (0-9)' : 'Numbers (0-9)',
    symbols: locale === 'zh' ? '特殊符号 (!@#...)' : 'Symbols (!@#...)',
    generate: locale === 'zh' ? '重新生成' : 'Regenerate',
    copy: locale === 'zh' ? '复制密码' : 'Copy',
    copied: locale === 'zh' ? '已复制' : 'Copied',
    strength: locale === 'zh' ? '密码强度' : 'Strength',
    tip: locale === 'zh' ? '💡 提示：建议使用16位以上包含大小写字母、数字和符号的密码，并定期更换。所有密码均在本地生成，不会上传到任何服务器。' : '💡 Tip: Use 16+ characters with a mix of letters, numbers, and symbols. All passwords are generated locally and never sent to any server.',
    selectAtLeastOne: locale === 'zh' ? '请至少选择一种字符类型' : 'Please select at least one character type',
    features: locale === 'zh' ? '功能特点' : 'Features',
    f1: locale === 'zh' ? '使用加密安全随机数生成' : 'Cryptographically secure random generation',
    f2: locale === 'zh' ? '可自定义长度和字符类型' : 'Customizable length & character types',
    f3: locale === 'zh' ? '实时密码强度评估' : 'Real-time strength assessment',
    f4: locale === 'zh' ? '一键复制到剪贴板' : 'One-click copy to clipboard',
    f5: locale === 'zh' ? '本地生成，100%隐私安全' : 'Local generation, 100% private',
    f6: locale === 'zh' ? '完全免费，无使用限制' : 'Completely free, no limits',
  };

  const noneSelected = !includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols;

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8'>
        <main className='lg:col-span-8'>
          <div className='card p-4 sm:p-6'>
            <div className='flex items-center gap-3 mb-4 sm:mb-6'>
              <div className='p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'>
                <Key className='h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div>
                <h1 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{t.subtitle}</p>
              </div>
            </div>

            <div className='space-y-4 sm:space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  {locale === 'zh' ? '生成的密码' : 'Generated Password'}
                </label>
                <div className='relative'>
                  <div className='flex items-center gap-2 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 min-h-[56px] sm:min-h-[64px]'>
                    <div className='flex-1 font-mono text-base sm:text-lg text-gray-900 dark:text-gray-100 break-all select-all'>
                      {password ? (
                        showPassword ? password : '•'.repeat(password.length)
                      ) : (
                        <span className='text-gray-400 text-sm font-normal'>{t.selectAtLeastOne}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className='p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0'
                      title={showPassword ? (locale === 'zh' ? '隐藏' : 'Hide') : (locale === 'zh' ? '显示' : 'Show')}
                    >
                      {showPassword ? <EyeOff className='h-4 w-4 sm:h-5 sm:w-5' /> : <Eye className='h-4 w-4 sm:h-5 sm:w-5' />}
                    </button>
                  </div>
                </div>

                {password && (
                  <div className={`mt-3 flex items-center gap-2 p-3 rounded-lg ${strength.bgLight}`}>
                    <StrengthIcon className={`h-5 w-5 ${strength.color} flex-shrink-0`} />
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className={`text-sm font-medium ${strength.color}`}>
                          {t.strength}: {strength.label}
                        </span>
                      </div>
                      <div className='flex gap-1'>
                        {[1, 2, 3, 4, 5, 6].map((i) => {
                          const thresholds = [2, 3, 3, 4, 5, 6];
                          const score = (length >= 8 ? 1 : 0) + (length >= 12 ? 1 : 0) + (length >= 16 ? 1 : 0) + 
                            (includeUppercase && includeLowercase ? 1 : 0) + (includeNumbers ? 1 : 0) + (includeSymbols ? 1 : 0);
                          return (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-colors ${
                                score >= i ? strength.bg : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between mb-2'>
                      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>{t.passwordLength}</label>
                      <span className='text-sm font-bold text-purple-600 dark:text-purple-400'>{length}</span>
                    </div>
                    <input
                      type='range'
                      min='4'
                      max='64'
                      step='1'
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500'
                    />
                    <div className='flex justify-between mt-1 text-xs text-gray-400'>
                      <span>4</span>
                      <span>32</span>
                      <span>64</span>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2'>{t.characters}</label>
                  {[
                    { key: 'upper', label: t.uppercase, checked: includeUppercase, onChange: setIncludeUppercase },
                    { key: 'lower', label: t.lowercase, checked: includeLowercase, onChange: setIncludeLowercase },
                    { key: 'number', label: t.numbers, checked: includeNumbers, onChange: setIncludeNumbers },
                    { key: 'symbol', label: t.symbols, checked: includeSymbols, onChange: setIncludeSymbols },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        item.checked
                          ? 'bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      } ${noneSelected && !item.checked ? 'opacity-50' : ''}`}
                    >
                      <input
                        type='checkbox'
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className='w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                      />
                      <span className='text-sm text-gray-700 dark:text-gray-300'>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <button
                  onClick={generatePassword}
                  disabled={noneSelected}
                  className='flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
                >
                  <RefreshCw className='h-4 w-4 sm:h-5 sm:w-5' />
                  {t.generate}
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!password}
                  className='flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-lg btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                >
                  {copied ? <Check className='h-4 w-4 sm:h-5 sm:w-5' /> : <Copy className='h-4 w-4 sm:h-5 sm:w-5' />}
                  {copied ? t.copied : t.copy}
                </button>
              </div>

              <div className='p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg'>
                <p className='text-xs sm:text-sm text-purple-700 dark:text-purple-300'>
                  {t.tip}
                </p>
              </div>
            </div>
          </div>
        </main>

        <aside className='lg:col-span-4'>
          <div className='card p-4 sm:p-6'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4'>{t.features}</h3>
            <ul className='space-y-3'>
              {[t.f1, t.f2, t.f3, t.f4, t.f5, t.f6].map((feature, i) => (
                <li key={i} className='flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  <span className='w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
