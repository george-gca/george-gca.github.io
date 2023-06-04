---
layout: post
title:  What is faster when searching? Regex or Python string?
date:   2023-03-20 21:13:11
description: Comparing the search performance of regex and Python string methods.
tags: programming code improvement python
categories: python
giscus_comments: true
related_posts: true
---

In this post we will investigate the performance of regex and Python string methods. More specifically, we will compare different forms of searching for a substring in a given string. We will test it with a variety of strings and substrings sizes and positions, and also when the substring can't be found. Later, we will also test the performance of the same operations when searching for a large number of substrings of varied sizes and positions. The code for all these experiments is [available here](https://gist.github.com/george-gca/29cc3af8e1fa5061c6246eefa3476bd1).

## Experiments config

To generate the string I created a function that cycles through all the lowercase letters of the alphabet and returns a string of the desired length. This way we can test the performance of the search in a string of a given size.

```python
def get_string(length):
  return  ''.join(c for c in islice(cycle(ascii_lowercase), length))
```

To generate the substrings, I simply selected a slice of the string in the desired position and size. To use substrings that could not be found in the string, I simply reversed the substrings. Since they are generated in alphabetical order, this is the best way to ensure that it will not be found.

For all the runs I decided to let the `timeit` function decide the number of loops to run, and it ran 7 times to get the average and standard deviation. Basically, 10 experiments were made for each case, being 3 using regexes and the rest pure python string methods. The experiments were made for the following cases:

- substring `sub` exists in the beginning of the string
  - using `rf'^{sub}'` regex
  - using python `startswith` string method
  - slicing the beginning of the string with the same size as `sub` then using `==` operator
  - slicing the beginning of the string with the same size as `sub` then using `startswith`
- substring `sub` exists in the middle of the string
  - using `rf'{sub}'` regex
  - using python `in` operator
- substring `sub` exists in the end of the string
  - using `rf'{sub}$'` regex
  - using python `endswith` string method
  - slicing the end of the string with the same size as `sub` then using `==` operator
  - slicing the end of the string with the same size as `sub` then using `endswith`

All the columns in the tables that have `(-i)` in the name are the same as the ones without it, but the search is case insensitive. Every run that has an asterisk `*` in it means that the slowest run took way longer than the fastest. This could mean that an intermediate result is being cached.

## Small string

For searching in a small string, we used a string of size 30 with substrings with size 10.

<!-- <table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/small_str_small_sub.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="Method" data-sortable="true">Method</th>
      <th data-field="Exists" data-sortable="true">Substring exists</th>
      <th data-field="Doesn't exist" data-sortable="true">Substring doesnt't exist</th>
      <th data-field="Exists (-i)" data-sortable="true">Substring exists (-i)</th>
      <th data-field="Doesn't exist (-i)" data-sortable="true">Substring doesnt't exist (-i)</th>
    </tr>
  </thead>
</table> -->

<!-- <table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/small_str_small_sub.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="case" rowspan="2" data-valign="middle">Case</th>
      <th colspan="4" data-halign="center">Search in the beginning</th>
      <th colspan="2" data-halign="center">Search everywhere</th>
      <th colspan="4" data-halign="center">Search in the ending</th>
    </tr>
    <tr>
      <th data-field="regex^">Regex (^)</th>
      <th data-field="startswith">startswith</th>
      <th data-field="slice==start">slice then ==</th>
      <th data-field="slice_startswith">slice then startswith</th>
      <th data-field="regex">Regex</th>
      <th data-field="in">in</th>
      <th data-field="regex$">Regex ($)</th>
      <th data-field="endswith">endswith</th>
      <th data-field="slice==end">slice then ==</th>
      <th data-field="slice_endswith">slice then endswith</th>
    </tr>
  </thead>
</table> -->

<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/one_substring_beginning.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="4" data-halign="center">Search in the beginning</th>
    </tr>
    <tr>
      <th data-field="regex">Regex (^)</th>
      <th data-field="startswith">startswith</th>
      <th data-field="slice then ==">slice then ==</th>
      <th data-field="slice then startswith">slice then startswith</th>
    </tr>
  </thead>
</table>


<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/small_str_small_sub.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="2" data-halign="center">Search everywhere</th>
    </tr>
    <tr>
      <th data-field="regex">Regex</th>
      <th data-field="in">in</th>
    </tr>
  </thead>
</table>


<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/small_str_small_sub.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="4" data-halign="center">Search in the ending</th>
    </tr>
    <tr>
      <th data-field="regex">Regex ($)</th>
      <th data-field="endswith">endswith</th>
      <th data-field="slice then ==">slice then ==</th>
      <th data-field="slice then endswith">slice then endswith</th>
    </tr>
  </thead>
</table>

<!-- https://csvjson.com/csv2json -->

