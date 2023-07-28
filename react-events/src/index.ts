import { addEvent } from '@/event';

const button = document.querySelector('.btn');
addEvent(button, 'onClick', () => {
  console.log('myTest');
})

console.log('a')