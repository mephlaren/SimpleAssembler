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

 function findRegister(reg, order = -1) {
     for (i of registers) {
         if (i.register == reg) return i;
     }

 }

 function mov(reg, n, REGISTERED = false, order = -1) {
     var isRegister = RegExp(/^\p{L}/, 'u').test(n);
     if (isRegister) {
         let reg1 = findRegister(reg);
         let reg2 = findRegister(n);

         if (reg1 && reg2) {
             reg1.value = reg2.value;
         } else {
             registers.push({ register: reg, value: 0 });
             if (!REGISTERED) mov(reg, n, true);
         }
     } else {
         let reg1 = findRegister(reg);
         if (reg1) {
             reg1.value = n;
         } else {
             registers.push({ register: reg, value: 0 });
             if (!REGISTERED) mov(reg, n, true);
         }
     }
 }


 function inc(reg, n = 1, order = -1) {
     findRegister(reg).value += n;
 }

 function dec(reg, n = 1, order = -1) {
     findRegister(reg).value -= n;
 }

 function jnz(reg, offset, order = -1) {

     let reg1 = findRegister(reg);
     let jumps = order - 1 + offset + 1;

     if (offset < 0) {
         if (reg1.value != 0) {
             while (offset < 0) {
                 functions.splice(order, 0, functions[jumps]);
                 jumps--;
                 offset++;
             }
         }
     }

 }


 function simple_assembler(program) {
     for (var instructions in program) {
         instruction = program[instructions].split(' ');
         funcs = instruction.slice(0, 1)[0];
         args = instruction.slice(1);
         functions.push({ order: functions.length + 1, func: funcs, register: args[0], value: args.length == 2 ? args[1] : 1 });
     }
     //return registers;
 }


 function entry(program) {

     return simple_assembler(program);
 }
 entry(["mov a 5", "inc a", "dec a", "dec a", "inc a 6", "jnz a -3", "mov b a", "dec b 2"]);

 for (i of functions) {
     eval(`${i.func}(${createEval(Array(i.register, i.value))},order=${i.order})`);

 }
 console.log(functions);