<!-- | Using                 | Substring exists | Substring doesn't exist | Substring exists (-i) | Substring doesn't exist (-i)  |
|:---------------------:|:----------------:|:-----------------------:|:---------------------:|:-----------------------------:|
|         regex         | 623 ns ± 108 ns  | 970 ns ± 85.2 ns      | 735 ns ± 18.6 ns        | 1.16 us ± 358 ns              |
|       startswith      | 558 ns ± 185 ns  | 260 ns ± 10.3 ns      | 414 ns ± 22 ns          | 409 ns ± 28.9 ns              |
|     slice then ==     | 655 ns ± 188 ns  | 663 ns ± 222 ns       | 757 ns ± 247 ns         | 571 ns ± 31.7 ns              |
| slice then startswith | 877 ns ± 210 ns  | 543 ns ± 22.2 ns      | 683 ns ± 13.8 ns        | 544 ns ± 358 ns<mark>*</mark> |
|         regex         | 425 ns ± 34.8 ns | 374 ns ± 15 ns        | 1.15 us ± 330 ns        | 558 ns ± 16.6 ns              |
|    string in phrase   | 216 ns ± 16.1 ns | 181 ns ± 41.6 ns      | 341 ns ± 6.17 ns        | 166 ns ± 42.2 ns              |
|         regex         | 690 ns ± 96.3 ns | 536 ns ± 161 ns       | 1.38 us ± 366 ns        | 743 ns ± 239 ns               |
|        endswith       | 431 ns ± 144 ns  | 283 ns ± 8.99 ns      | 452 ns ± 21.8 ns        | 214 ns ± 9.54 ns              |
|     slice then ==     | 476 ns ± 26.2 ns | 472 ns ± 13.5 ns      | 811 ns ± 222 ns         | 286 ns ± 10.9 ns              |
|  slice then endswith  | 671 ns ± 84.6 ns | 724 ns ± 238 ns       | 774 ns ± 24.8 ns        | 371 ns ± 9.19 ns              |

- <mark>*</mark> The slowest run took 4.33 times longer than the fastest.

## Large String, Small Substrings

| Using                 | Substring exists  | Substring doesn't exist | Substring exists (-i) | Substring doesn't exist (-i)  |
|:---------------------:|:-----------------:|:-----------------------:|:---------------------:|:-----------------------------:|
|         regex         | 325 ns ± 47.1 ns  | 101 us ± 22.9 us        | 373 ns ± 7.21 ns      | 95.2 us ± 3.72 us             |
|       startswith      | 292 ns ± 17.7 ns  | 151 ns ± 38 ns          | 6.43 us ± 78.2 ns     | 7.96 us ± 1.78 us             |
|     slice then ==     | 213 ns ± 14.9 ns  | 219 ns ± 37 ns          | 386 ns ± 164 ns       | 266 ns ± 10.9 ns              |
| slice then startswith | 284 ns ± 12 ns    | 487 ns ± 132 ns         | 364 ns ± 74.8 ns      | 334 ns ± 10.2 ns              |
|         regex         | 218 ns ± 48 ns    | 9.24 us ± 130 ns        | 385 ns ± 9.6 ns       | 146 us ± 30.5 us              |
|    string in phrase   | 113 ns ± 31.3 ns  | 5.04 us ± 1.75 us       | 6.57 us ± 825 ns      | 11.8 us ± 2.79 us             |
|         regex         | 15.9 us ± 3.58 us | 9.31 us ± 88 ns         | 261 us ± 4.32 us      | 139 us ± 30.8 us              |
|        endswith       | 171 ns ± 32.6 ns  | 167 ns ± 52.9 ns        | 6.49 us ± 200 ns      | 6.36 us ± 131 ns              |
|     slice then ==     | 222 ns ± 11.3 ns  | 224 ns ± 5.29 ns        | 296 ns ± 45.6 ns      | 284 ns ± 8.99 ns              |
|  slice then endswith  | 311 ns ± 8.88 ns  | 532 ns ± 175 ns         | 485 ns ± 198 ns       | 369 ns ± 13.6 ns              |

## Large String, Large Substring

### Substring exists

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   27 us ± 1.09 us  |
|       startswith      |   251 ns ± 64.8 ns |
|     slice then ==     |   451 ns ± 10.5 ns |
| slice then startswith |   522 ns ± 8.47 ns |
|         regex         | 10.9 us ± 3.21 us |
|    string in phrase   |  15 us ± 3.02 us  |
|         regex         | 20.8 us ± 3.38 us |
|        endswith       |   469 ns ± 18.7 ns |
|     slice then ==     |   527 ns ± 100 ns  |
|  slice then endswith  |    594 ns ± 18 ns  |

### Substring does not exist

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   65.2 us ± 18 us  |
|       startswith      |  141 ns ± 30.9 ns  |
|     slice then ==     |   352 ns ± 67.4 ns |
| slice then startswith |   403 ns ± 19.7 ns |
|         regex         | 14.2 us ± 3.05 us |
|    string in phrase   |  5.84 us ± 236 ns |
|         regex         |  14.3 us ± 3.9 us |
|        endswith       |  168 ns ± 39.2 ns  |
|     slice then ==     |   448 ns ± 167 ns  |
|  slice then endswith  |   470 ns ± 96.7 ns |

