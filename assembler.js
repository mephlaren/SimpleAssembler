 registers = [];
 functions = [];
 JUMP_FLAG = 0;

 function createEval(instructionSet) {
     var tmpFunc = "";
     for (set in instructionSet) {
         if (set == 0) tmpFunc += `'${instructionSet[set]}'`;
         else tmpFunc += `,${ instructionSet[set]}`;
     }

     return tmpFunc;
 }

 function findRegister(reg) {
     for (i of registers) {
         if (i.register == reg) return i;
         else return null;
     }
 }

 function mov(reg, n) {
     reg1 = findRegister(reg);
     if (reg1) {
         reg1.value = n;
         functions.push({ func: 'mov', register: reg, value: n });
     } else {
         registers.push({ register: reg, value: 0 });
         console.log(registers);
         //mov(reg, n); this kills the callstack
     }
 }

 function inc(reg, n = 1) {
     findRegister(reg).value += n;
     functions.push({ func: 'inc', register: reg, value: n });
 }

 function dec(reg, n = 1) {
     findRegister(reg).value -= n;
     functions.push({ func: 'dec', register: reg, value: n });
 }

 function jnz(reg, offset) {
     /*jump if not zero. if the registers value is not zero, jump to the offsetted function, else continue*/
     reg1 = findRegister(reg);
     if (reg != 0) {
         if (offset >= 0) JUMP_FLAG = offset;
         else {
             var jumpToFuncs = functions[(functions.length) + offset];
             eval(`${jumpToFuncs.func}(\'${jumpToFuncs.register}\', ${jumpToFuncs.value}`);
         }
     }
 }


 function entry(program) {
     for (var instructions in program) {
         if (JUMP_FLAG == 0) {
             instruction = program[instructions].split(' ');
             funcs = instruction.slice(0, 1);
             args = instruction.slice(1);
             console.log(args);
             eval(`${ funcs }(${createEval(args)})`);
         } else { JUMP_FLAG--; }
     }
     return registers;
 }





 console.log(entry(['mov a 5', 'jnz a 1', 'inc a', 'mov b 2', 'inc b', 'dec a 2']));