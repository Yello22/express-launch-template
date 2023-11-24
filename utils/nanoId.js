'use-strict';

const generateId = () => {
  import('nanoid')
    .then(({ customAlphabet }) => {
      const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
      const length = 12;

      const nanoid = customAlphabet(alphabet, length);

      return nanoid();
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = generateId;
