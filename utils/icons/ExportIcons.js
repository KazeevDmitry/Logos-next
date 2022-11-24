import React from 'react';

// import Message from './Message.svg';

function ExportIcons() {
  const files = require.context('.', true, /[A-Za-z0-9-_,\s]+\.svg$/i);

  const exports = files.keys().reduce((acc, key) => {
    const [ name ] = key.match(/([A-Za-z0-9-_]+)/i) ?? [null];

    return {
      ...acc,
      ...(name
        ? {
            [name]: () => files(key),
          }
        : {}),
    };
  }, {});

  

  return exports;
}

export default ExportIcons();
