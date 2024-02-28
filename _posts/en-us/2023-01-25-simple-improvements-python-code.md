---
layout: post
title: Improving your python code with simple tricks
date: 2023-01-25 13:28:15
description: How to use functions from the default library to improve your code.
tags: programming code improvement python
categories: python
giscus_comments: true
related_posts: true
toc:
  sidebar: left
---

Sometimes our code is running slow. Sometimes it is eating up memory. Maybe it is just not as readable as we would like it to be. In this post, we will see how to use some functions from the default library to improve our code. All the code used in this post [is available here](https://gist.github.com/george-gca/bea9d8c23a0932a22d6b1b80006629f4). While I only presented a few functions that I use frequently, there are many more that can be used to improve your code. I encourage you to check the [official documentation](https://docs.python.org/3/library/) to see what else is available.

## Use [list comprehension](https://realpython.com/list-comprehension-python/) whenever possible

### What does it mean?

List comprehension is basically another way to create a list. Suppose we want to create a list from values in a range:

```python
# traditional way
tmp = []
for i in range(10_000_000):
  tmp.append(i)

# list comprehension
tmp = [i for i in range(10_000_000)]
```

### Why does it matter?

List comprehension is usually much faster than the traditional loop. Let's compare them:

```python
tmp = []
for i in range(10_000_000):
  tmp.append(i)
```

```txt
1.04 s ± 89.8 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 293.57 MiB
```

```python
tmp = [i for i in range(10_000_000)]
```

```txt
731 ms ± 71.6 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 285.82 MiB
```

### Other examples

#### Creating a list with an `if` condition

```python
tmp = []
for i in range(10_000_000):
  if i % 2 == 0:
    tmp.append(i)
```

```txt
1.11 s ± 24 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: -0.25 MiB
```

```python
tmp = [i for i in range(10_000_000) if i % 2 == 0]
```

```txt
944 ms ± 6.79 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 115.54 MiB
```

---

#### Creating a list with an `if else` condition

```python
tmp = []
for i in range(10_000_000):
  if i % 2 == 0:
    tmp.append(i)
  else:
    tmp.append(i+1)
```

```txt
1.61 s ± 90.5 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 32.89 MiB
```

```python
tmp = [i if i % 2 == 0 else i + 1 for i in range(10_000_000)]
```

```txt
1.33 s ± 11.4 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 273.82 MiB
```

### Fastest way to create a list

When generating a list from a generator (`range` in this case), it is even faster to use the `list()` constructor.

```python
tmp = list(range(10_000_000))
```

To validate this, let's compare the code for 7 runs, 10 loops each:

|                           |       loop       | list comprehension | list constructor |
| :-----------------------: | :--------------: | :----------------: | :--------------: |
| mean ± std. dev. per loop | 1.04 s ± 89.8 ms |  731 ms ± 71.6 ms  | 301 ms ± 18.4 ms |
|     memory increment      |    293.57 MiB    |     285.82 MiB     |    75.12 MiB     |

Why is the `list()` constructor faster? According to [this answer in StackOverflow](https://stackoverflow.com/a/29356931):

> The list comprehension executes the loop in Python bytecode, just like a regular for loop. The list() call iterates entirely in C code, which is far faster.

To compare all these solutions, lets check the equivalent bytecodes. For the loop solution:

```txt
1           0 BUILD_LIST               0
            2 STORE_NAME               0 (tmp)

2           4 LOAD_NAME                1 (range)
            6 LOAD_CONST               0 (10000000)
            8 CALL_FUNCTION            1
            10 GET_ITER
    >>   12 FOR_ITER                14 (to 28)
            14 STORE_NAME               2 (i)
            16 LOAD_NAME                0 (tmp)
            18 LOAD_METHOD              3 (append)
            20 LOAD_NAME                2 (i)
            22 CALL_METHOD              1
            24 POP_TOP
            26 JUMP_ABSOLUTE           12
    >>   28 LOAD_CONST               1 (None)
            30 RETURN_VALUE
```

For the list comprehension solution:

```txt
1           0 LOAD_CONST               0 (<code object <listcomp> at 0x7f272c8eaf50, file "<stdin>", line 1>)
            2 LOAD_CONST               1 ('<listcomp>')
            4 MAKE_FUNCTION            0
            6 LOAD_NAME                0 (range)
            8 LOAD_NAME                1 (10_000_000)
            10 CALL_FUNCTION            1
            12 GET_ITER
            14 CALL_FUNCTION            1
            16 POP_TOP
            18 LOAD_CONST               2 (None)
            20 RETURN_VALUE

Disassembly of <code object <listcomp> at 0x7f272c8eaf50, file "<stdin>", line 1>:
1           0 BUILD_LIST               0
            2 LOAD_FAST                0 (.0)
    >>    4 FOR_ITER                 8 (to 14)
            6 STORE_FAST               1 (i)
            8 LOAD_FAST                1 (i)
            10 LIST_APPEND              2
            12 JUMP_ABSOLUTE            4
    >>   14 RETURN_VALUE
```

And for the list constructor solution:

```txt
1           0 LOAD_NAME                0 (list)
            2 LOAD_NAME                1 (range)
            4 LOAD_NAME                2 (10_000_000)
            6 CALL_FUNCTION            1
            8 CALL_FUNCTION            1
            10 POP_TOP
            12 LOAD_CONST               0 (None)
            14 RETURN_VALUE
```

We can see that the `list()` constructor generates less bytecodes.

## Use [generators](https://realpython.com/introduction-to-python-generators/) and [iterators](https://docs.python.org/3/glossary.html#term-iterator) whenever possible

To create a generator like a list comprehension (called [generator expression](https://docs.python.org/3/glossary.html#index-20)), just replace the squared brackets [ ] with parenthesis ( ).

### Why does it matter?

[Generators](https://docs.python.org/3/glossary.html#index-19) looks like a normal function, except that it contains `yield` expressions for producing a series of values usable in a for-loop or that can be retrieved one at a time with the `next()` function. It returns a [generator iterator](https://docs.python.org/3/glossary.html#term-generator-iterator), which temporarily suspends processing, remembering the location execution state (including local variables and pending try-statements).

Let's do some comparisons:

```python
tmp = sum([i for i in range(10_000_000)])
```

```txt
860 ms ± 30.4 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

```python
tmp = sum((i for i in range(10_000_000)))
```

```txt
609 ms ± 2.93 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

Not that different right? Now, let's check the memory usage. Let's focus on increment, since it represents the difference in memory between the beginning and end of this execution.

```txt
memory increment: 263.44 MiB
```

```txt
memory increment: 0.00 MiB
```

What happened? The generator only returns one element at a time, which is given to the sum function. This way, we don't need to pre-generate the whole list to perform the sum of the elements. In fact, since the [sum](https://docs.python.org/3/library/functions.html#sum) function gets an iterator as parameter, we could call it like this:

```python
tmp = sum(i for i in range(10_000_000))
```

```txt
593 ms ± 90.4 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

Or even:

```python
tmp = sum(range(10_000_000))
```

```txt
168 ms ± 4.68 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.00 MiB
```

Which runs way faster.

## Avoid generating all the values whenever possible

For the sake of these examples, suppose we have an ordered list of values.

### What to do if we want only the values lower than a limit?

The list comprehension way of achieving this is this:

```python
tmp = [i for i in range(10_000_000) if i < 1_000_000]
```

```txt
596 ms ± 7.16 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.02 MiB
```

Now, with loops:

```python
tmp = []
for i in range(10_000_000):
  if i < 1_000_000:
    tmp.append(i)
  else:
    break
```

```txt
116 ms ± 2.37 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

Why is it faster with loops?

Because using list comprehension, the whole list must be generated before selecting the elements. The same is not true for the loop, that only runs through some of the values.

### Can we do better?

Yes, with [takewhile](https://docs.python.org/3/library/itertools.html#itertools.takewhile).

```python
from itertools import takewhile

tmp = list(takewhile(lambda x: x < 1_000_000, range(10_000_000)))
```

```txt
107 ms ± 2.37 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

---

Note: `takewhile` is only faster when you know that the condition will be satisfied "soon enough".

---

```python
tmp = []
for i in range(10_000_000):
  if i < 9_000_000:
    tmp.append(i)
  else:
    break
```

```txt
1.12 s ± 27.5 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 3.70 MiB
```

```python
tmp = [i for i in range(10_000_000) if i < 9_000_000]
```

```txt
1.05 s ± 51 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 246.21 MiB
```

```python
tmp = list(takewhile(lambda x: x < 9_000_000, range(10_000_000)))
```

```txt
1.06 s ± 8.41 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.00 MiB
```

In this case it is quicker to generate the whole list, and then filter it. But note, while using list comprehension is quicker, `takewhile` takes less memory, since it still doesn't need to store the whole list, even momentarily.

### What if we want only the values higher than a limit?

First, let's try with loops:

```python
tmp = []
for i in range(10_000_000):
  if i > 1_000_000:
    tmp.append(i)
```

```txt
1.3 s ± 93.3 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.15 MiB
```

Now, with list comprehension:

```python
tmp = [i for i in range(10_000_000) if i > 1_000_000]
```

```txt
978 ms ± 11.2 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 169.84 MiB
```

In this case, since the loop will run through every element, it is slower than the list comprehension. It takes less memory though, since it doesn't need to store the whole list in memory.

### Can we do better?

Yes, with [dropwhile](https://docs.python.org/3/library/itertools.html#itertools.dropwhile).

```python
from itertools import dropwhile

tmp = list(dropwhile(lambda x: x < 1_000_000, range(10_000_000)))
```

```txt
442 ms ± 10.2 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.05 MiB
```

---

Note: `dropwhile` also is only faster when you know that the condition will be satisfied "soon enough".

---

```python
tmp = []
for i in range(10_000_000):
  if i > 9_000_000:
    tmp.append(i)
```

```txt
654 ms ± 9.3 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.00 MiB
```

```python
tmp = [i for i in range(10_000_000) if i > 9_000_000]
```

```txt
623 ms ± 13.6 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

```python
tmp = list(dropwhile(lambda x: x < 9_000_000, range(10_000_000)))
```

```txt
924 ms ± 104 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

### What about when we want to get the first N samples?

With loops:

```python
tmp = []
for n, i in enumerate(range(10_000_000)):
  if n < 1_000_000:
    tmp.append(i)
  else:
    break
```

```txt
147 ms ± 3.09 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.00 MiB
```

Doing it with list comprehension:

```python
tmp = [i for i in range(10_000_000)][:1_000_000]
```

```txt
523 ms ± 10.8 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

Why is it faster with loops?

Because using list comprehension, the whole list must be generated before doing the slice operation. The same is not true for the loop, that only runs through some of the values.

### Can we do better?

Yes, with [islice](https://docs.python.org/3/library/itertools.html#itertools.islice).

```python
from itertools import islice

tmp = list(islice((i for i in range(10_000_000)), 1_000_000))
```

```txt
72.5 ms ± 1.82 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

### What about when we want to get the last N samples?

We can achieve the same result with `islice`. Let's get straight to the comparisons:

```python
tmp = []
for n, i in enumerate(range(10_000_000)):
  if n > 9_000_000:
    tmp.append(i)
```

```txt
1.44 s ± 95.3 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.00 MiB
```

```python
tmp = [i for i in range(10_000_000)][9_000_000:]
```

```txt
743 ms ± 8.52 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 177.31 MiB
```

```python
tmp = list(islice((i for i in range(10_000_000)), 9_000_000, None))
```

```txt
796 ms ± 11.8 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: -0.16 MiB
```

---

Note again that, as it happened with `dropwhile` when the condition takes longer to be satisfied, while using `islice` is slower than doing it with list comprehension, it takes much less memory.

### What if we just want to count the number of elements that will be generated?

Suppose we want to know how many elements will be generated from a condition. Usually, we would do it like this:

```python
tmp = [i for i in range(value) if i % 2 == 0]
count = len(tmp)
```

```txt
1.02 s ± 63.6 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
increment: 0.04 MiB
```

But the problem is, we are storing a whole list in memory only to get its length.

### Can we do better?

Yes, by creating a generator that generates `1` every time the condition is true, and summing it.

```python
count = sum(1 for i in range(value) if i % 2 == 0)
```

```txt
991 ms ± 18.9 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
increment: 0.00 MiB
```

## Other useful [itertools](https://docs.python.org/3/library/itertools.html?highlight=itertools#module-itertools) functions

We already introduced 3 of the most useful functions: `dropwhile`, `islice`, and `takewhile`. Let's check other useful functions.

### [cycle](https://docs.python.org/3/library/itertools.html?highlight=itertools#itertools.cycle)

Repeats indefinitely a given sequence.

```python
from itertools import cycle

tmp = []

for counter, i in enumerate(cycle(range(4))):
  if counter == 10:
    break

  tmp.append(i)

print(tmp)
```

```txt
[0, 1, 2, 3, 0, 1, 2, 3, 0, 1]
```

### [repeat](https://docs.python.org/3/library/itertools.html?highlight=itertools#itertools.repeat)

Repeats indefinitely a given value, unless the `times` argument is specified.

```python
from itertools import repeat

tmp = list(repeat(10, 5))
print(tmp)
```

```txt
[10, 10, 10, 10, 10]
```

### [product](https://docs.python.org/3/library/itertools.html?highlight=itertools#itertools.product)

Equivalent to a nested for-loop.

```python
tmp = []

for i in range(2):
  for j in range(2):
    for k in range(2):
      for l in range(2):
        tmp.append(sum([i, j, k, l]))

print(tmp)
```

```txt
[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]
```

```python
from itertools import product

tmp = [sum(i) for i in product(range(2), range(2), range(2), range(2))]
print(tmp)
```

```txt
[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]
```

Since in this case we are using the same sequence for all the loops, we can use `repeat` to simplify the code:

```python
from itertools import product

tmp = [sum(i) for i in product(range(2), repeat=4)]
print(tmp)
```

```txt
[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]
```

### [itertools](https://docs.python.org/3/library/itertools.html?highlight=itertools#module-itertools) has all the combinatorics functions implemented

| product | permutation | combination w/ replacement | combination |
| :-----: | :---------: | :------------------------: | :---------: |
|   AA    |             |             AA             |             |
|   AB    |     AB      |             AB             |     AB      |
|   AC    |     AC      |             AC             |     AC      |
|   AD    |     AD      |             AD             |     AD      |
|   BA    |     BA      |                            |             |
|   BB    |             |             BB             |             |
|   BC    |     BC      |             BC             |     BC      |
|   BD    |     BD      |             BD             |     BD      |
|   CA    |     CA      |                            |             |
|   CB    |     CB      |                            |             |
|   CC    |             |             CC             |             |
|   CD    |     CD      |             CD             |     CD      |
|   DA    |     DA      |                            |             |
|   DB    |     DB      |                            |             |
|   DC    |     DC      |                            |             |
|   DD    |             |             DD             |             |

## Improving code with [functools](https://docs.python.org/3/library/functools.html?highlight=functools#module-functools)

### Storing function calls with [lru_cache](https://docs.python.org/3/library/functools.html#functools.lru_cache)

Let's take the fibonacci function, for example, that calls itself recursively.

```python
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

Let's use it in a list comprehension to get the first 16 fibonacci numbers:

```python
tmp = [fib(i) for i in range(16)]
```

```txt
698 µs ± 152 µs per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

It takes a pretty good amount of time to execute for a small number. But what if we could automatically save the results of the previous calls to the function? That is what `lru_cache` is all about. It stores previous calls, with its given parameters and calculated output, as a least recent used (LRU) cache. This way, whenever we call the function and this call was already made (and its results are still stored in the cache), we simply get the results from the cache.

```python
from functools import lru_cache

@lru_cache
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

Let's try that line again:

```python
tmp = [fib(i) for i in range(16)]
```

```txt
3.34 µs ± 719 ns per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

Now, let's check the cache information:

- hits: number of times the function was called and the results were already there;
- misses: number of times the function was called and the results were not there;
- maxsize: current maximum allowed size of the cache;
- currsize: actual size of the cache (stored results).

```python
print(fib.cache_info())
```

```txt
CacheInfo(hits=1132, misses=16, maxsize=128, currsize=16)
```

### Creating functions with defaults from [partial](https://docs.python.org/3/library/functools.html#functools.partial)

Suppose we have a function, called `divide_by`. It is a pretty generic function, but it is usually called with some specific values, like dividing by two, or by three.

```python
def divide_by(x, y):
  return x / y

print(divide_by(12, 2))
print(divide_by(12, 3))
```

```txt
6.0
4.0
```

What if, instead of creating an entire new function, we could only create different signatures for the function, one for each common y value? That is what `partial` is for:

```python
from functools import partial

divide_by_two = partial(divide_by, y=2)
divide_by_three = partial(divide_by, y=3)

print(divide_by_two(12))
print(divide_by_three(12))
```

```txt
6.0
4.0
```
