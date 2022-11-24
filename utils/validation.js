// import locales from '../Locales';
import React from 'react';
import { useTranslation } from 'react-i18next';


export const PASS_MIN = 8;

//-------------------------------------
export default function Validation () {
//-------------------------------------

const { t } = useTranslation();

const regex = {
  digitsOnly: '(\\d{5})',
  digits: '(\\d.*)',
  letters: {
    lowercase: '([a-z].*)',
    uppercase: '([A-Z].*)',
  },
  symbols:
    // TODO: recheck
    '([`~\\!@#\\$%\\^\\&\\*\\(\\)\\-_\\=\\+\\[\\{\\}\\]\\\\|;:\\\'",<.>\\/\\?€£¥₹§±].*)',
};

const message = (message) => Promise.reject(new Error(t(message)));

const validation = {

  password: [
    {
      required: true,
      message: t('validation.required.password') // TODO: use `${label} is required`
    },
    {
      min: PASS_MIN,
      message: t('validation.min-chars')
    },
    {
      // Can be replaced with reqexp
      validator: async (_, value) =>
        // todo: recheck ..|| ''
        (value || '').indexOf(' ') < 0 ?
          Promise.resolve() :
          message('validation.no-spaces'),
    },
    {
      validator: async (_, value) =>
        // todo: check if Promise.resolve() is nessesary...
        new RegExp(regex.digits).test(value) ?
          Promise.resolve() :
          message('validation.digits'),
    },
    {
      validator: async (_, value) =>
        new RegExp(regex.letters.lowercase).test(value) ?
          Promise.resolve() :
          message('validation.lowercased'),
    },
    {
      validator: async (_, value) =>
        new RegExp(regex.letters.uppercase).test(value) ?
          Promise.resolve() :
          message('validation.uppercased'),
    },
    {
      validator: async (_, value) =>
        new RegExp(regex.symbols).test(value) ?
          Promise.resolve() :
          message('validation.special-chars'),
    },
  ],
  checkbox: [
    {
      required: true,
      message: 'Please, agree to continue',
    }
  ],
  smsCod: [
    {
      required: true,
      message: t('validation.required.smscode'),
    },
    {
      validator: async (_, value) =>
        new RegExp(regex.digitsOnly).test(value) ?
          Promise.resolve() :
          message('validation.digits-only'),
    },
  ],
};

return (validation)
}