### Substring exists (ignoring case)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   36 us ± 931 ns   |
|       startswith      | 7.74 us ± 1.87 us |
|     slice then ==     |  3.78 us ± 131 ns |
| slice then startswith |  3.9 us ± 137 ns  |
|         regex         |  35.9 us ± 528 ns  |
|    string in phrase   |  22 us ± 3.13 us  |
|         regex         |  6.92 ms ± 77.4 us |
|        endswith       | 8.33 us ± 1.85 us |
|     slice then ==     | 3.74 us ± 61.6 ns |
|  slice then endswith  |  3.95 us ± 194 ns |

### Substring does not exist (ignoring case)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  54.6 us ± 16.1 us |
|       startswith      |  6.53 us ± 284 ns |
|     slice then ==     |  3.6 us ± 73.5 ns |
| slice then startswith |  4.05 us ± 854 ns |
|         regex         |  70.3 us ± 15.5 us |
|    string in phrase   |  14 us ± 3.35 us  |
|         regex         |  63.6 us ± 2.19 us |
|        endswith       | 7.99 us ± 1.85 us |
|     slice then ==     | 3.72 us ± 51.7 ns |
|  slice then endswith  |  3.79 us ± 144 ns |

## Passing a List of Substrings

### Small String

#### Few Possibilities

##### Substring found (1st one)

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         |  318 ns ± 8.25 ns |
|       startswith      |  300 ns ± 7.59 ns |
|     slice then ==     |  200 ns ± 6.01 ns |
| slice then startswith |  277 ns ± 11.7 ns |
|         regex         |  403 ns ± 12.8 ns |
|    string in phrase   |  601 ns ± 210 ns |
|         regex         |  617 ns ± 9.18 ns |
|        endswith       | 172 ns ± 35.3 ns |
|     slice then ==     |  213 ns ± 6.02 ns |
|  slice then endswith  |  296 ns ± 6.78 ns |

##### Substring found (middle)

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         |  538 ns ± 172 ns |
|       startswith      | 168 ns ± 42.3 ns |
|     slice then ==     |  197 ns ± 5.07 ns |
| slice then startswith |   284 ns ± 17 ns |
|         regex         |  448 ns ± 10.1 ns |
|    string in phrase   |  776 ns ± 263 ns |
|         regex         |  632 ns ± 9.76 ns |
|        endswith       | 180 ns ± 36.5 ns |
|     slice then ==     |  290 ns ± 103 ns |
|  slice then endswith  |  401 ns ± 159 ns |

##### Substring found (last one)

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         |  322 ns ± 9.25 ns |
|       startswith      | 179 ns ± 34.9 ns |
|     slice then ==     | 224 ns ± 53.6 ns |
| slice then startswith |  377 ns ± 154 ns |
|         regex         |  435 ns ± 10.9 ns |
|    string in phrase   |  651 ns ± 23.1 ns |
|         regex         |  724 ns ± 227 ns |
|        endswith       |  188 ns ± 34 ns  |
|     slice then ==     |  213 ns ± 6.54 ns |
|  slice then endswith  |  323 ns ± 63.3 ns |

##### Substrings not found

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         |  583 ns ± 181 ns |
|       startswith      | 172 ns ± 35.8 ns |
|     slice then ==     |  205 ns ± 5.67 ns |
| slice then startswith |  282 ns ± 8.8 ns |
|         regex         |  853 ns ± 278 ns |
|    string in phrase   |  558 ns ± 9.59 ns |
|         regex         |  882 ns ± 293 ns |
|        endswith       | 182 ns ± 51.7 ns |
|     slice then ==     |  217 ns ± 9.72 ns |
|  slice then endswith  |   310 ns ± 14 ns |

##### Substring found ignoring case (1st one)

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         |  387 ns ± 16.5 ns |
|       startswith      | 225 ns ± 38.9 ns |
|     slice then ==     |  258 ns ± 7.83 ns |
| slice then startswith |  336 ns ± 9.42 ns |
|         regex         |  1.09 us ± 325 ns |
|    string in phrase   |  616 ns ± 13.3 ns |
|         regex         |  1.85 us ± 350 ns |
|        endswith       |  310 ns ± 110 ns |
|     slice then ==     |  278 ns ± 20.7 ns |
|  slice then endswith  |  366 ns ± 7.3 ns |

##### Substring found ignoring case (middle)

|         Using         |                       Result                       |
|:---------------------:|:--------------------------:|
|         regex         | 408 ns ± 15.2 ns |
|       startswith      | 440 ns ± 75.2 ns |
|     slice then ==     | 262 ns ± 8.43 ns |
| slice then startswith | 341 ns ± 12.6 ns |
|         regex         | 1.15 us ± 316 ns |
|    string in phrase   | 700 ns ± 12.4 ns |
|         regex         | 1.9 us ± 391 ns |
|        endswith       | 374 ns ± 123 ns |
|     slice then ==     | 297 ns ± 61.4 ns |
|  slice then endswith  | 377 ns ± 20.6 ns |

##### Substring found ignoring case (last one)

