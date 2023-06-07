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

In this post we will investigate the performance of regex and Python string methods. More specifically, we will compare different
forms of searching for a substring in a given string. We will test it with a variety of strings and substrings sizes and positions,
and also when the substring can't be found. Later, we will also test the performance of the same operations when searching for a large
number of substrings of varied sizes and positions. The code for all these experiments is [available here](https://gist.github.com/george-gca/29cc3af8e1fa5061c6246eefa3476bd1).

## Experiments config

To generate the string I created a function that cycles through all the lowercase letters of the alphabet and returns a string of the desired length. This way we can test the performance of the search in a string of a given size.

```python
def get_string(length):
  return  ''.join(c for c in islice(cycle(ascii_lowercase), length))
```

To generate the substrings, I simply selected a slice of the string in the desired position and size. To use substrings that could not be found in the string, I simply reversed the substrings. Since they are generated in alphabetical order, this ensures that it will not be found. For searching in a small string, we used a string of size 30 with substrings with size 10. For searching in a large string, we used a string of size 10k, with substrings with size 10 when using small substrings and 5k when using large ones. For groups of substrings, when searching in small string we used a group of 3, while for the large string we used a group of 10 when searching in a small group and 5k when searching in a large group.

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


## Searching for a single substring

### Searching in the beginning of the string

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

### Searching in the middle of the string

<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/one_substring_middle.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="2" data-halign="center">Search in the middle</th>
    </tr>
    <tr>
      <th data-field="regex">Regex</th>
      <th data-field="string in">String in</th>
    </tr>
  </thead>
</table>

### Searching in the end of the string

<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/one_substring_ending.json' | relative_url }}">
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

## Searching for multiple substrings

### Searching in the beginning of the string

<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/multiple_substrings_beginning.json' | relative_url }}">
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

### Searching in the middle of the string

<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/multiple_substrings_middle.json' | relative_url }}">
  <thead>
    <tr>
      <th data-field="setup" rowspan="2" data-valign="middle">Setup</th>
      <th colspan="2" data-halign="center">Search in the middle</th>
    </tr>
    <tr>
      <th data-field="regex">Regex</th>
      <th data-field="string in">String in</th>
    </tr>
  </thead>
</table>

### Searching in the end of the string

<table
  data-height="460"
  data-search="true"
  data-toggle="table"
  data-url="{{ '/assets/json/blog/2023-03-20-regex-or-python-string/multiple_substrings_ending.json' | relative_url }}">
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
