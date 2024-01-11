---
layout: post
title: What is faster when searching? Regex or Python string?
date: 2023-03-20 21:13:11
description: Comparing the search performance of regex and Python string methods.
tags: programming code improvement python
categories: python
giscus_comments: true
related_posts: true
---

In this post we will investigate the performance of regex and Python string methods. More specifically, we will compare different
forms of searching for a substring in a given string. We will test it with a variety of strings and substrings sizes and positions, and also when the substring can't be found. Later, we will also test the performance of the same operations when searching for a large number of substrings of varied sizes and positions. The code for all these experiments is [available here](https://gist.github.com/george-gca/29cc3af8e1fa5061c6246eefa3476bd1).

## Experiments config

To generate the strings I created a function that cycles through all the lowercase letters of the alphabet and returns a string of the desired length. This way we can test the performance of the search in a string of any given size.

```python
from itertools import cycle, islice
from string import ascii_lowercase

def get_string(length):
  return  ''.join(c for c in islice(cycle(ascii_lowercase), length))
```

To generate the substrings, I simply selected a slice of the string in the desired position and size. To use substrings that could not be found in the string, I simply reversed the substrings. Since they are generated in alphabetical order, this ensures that it will not be found.

I used a string of length 30 with substrings of size 10 when searching in small strings. For searching in a large string, I used a string of size 10k, with substrings with size 10 when using small substrings and 5k when using large ones. For groups of substrings, when searching in small string I used a group of 3, while for the large string I used a group of 10 when searching in a small group and 5k when searching in a large group.

For all the runs I let the `timeit` function decide the number of loops to run, and it ran 7 times to get the average and standard deviation. Basically, 10 experiments were made for each case, being 3 using regexes and the rest pure python string methods. All the experiments were run for two situations: case sensitive and insensitive. The experiments were made for the following cases:

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

When looking for more than one substring, I used the same cases as above, but giving the list of substring to search for. When using regexes, we used the `|` operator to search for all the substrings at once.

<script>
  function convertScale(value) {
    let splittedNumber = value.split(" ");

    let scale = 1;
    if (splittedNumber[1] == "s") {
      scale = 1000000000;
    } else if (splittedNumber[1] == "ms") {
      scale = 1000000;
    } else if (splittedNumber[1] == "us") {
      scale = 1000;
    } else if (splittedNumber[1] == "ns") {
      scale = 1;
    }

    return parseFloat(splittedNumber[0]) * scale;
  }

  function convertToNumber(value) {
    let splittedValue = value.split(" ± ");
    return convertScale(splittedValue[0]) + convertScale(splittedValue[1]);
  }

  function highlightLowest(value, row) {
    let lowestValue = "";
    let lowestConvertedValue = 999999999999999;

    for (const [key, value] of Object.entries(row)) {
      if (key != "setup") {
        let convertedValue = convertToNumber(value);
        if (convertedValue < lowestConvertedValue) {
          lowestValue = value;
          lowestConvertedValue = convertedValue;
        }
      }
    }

    if (value == lowestValue) {
      return "<u>" + value + "</u>";
    } else {
      return value;
    }
  }
</script>

## Searching for a single substring

When searching for a single substring, we can see that Python string methods are faster than regexes in all cases. The difference is more noticeable when searching in the middle of the string, where the regexes are 2 to 3 times slower than the string methods. When searching in the beginning or end of the string, the difference is smaller, but still significant.

### Searching in the beginning of the string

<table
  data-height="800"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/one_substring_beginning.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="4" data-halign="center">Search in the beginning</th>
    </tr>
    <tr>
      <th data-field="regex" data-formatter="highlightLowest">Regex (^)</th>
      <th data-field="startswith" data-formatter="highlightLowest">startswith</th>
      <th data-field="slice then ==" data-formatter="highlightLowest">slice then ==</th>
      <th data-field="slice then startswith" data-formatter="highlightLowest">slice then startswith</th>
    </tr>
  </thead>
</table>

### Searching in the middle of the string

<table
  data-height="800"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/one_substring_middle.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="2" data-halign="center">Search in the middle</th>
    </tr>
    <tr>
      <th data-field="regex" data-formatter="highlightLowest">Regex</th>
      <th data-field="string in" data-formatter="highlightLowest">String in</th>
    </tr>
  </thead>
</table>

### Searching in the end of the string

<table
  data-height="800"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/one_substring_ending.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="4" data-halign="center">Search in the ending</th>
    </tr>
    <tr>
      <th data-field="regex" data-formatter="highlightLowest">Regex ($)</th>
      <th data-field="endswith" data-formatter="highlightLowest">endswith</th>
      <th data-field="slice then ==" data-formatter="highlightLowest">slice then ==</th>
      <th data-field="slice then endswith" data-formatter="highlightLowest">slice then endswith</th>
    </tr>
  </thead>
</table>

## Searching for multiple substrings

### Searching in the beginning of the string

<table
  data-height="800"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/multiple_substrings_beginning.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="4" data-halign="center">Search in the beginning</th>
    </tr>
    <tr>
      <th data-field="regex" data-formatter="highlightLowest">Regex (^)</th>
      <th data-field="startswith" data-formatter="highlightLowest">startswith</th>
      <th data-field="slice then ==" data-formatter="highlightLowest">slice then ==</th>
      <th data-field="slice then startswith" data-formatter="highlightLowest">slice then startswith</th>
    </tr>
  </thead>
</table>

### Searching in the middle of the string

<table
  data-height="800"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/multiple_substrings_middle.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="2" data-halign="center">Search in the middle</th>
    </tr>
    <tr>
      <th data-field="regex" data-formatter="highlightLowest">Regex</th>
      <th data-field="string in" data-formatter="highlightLowest">String in</th>
    </tr>
  </thead>
</table>

### Searching in the end of the string

<table
  data-height="800"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/multiple_substrings_ending.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="4" data-halign="center">Search in the ending</th>
    </tr>
    <tr>
      <th data-field="regex" data-formatter="highlightLowest">Regex ($)</th>
      <th data-field="endswith" data-formatter="highlightLowest">endswith</th>
      <th data-field="slice then ==" data-formatter="highlightLowest">slice then ==</th>
      <th data-field="slice then endswith" data-formatter="highlightLowest">slice then endswith</th>
    </tr>
  </thead>
</table>