|         Using         |                       Result                       |
|:---------------------:|:--------------------------:|
|         regex         | 403 ns ± 8.77 ns |
|       startswith      | 232 ns ± 19.8 ns |
|     slice then ==     | 449 ns ± 172 ns |
| slice then startswith | 339 ns ± 21.3 ns |
|         regex         | 1.17 us ± 306 ns |
|    string in phrase   |  769 ns ± 12 ns |
|         regex         | 1.88 us ± 500 ns |
|        endswith       | 296 ns ± 112 ns |
|     slice then ==     | 371 ns ± 151 ns |
|  slice then endswith  | 373 ns ± 9.74 ns |

##### Substrings not found ignoring case

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         |  491 ns ± 16.7 ns |
|       startswith      |  255 ns ± 74.8 ns |
|     slice then ==     |  390 ns ± 158 ns |
| slice then startswith |   339 ns ± 13 ns |
|         regex         |  1.91 us ± 596 ns |
|    string in phrase   |  734 ns ± 32.4 ns |
|         regex         | 3.5 us ± 119 ns |
|        endswith       |   232 ns ± 15 ns |
|     slice then ==     |  269 ns ± 6.84 ns |
|  slice then endswith  |  366 ns ± 12.8 ns |

### Large String

#### Small Substring, Few Possibilities

##### Substring found (1st one)

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         |  314 ns ± 10.8 ns |
|       startswith      | 141 ns ± 6.87 ns |
|     slice then ==     |  404 ns ± 96.4 ns |
| slice then startswith |  271 ns ± 9.21 ns |
|         regex         |  351 ns ± 10.8 ns |
|    string in phrase   |   457 ns ± 11 ns |
|         regex         |  569 us ± 139 us  |
|        endswith       | 174 ns ± 37.5 ns |
|     slice then ==     |  220 ns ± 8.66 ns |
|  slice then endswith  |  310 ns ± 9.56 ns |

##### Substring found (middle)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   331 ns ± 9.68 ns |
|       startswith      |  173 ns ± 51.1 ns  |
|     slice then ==     |  221 ns ± 53.9 ns  |
| slice then startswith |   279 ns ± 8.54 ns |
|         regex         |   353 ns ± 16.1 ns |
|    string in phrase   | 5.87 us ± 2.11 us |
|         regex         |   391 us ± 31.6 us  |
|        endswith       |  180 ns ± 34.2 ns  |
|     slice then ==     |   223 ns ± 7.2 ns  |
|  slice then endswith  |   320 ns ± 5.84 ns |

##### Substring found (last one)

|         Using         |                        Result                        |
|:---------------------:|:----------------------------------------------------:|
|         regex         |  549 ns ± 169 ns  |
|                       |                                                      |
|       startswith      |  221 ns ± 9.91 ns |
|                       |                                                      |
|     slice then ==     | 219 ns ± 56.4 ns  |
|                       |                                                      |
| slice then startswith |  357 ns ± 12.9 ns |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |  590 ns ± 178 ns  |
|                       |                                                      |
|    string in phrase   | 35.6 us ± 1.13 us |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |  385 us ± 9.15 us  |
|                       |                                                      |
|        endswith       |  240 ns ± 6.67 ns |
|                       |                                                      |
|     slice then ==     |  368 ns ± 125 ns  |
|                       |                                                      |
|  slice then endswith  |  412 ns ± 21.7 ns |
|                       |                                                      |

##### Substrings not found

|         Using         |                        Result                        |
|:---------------------:|:----------------------------------------------------:|
|         regex         | 89.1 us ± 2.04 us |
|                       |                                                      |
|       startswith      |  394 ns ± 81.5 ns |
|                       |                                                      |
|     slice then ==     | 216 ns ± 43.3 ns  |
|                       |                                                      |
| slice then startswith |   348 ns ± 12 ns  |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |  236 us ± 13.9 us  |
|                       |                                                      |
|    string in phrase   |  58.8 us ± 19 us  |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |  377 us ± 7.45 us  |
|                       |                                                      |
|        endswith       |  233 ns ± 14.4 ns |
|                       |                                                      |
|     slice then ==     |  220 ns ± 7.68 ns |
|                       |                                                      |
|  slice then endswith  |  578 ns ± 217 ns  |
|                       |                                                      |

##### Substring found ignoring case (1st one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   390 ns ± 10.8 ns |
|       startswith      | 6.46 us ± 94.7 ns |
|     slice then ==     |   343 ns ± 132 ns  |
| slice then startswith |   418 ns ± 146 ns  |
|         regex         |   818 ns ± 7.24 ns |
|    string in phrase   | 8.53 us ± 2.13 us |
|         regex         |   1.84 ms ± 363 us  |
|        endswith       |  6.36 us ± 134 ns |
|     slice then ==     |   491 ns ± 183 ns  |
|  slice then endswith  |   370 ns ± 7.22 ns |

