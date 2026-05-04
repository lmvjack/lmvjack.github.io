---
title: "Exception Handler Easy"
description: "Change Python exception table in order to redirect code execution"
pubDate: 2025-11-07
---

This challenge is from **Infobahn CTF 2025**, which I played with my team **Pwnissa**.
The challenge itself was pretty easy, but digging into Python bytecode was really cool. I'm writing this to share what I picked up along the way.


The provided material was a Python file and a Dockerfile. 

``` python
#!/usr/local/bin/python3 -u

import os

def run_chal():
	if 0x43 in range(0x21):
		print("GG!", flush=True)
		os.execv("/bin/sh", ["sh"])
	1 / 0

exc_table = bytes.fromhex(input("Exception Table > "))
run_chal.__code__ = run_chal.__code__.replace(co_exceptiontable=exc_table)

run_chal()
```
From the Dockerfile, we know the version of Python used to run this script.
``` 
FROM python:3.14.0-slim AS app
```
#### run_chal()
The code of `run_chal()` is very straightforward: when executed, the `if` checks whether the number`0x43` (`67` in decimal) is in `range(0x21)`, so in range `[0, 33)`. 
Clearly it is not, so the `if` body gets ignored and `1/0` gets immediately calculated, but this operation raises a `ZeroDivisionError`. Normally, since the exception is not handled, this would crash the program. But the challenge gives us the possibility to modify the Python Exception Table so that WE can tell the interpreter what to do when an exception is raised.
#### Python bytecode and the`__code__` object
The user written Python code, before actual execution, gets compiled in a simpler set of instruction called bytecode. This bytecode lives in the `__code__` object, divided in three parts: `co_code` that contains raw bytecode instructions, `co_consts` for the constants and `co_exceptiontable` to handle exceptions.
#### co_exceptiontable (Python 3.11+)
It's a lookup table used to store rules to handle errors. It tells the interpreter where to jump when an instruction raises. 
Each entry is made of four parts: 
- **start**: beginning of the region of code where this rule applies 
- **length**: the size of the region
- **target**: the instruction to jump to if en exception occurs
- **depth and lasti**: for stack management, not useful in this challenge.

> [!NOTE]
Python bytecode instructions are 2 bytes long. One instruction is called a **code unit**. The table thinks in code units, not in bytes.


The goal of the challenge is to make a rule that allows us to jump to the instruction that calls `os.execv` when `1/0` raises an exception. 

#### Exploring the bytecode
We need to know where the bytecode of the function to correctly calculate the custom entry.
We can do this by importing the `dis` library that provides the bytecode of a function.
```python
import dis
...
dis.dis(run_chal, show_offsets=True)
```
```
Output:
line    byte offset  name              instruction arguments index
  6          0       RESUME                   0

  7          2       LOAD_CONST               1 (67)
             4       LOAD_GLOBAL              1 (range + NULL)
            14       LOAD_CONST               2 (33)
            16       CALL                     1
            24       CONTAINS_OP              0
            28       POP_JUMP_IF_FALSE       34 (to L1)

  8         32       LOAD_GLOBAL              3 (print + NULL)
            42       LOAD_CONST               3 ('GG!')
            44       LOAD_CONST               4 (True)
            46       LOAD_CONST               5 (('flush',))
            48       CALL_KW                  2
            50       POP_TOP

  9         52       LOAD_GLOBAL              4 (os)
            62       LOAD_ATTR                6 (execv)
            82       PUSH_NULL
            84       LOAD_CONST               6 ('/bin/sh')
            86       LOAD_CONST               7 ('sh')
            88       BUILD_LIST               1
            90       CALL                     2
            98       POP_TOP

 11   L1:  100       LOAD_CONST               8 (1)
           102       LOAD_CONST               9 (0)
           104       BINARY_OP               11 (/)
           108       POP_TOP
           110       RETURN_CONST             0 (None)
```
Divide the byte offset by 2 to get the code unit.

Let's get the information we need:
- **start**: 0, because we want to cover the entire function.
- **length**: 56, the code unit after the last RETURN_CONST at 55 (110 byte offset), to cover the full function.
- **target**: 16, because we want to jump to `print("GG!", flush=True)` (byte offset 32)
- **depth and lasti**: 0, we don't need it in this challenge.
#### Encoding the custom rule
Now that we have all the data we need, we have to encode it in a special format, `varint` (variable-length integer), that is used to store numbers more efficiently. Numbers are stored in byte chunks, the number of chunks varies based on how big is the number. Each byte contains 6 bits of actual data, one bit (bit6) for a continuation flag (when a number needs more than 6 bits to be stored) and one bit (bit7) for a start flag (we set to `1` ONLY on the first byte of a new exception table entry).

- Small numbers (0-63): 1 byte
- Medium numbers (64-4095): 2 bytes
- Large numbers: 3+ bytes
```
Byte structure:
┌───┬───┬───────────────────┐
│ 7 │ 6 │  5  4  3  2  1  0 │
├───┼───┼───────────────────┤
│ ? │ ? │    6 bits data    │
└───┴───┴───────────────────┘
```
So let's encode in varint using hex:
- **start**: `0x00 | 0x80` (start flag) = `0x80`
- **length**: `0x38` 56 in hex
- **target**: `0x10` 16 in hex
- **depth and lasti**: `0x00`

Final answer: **80381000**.
{{ responsive_image(src="result.png", alt="Result image") }}
