import { message } from './myModule';
import myAddFunction, { subtract} from './math';

console.log(message);
console.log(`sum: 3 + 5 = ${myAddFunction(3,5)}`);
console.log(`substract: 3 + 5 = ${subtract(3,5)}`);