##### Substring found ignoring case (middle)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   400 ns ± 8.86 ns |
|       startswith      | 8.02 us ± 1.85 us |
|     slice then ==     |   269 ns ± 12.9 ns |
| slice then startswith |   359 ns ± 17.3 ns |
|         regex         |   1.06 us ± 309 ns |
|    string in phrase   | 11.6 us ± 1.31 us |
|         regex         |  2.78 ms ± 552 us |
|        endswith       |  6.39 us ± 140 ns |
|     slice then ==     |    283 ns ± 10 ns  |
|  slice then endswith  |   547 ns ± 218 ns  |

##### Substring found ignoring case (last one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   511 ns ± 11.3 ns |
|       startswith      |  6.41 us ± 102 ns |
|     slice then ==     |   468 ns ± 159 ns  |
| slice then startswith |   410 ns ± 7.2 ns  |
|         regex         |   1.1 us ± 328 ns  |
|    string in phrase   |  42.3 us ± 1.49 us |
|         regex         |   1.85 ms ± 441 us  |
|        endswith       | 6.95 us ± 1.14 us |
|     slice then ==     |   388 ns ± 167 ns  |
|  slice then endswith  |   461 ns ± 12.5 ns |

##### Substrings not found ignoring case

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  108 us ± 30.6 us  |
|       startswith      | 6.41 us ± 99.7 ns |
|     slice then ==     |   260 ns ± 14.2 ns |
| slice then startswith |   628 ns ± 232 ns  |
|         regex         |   1.78 ms ± 377 us  |
|    string in phrase   |  45.4 us ± 806 ns  |
|         regex         |   1.83 ms ± 310 us  |
|        endswith       | 8.08 us ± 1.94 us |
|     slice then ==     |   287 ns ± 9.69 ns |
|  slice then endswith  |   448 ns ± 11.3 ns |

#### Small Substring, Many Possibilities

##### Substring found (1st one)

|         Using         |                        Result                        |
|:---------------------:|:----------------------------------------------------:|
|         regex         |  391 ns ± 130 ns  |
|                       |                                                      |
|       startswith      |  249 ns ± 65.5 ns |
|                       |                                                      |
|     slice then ==     |  367 ns ± 15.7 ns |
|                       |                                                      |
| slice then startswith |  508 ns ± 9.49 ns |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         | 87.4 us ± 6.46 us |
|                       |                                                      |
|    string in phrase   |  463 ns ± 15.8 ns |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |   317 ms ± 6.98 ms (7 runs, 1 loop each)   |
|                       |                                                      |
|        endswith       | 170 ns ± 48.4 ns  |
|                       |                                                      |
|     slice then ==     |  627 ns ± 185 ns  |
|                       |                                                      |
|  slice then endswith  |  534 ns ± 5.99 ns |
|                       |                                                      |

##### Substring found (middle)

|         Using         |                        Result                        |
|:---------------------:|:----------------------------------------------------:|
|         regex         |  319 ns ± 7.43 ns |
|                       |                                                      |
|       startswith      | 162 ns ± 34.7 ns  |
|                       |                                                      |
|     slice then ==     |  563 ns ± 178 ns  |
|                       |                                                      |
| slice then startswith |  467 ns ± 10.8 ns |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         | 86.8 us ± 5.47 us |
|                       |                                                      |
|    string in phrase   | 4.64 us ± 397 ns |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |   317 ms ± 5.74 ms (7 runs, 1 loop each)   |
|                       |                                                      |
|        endswith       | 180 ns ± 34.1 ns  |
|                       |                                                      |
|     slice then ==     |  409 ns ± 80.7 ns |
|                       |                                                      |
|  slice then endswith  |  566 ns ± 200 ns  |
|                       |                                                      |

##### Substring found (last one)

|         Using         |                        Result                        |
|:---------------------:|:----------------------------------------------------:|
|         regex         |  367 ns ± 10.3 ns |
|                       |                                                      |
|       startswith      |   376 ns ± 18 ns  |
|                       |                                                      |
|     slice then ==     |  525 ns ± 193 ns  |
|                       |                                                      |
| slice then startswith |   662 ns ± 12 ns  |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         | 113 us ± 6.94 us  |
|                       |                                                      |
|    string in phrase   | 21.2 ms ± 4.48 ms |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |   313 ms ± 4.34 ms (7 runs, 1 loop each)   |
|                       |                                                      |
|        endswith       |  552 ns ± 205 ns  |
|                       |                                                      |
|     slice then ==     |  444 ns ± 4.37 ns |
|                       |                                                      |
|  slice then endswith  |  875 ns ± 296 ns  |
|                       |                                                      |

##### Substrings not found

|         Using         |                        Result                        |
|:---------------------:|:----------------------------------------------------:|
|         regex         | 125 us ± 12.8 us  |
|                       |                                                      |
|       startswith      | 50.2 us ± 16.6 us |
|                       |                                                      |
|     slice then ==     |  355 ns ± 10.9 ns |
|                       |                                                      |
| slice then startswith | 44.5 us ± 1.31 us |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |   287 ms ± 26.3 ms (7 runs, 1 loop each)   |
|                       |                                                      |
|    string in phrase   | 27.4 ms ± 9.19 ms |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |   295 ms ± 6.06 ms (7 runs, 1 loop each)   |
|                       |                                                      |
|        endswith       | 45.3 us ± 1.37 us |
|                       |                                                      |
|     slice then ==     |  371 ns ± 14.3 ns |
|                       |                                                      |
|  slice then endswith  | 59.5 us ± 22.2 us |
|                       |                                                      |

