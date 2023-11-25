'use strict';

const generateId = async () => {
  try {
    const { customAlphabet } = await import('nanoid');
    const alphabet = '1234567890abcdefg';
    const length = 24;
    const nanoid = customAlphabet(alphabet, length);
    return nanoid(24);
  } catch (error) {
    console.log(error);
    throw new Error('Error generating ID');
  }
};

module.exports = generateId;
