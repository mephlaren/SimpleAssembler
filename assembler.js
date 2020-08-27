 registers = [];
 functions = [];
 JUMP_FLAG = 0;

 function createEval(instructionSet) {
     var tmpFunc = "";
     for (set in instructionSet) {
         if (RegExp(/^\p{L}/, 'u').test(instructionSet[set]) == true) set == 1 ? tmpFunc += `,'${ instructionSet[set]}'` : tmpFunc += `'${ instructionSet[set]}'`;
         else tmpFunc += `,${ instructionSet[set]}`;
     }

     return tmpFunc;
 }

 function findRegister(reg) {
     for (i of registers) {
         if (i.register == reg) return i;
     }

 }

 function mov(reg, n, REGISTERED = false) {
     reg1 = null;
     reg2 = null;

     if (RegExp(/^\p{L}/, 'u').test(n)) {
         reg1 = findRegister(reg);
         reg2 = findRegister(n);

         if (reg1 && reg2) {
             reg1.value = reg2.value;
             functions.push({ func: 'mov', register: reg, value: reg2.value });
         } else {
             registers.push({ register: reg, value: 0 });
             if (!REGISTERED) mov(reg, n, true);
         }
     } else {
         if (reg1) {
             reg1.value = n;
             functions.push({ func: 'mov', register: reg, value: n });
         } else {
             registers.push({ register: reg, value: 0 });
             if (!REGISTERED) mov(reg, n, true);
         }
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
             console.log(functions);
         }
     }
 }


 function entry(program) {
     for (var instructions in program) {
         if (JUMP_FLAG == 0) {
             instruction = program[instructions].split(' ');
             funcs = instruction.slice(0, 1);
             args = instruction.slice(1);

             eval(`${ funcs }(${createEval(args)})`);
         } else { JUMP_FLAG--; }
     }
     //return registers;
 }


 function simple_assembler(program) {

     return entry(program);
 }
 simple_assembler(['mov a 5', 'mov b a', 'inc a', 'dec b']);

 console.log(registers);
 console.log(functions);