##### Substring found ignoring case (1st one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   381 ns ± 8.97 ns |
|       startswith      | 7.97 us ± 1.86 us |
|     slice then ==     | 3.58 us ± 95.2 ns |
| slice then startswith | 3.74 us ± 59.9 ns |
|         regex         |   227 us ± 10.1 us  |
|    string in phrase   | 8.47 us ± 1.97 us |
|         regex         |    837 ms ± 15.4 ms (7 runs, 1 loop each)   |
|        endswith       |  7.9 us ± 1.87 us |
|     slice then ==     |  3.67 us ± 220 ns |
|  slice then endswith  |  3.8 us ± 95.9 ns |

##### Substring found ignoring case (middle)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   547 ns ± 174 ns  |
|       startswith      | 6.37 us ± 57.3 ns |
|     slice then ==     | 3.61 us ± 80.4 ns |
| slice then startswith | 4.97 us ± 1.28 us |
|         regex         |   229 us ± 7.98 us  |
|    string in phrase   | 12.6 us ± 2.93 us |
|         regex         |    870 ms ± 18.4 ms (7 runs, 1 loop each)   |
|        endswith       |  8.03 us ± 1.8 us |
|     slice then ==     |  3.69 us ± 129 ns |
|  slice then endswith  |  3.78 us ± 143 ns |

##### Substring found ignoring case (last one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   952 ns ± 258 ns  |
|       startswith      |  6.73 us ± 197 ns |
|     slice then ==     | 5.33 us ± 1.03 us |
| slice then startswith | 3.93 us ± 63.6 ns |
|         regex         |   301 us ± 9.08 us  |
|    string in phrase   |  21.9 ms ± 4.55 ms |
|         regex         |    880 ms ± 109 ms |
|        endswith       | 7.46 us ± 1.56 us |
|     slice then ==     |  3.94 us ± 832 ns |
|  slice then endswith  |  4.01 us ± 119 ns |

##### Substrings not found ignoring case

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  141 us ± 26.3 us  |
|       startswith      |  51.4 us ± 1.39 us |
|     slice then ==     |  5.18 us ± 1.1 us |
| slice then startswith |  47.9 us ± 766 ns  |
|         regex         |  123 us ± 17.3 us  |
|    string in phrase   |  20.4 ms ± 3.68 ms |
|         regex         |  123 us ± 17.5 us  |
|        endswith       |  52.5 us ± 1.75 us |
|     slice then ==     | 3.61 us ± 87.1 ns |
|  slice then endswith  |  73.5 us ± 24.5 us |

#### Large Substring, Few Possibilities

##### Substring found (1st one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   16.2 us ± 3 us  |
|       startswith      |   212 ns ± 7.02 ns |
|     slice then ==     |  223 ns ± 48.8 ns  |
| slice then startswith |   538 ns ± 164 ns  |
|         regex         | 17.9 us ± 4.64 us |
|    string in phrase   | 15.8 us ± 3.38 us |
|         regex         |  27.9 ms ± 1.65 ms |
|        endswith       |   245 ns ± 7.06 ns |
|     slice then ==     |   218 ns ± 7.27 ns |
|  slice then endswith  |   355 ns ± 11.3 ns |

##### Substring found (middle)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  26.1 us ± 870 ns  |
|       startswith      |   239 ns ± 13.8 ns |
|     slice then ==     |  218 ns ± 49.4 ns  |
| slice then startswith |   322 ns ± 7.99 ns |
|         regex         | 15.3 us ± 2.19 us |
|    string in phrase   | 21.4 us ± 4.27 us |
|         regex         |  27.7 ms ± 1.19 ms |
|        endswith       |   252 ns ± 8.61 ns |
|     slice then ==     |   217 ns ± 6.84 ns |
|  slice then endswith  |   542 ns ± 201 ns  |

##### Substring found (last one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         | 16.3 us ± 2.94 us |
|       startswith      |   292 ns ± 9.66 ns |
|     slice then ==     |   196 ns ± 6.41 ns |
| slice then startswith |   312 ns ± 11.9 ns |
|         regex         | 16.4 us ± 4.12 us |
|    string in phrase   |  85.5 us ± 24.1 us |
|         regex         |    28 ms ± 606 us  |
|        endswith       |   323 ns ± 11.7 ns |
|     slice then ==     |   217 ns ± 8.83 ns |
|  slice then endswith  |   458 ns ± 180 ns  |

##### Substrings not found

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         | 50.6 us ± 887 ns |
|       startswith      |  218 ns ± 8.82 ns |
|     slice then ==     |  197 ns ± 5.3 ns |
| slice then startswith |  327 ns ± 12.8 ns |
|         regex         |  414 us ± 50.9 us |
|    string in phrase   | 58.9 us ± 1.5 us |
|         regex         | 41.7 ms ± 1.55 ms (7 runs, 10 loops each) |
|        endswith       |  257 ns ± 68.2 ns |
|     slice then ==     |  367 ns ± 139 ns |
|  slice then endswith  |  352 ns ± 11.9 ns |

##### Substring found ignoring case (1st one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  36.1 us ± 683 ns  |
|       startswith      | 8.03 us ± 1.88 us |
|     slice then ==     |    259 ns ± 12 ns  |
| slice then startswith |   374 ns ± 6.47 ns |
|         regex         |  37.7 us ± 1.29 us |
|    string in phrase   |  29.1 us ± 7.46 us |
|         regex         |  69.5 ms ± 3.66 ms |
|        endswith       |  6.57 us ± 135 ns |
|     slice then ==     |   469 ns ± 183 ns  |
|  slice then endswith  |   407 ns ± 7.64 ns |

##### Substring found ignoring case (middle)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  36.2 us ± 1.38 us |
|       startswith      | 8.06 us ± 1.82 us |
|     slice then ==     |   257 ns ± 7.82 ns |
| slice then startswith |   380 ns ± 12.7 ns |
|         regex         |  37.2 us ± 2.01 us |
|    string in phrase   |  43.6 us ± 6.87 us |
|         regex         |  69.6 ms ± 1.61 ms |
|        endswith       | 7.83 us ± 1.95 us |
|     slice then ==     |   294 ns ± 14.6 ns |
|  slice then endswith  |   429 ns ± 10.5 ns |

##### Substring found ignoring case (last one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  37.3 us ± 1.4 us  |
|       startswith      | 8.15 us ± 2.08 us |
|     slice then ==     |    255 ns ± 11 ns  |
| slice then startswith |   379 ns ± 9.81 ns |
|         regex         |   49 us ± 11.8 us  |
|    string in phrase   |  72.7 us ± 1.15 us |
|         regex         |  80.8 ms ± 18.4 ms |
|        endswith       |  6.71 us ± 126 ns |
|     slice then ==     |   279 ns ± 6.72 ns |
|  slice then endswith  |   516 ns ± 192 ns  |

##### Substrings not found ignoring case

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  44.7 us ± 978 ns  |
|       startswith      | 6.41 us ± 93.1 ns |
|     slice then ==     |   367 ns ± 152 ns  |
| slice then startswith |   432 ns ± 115 ns  |
|         regex         |  86.7 us ± 1.33 us |
|    string in phrase   |  80.4 us ± 26.6 us |
|         regex         |   123 us ± 19 us   |
|        endswith       |  6.47 us ± 134 ns |
|     slice then ==     |   281 ns ± 8.33 ns |
|  slice then endswith  |   626 ns ± 247 ns  |

#### Large Substring, Many Possibilities

##### Substring found (1st one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   18 us ± 4.83 us  |
|       startswith      |   214 ns ± 7.9 ns  |
|     slice then ==     |   324 ns ± 9.08 ns |
| slice then startswith |   478 ns ± 14.5 ns |
|         regex         |   1.2 ms ± 104 us   |
|    string in phrase   | 15.4 us ± 3.05 us |
|         regex         |    20.5 s ± 513 ms |
|        endswith       |   242 ns ± 8.74 ns |
|     slice then ==     |   364 ns ± 25.7 ns |
|  slice then endswith  |   650 ns ± 205 ns  |

##### Substring found (middle)

|         Using         |                        Result                       |
|:---------------------:|:--------------------------:|
|         regex         | 16 us ± 3.94 us |
|       startswith      |  221 ns ± 8.66 ns |
|     slice then ==     |  323 ns ± 4.25 ns |
| slice then startswith |   495 ns ± 16 ns |
|         regex         | 1.05 ms ± 77.8 us |
|    string in phrase   | 19.8 us ± 908 ns |
|         regex         |   20.4 s ± 531 ms (7 runs, 1 loop each)   |
|        endswith       |  254 ns ± 11.2 ns |
|     slice then ==     |  364 ns ± 8.45 ns |
|  slice then endswith  |  745 ns ± 264 ns |

##### Substring found (last one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         | 27.7 us ± 10.2 us |
|       startswith      |   925 ns ± 12.3 ns |
|     slice then ==     |   873 ns ± 242 ns  |
| slice then startswith |   1.7 us ± 483 ns  |
|         regex         |   1.56 ms ± 489 us  |
|    string in phrase   |   55.8 ms ± 833 us |
|         regex         |    23.2 s ± 5.05 s |
|        endswith       |   694 ns ± 204 ns  |
|     slice then ==     |   365 ns ± 3.67 ns |
|  slice then endswith  |   966 ns ± 285 ns  |

##### Substrings not found

|         Using         |                        Result                        |
|:---------------------:|:----------------------------------------------------:|
|         regex         | 213 us ± 38.8 us  |
|                       |                                                      |
|       startswith      | 84.5 us ± 498 ns  |
|                       |                                                      |
|     slice then ==     |  352 ns ± 7.95 ns |
|                       |                                                      |
| slice then startswith | 73.7 us ± 14.1 us |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |   1.32 s ± 83.3 ms (7 runs, 1 loop each)   |
|                       |                                                      |
|    string in phrase   |   31 ms ± 907 us  |
|                       |                                                      |
|      -----------      | -------------------------- | |
|         regex         |   30.4 s ± 858 ms |
|                       |                                                      |
|        endswith       | 116 us ± 28.6 us  |
|                       |                                                      |
|     slice then ==     |  399 ns ± 15.2 ns |
|                       |                                                      |
|  slice then endswith  | 80.1 us ± 2.67 us |
|                       |                                                      |

##### Substring found ignoring case (1st one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  37.5 us ± 1.85 us |
|       startswith      | 8.42 us ± 1.74 us |
|     slice then ==     |  3.66 us ± 212 ns |
| slice then startswith |  3.92 us ± 169 ns |
|         regex         |  1.07 ms ± 84.7 us  |
|    string in phrase   |  20.6 us ± 775 ns  |
|         regex         |    42.6 s ± 725 ms |
|        endswith       |  6.69 us ± 177 ns |
|     slice then ==     |  3.62 us ± 163 ns |
|  slice then endswith  | 5.49 us ± 1.18 us |

##### Substring found ignoring case (middle)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  36.9 us ± 1.22 us |
|       startswith      |  6.7 us ± 173 ns  |
|     slice then ==     | 4.77 us ± 1.19 us |
| slice then startswith |  3.9 us ± 110 ns  |
|         regex         |   819 us ± 74.2 us  |
|    string in phrase   |  32.9 us ± 9.5 us  |
|         regex         |    41.9 s ± 322 ms |
|        endswith       |  6.83 us ± 445 ns |
|     slice then ==     | 4.76 us ± 1.42 us |
|  slice then endswith  | 3.86 us ± 95.8 ns |

##### Substring found ignoring case (last one)

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |  63.5 us ± 1.48 us |
|       startswith      | 13.4 us ± 2.84 us |
|     slice then ==     |  6.29 us ± 156 ns |
| slice then startswith | 8.97 us ± 2.47 us |
|         regex         |   1.54 ms ± 360 us  |
|    string in phrase   |  57.3 ms ± 1.81 ms |
|         regex         |    42.4 s ± 658 ms |
|        endswith       |  6.83 us ± 172 ns |
|     slice then ==     | 3.57 us ± 69.2 ns |
|  slice then endswith  | 5.37 us ± 1.45 us |

##### Substrings not found ignoring case

|         Using         |                         Result                        |
|:---------------------:|:--------------------------:|
|         regex         |   210 us ± 16.7 us  |
|       startswith      |  118 us ± 29.8 us  |
|     slice then ==     |  3.55 us ± 106 ns |
| slice then startswith |  85.2 us ± 16.3 us |
|         regex         |  111 us ± 1.27 us  |
|    string in phrase   |  47.7 ms ± 9.67 ms |
|         regex         |  112 us ± 1.78 us  |
|        endswith       |  96.5 us ± 26.7 us |
|     slice then ==     | 3.54 us ± 42.5 ns |
|  slice then endswith  |  76.3 us ± 15.2 us |
 -->

small string
    substring exists
        search the beginning
        search it all
        search the end
    doesn't exist
        search the beginning
        search it all
        search the end
    substring exists -i
        search the beginning
        search it all
        search the end
    doesn't exist -i
        search the beginning
        search it all
        search the end

large string, small substring
    substring exists
        search the beginning
        search it all
        search the end
    doesn't exist
        search the beginning
        search it all
        search the end
    substring exists -i
        search the beginning
        search it all
        search the end
    doesn't exist -i
        search the beginning
        search it all
        search the end

large string, large substring
    substring exists
        search the beginning
        search it all
        search the end
    doesn't exist
        search the beginning
        search it all
        search the end
    substring exists -i
        search the beginning
        search it all
        search the end
    doesn't exist -i
        search the beginning
        search it all
        search the end

small string
    substring exists from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist from a list
        search the beginning
        search it all
        search the end
    substring exists -i from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist -i from a list
        search the beginning
        search it all
        search the end

large string, small number of possibilities, small substring
    substring exists from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist from a list
        search the beginning
        search it all
        search the end
    substring exists -i from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist -i from a list
        search the beginning
        search it all
        search the end

large string, large number of possibilities, small substring
    substring exists from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist from a list
        search the beginning
        search it all
        search the end
    substring exists -i from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist -i from a list
        search the beginning
        search it all
        search the end

large string, small number of possibilities, large substring
    substring exists from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist from a list
        search the beginning
        search it all
        search the end
    substring exists -i from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist -i from a list
        search the beginning
        search it all
        search the end

large string, large number of possibilities, large substring
    substring exists from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist from a list
        search the beginning
        search it all
        search the end
    substring exists -i from a list
        is the first one of the list
            search the beginning
            search it all
            search the end
        is the middle one
            search the beginning
            search it all
            search the end
        is the last one
            search the beginning
            search it all
            search the end
    doesn't exist -i from a list
        search the beginning
        search it all
        search the end