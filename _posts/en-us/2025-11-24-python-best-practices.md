---
layout: post
title: A comprehensive guide to Python best practices
date: 2025-11-24 23:44:15
description: From code style and modern features to leveraging the standard library and essential idioms for writing clean, efficient Python code.
tags: programming code improvement python
categories: python
giscus_comments: true
related_posts: true
toc:
  sidebar: left
---

A guide of best practices for developing in Python. Inspired by Rui Maranhao's [gist](https://gist.github.com/ruimaranhao/4e18cbe3dad6f68040c32ed6709090a3).

## In General

> "Beautiful is better than ugly." - [PEP 20](https://peps.python.org/pep-0020/)

### General Development Guidelines

#### "Explicit is better than implicit" - [PEP 20](https://peps.python.org/pep-0020/)

**Yes**

```python
def process_data(data, encoding='utf-8', timeout=30):
    """Process data with explicit parameters."""
    # Parameters are clear and visible
    return data.decode(encoding)
```

**No**

```python
def process_data(data):
    """Process data with hidden defaults."""
    # Magic values hidden inside function
    return data.decode('utf-8')  # What encoding? Why?
```

#### "Readability counts." - [PEP 20](https://peps.python.org/pep-0020/)

**Yes**

```python
def calculate_total_price(items, tax_rate):
    subtotal = sum(item.price for item in items)
    tax = subtotal * tax_rate
    total = subtotal + tax
    return total
```

**No**

```python
def calc(i, t):
    return sum(x.p for x in i) * (1 + t)
```

#### "Anybody can fix anything."

Don't create artificial barriers or "ownership" of code. If you see a bug or improvement opportunity in any part of the codebase, fix it.

> This principle comes from Khan Academy's development philosophy.

**Yes**

- See a typo in someone else's module? Fix it.
- Found a bug in a different team's code? Submit a fix.
- Notice outdated documentation? Update it.

**No**

- "That's not my module, I won't touch it."
- "I'll just work around this bug in their code."
- Leaving broken code for the "owner" to fix.

#### Fix each issue (bad design, wrong decision, or poor code) _as soon as it is discovered_.

**Yes**

```python
# You notice during code review that a function is doing too much.
# Refactor it immediately:

def process_user_data(user):
    validate_user(user)
    save_to_database(user)
    send_welcome_email(user)
```

**No**

```python
# You notice the problem but add a TODO comment instead:

def process_user_data(user):
    # TODO: This function does too much, should refactor
    validate_user(user)
    save_to_database(user)
    send_welcome_email(user)
    # TODO will likely never be addressed
```

#### "Now is better than never." - [PEP 20](https://peps.python.org/pep-0020/)

Don't wait for the "perfect" solution. Ship working code, then iterate.

**Yes**

- Implement a basic working feature, deploy it, gather feedback, improve it.
- Write simple tests now rather than waiting to design the perfect test suite.

**No**

- Endlessly debating the ideal architecture without writing code.
- Waiting months to ship because you want every edge case handled.

#### Test ruthlessly. Write docs for new features.

**Yes**

```python
def divide(a, b):
    """Divide a by b.

    :param a: Numerator
    :param b: Denominator (must be non-zero)
    :returns: Result of a / b
    :raises ValueError: If b is zero
    """
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# And corresponding tests:
class TestDivide(unittest.TestCase):
    def test_divide_positive_numbers(self):
        self.assertEqual(divide(10, 2), 5)

    def test_divide_by_zero_raises_error(self):
        with self.assertRaises(ValueError):
            divide(10, 0)
```

**No**

```python
def divide(a, b):
    return a / b  # No docs, no tests, will crash on zero
```

#### Even more important than Test-Driven Development--_Human-Driven Development_

Write code for humans first, machines second.

**Yes**

```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, item):
        """Add an item to the cart."""
        self.items.append(item)

    def get_total(self):
        """Calculate total price of all items."""
        return sum(item.price for item in self.items)
```

**No**

```python
class SC:
    def __init__(self):
        self.i = []

    def a(self, x):
        self.i.append(x)

    def t(self):
        return sum(z.p for z in self.i)
```

#### These guidelines may--and probably will--change.

Be flexible and open to improving practices as you learn and as the field evolves. What works today might not be the best approach tomorrow.

## In Particular

### Style

Follow [PEP 8](https://peps.python.org/pep-0008/), when sensible.

#### Naming

- Variables, functions, methods, packages, modules
  - `lower_case_with_underscores`
- Classes and Exceptions
  - `CapWords`
- Protected methods and internal functions
  - `_single_leading_underscore(self, ...)`
  - _Note_: Leading underscores help IDEs identify protected/private members and can trigger "unused" warnings for internal helpers
- Private methods
  - `__double_leading_underscore(self, ...)`
- Constants
  - `ALL_CAPS_WITH_UNDERSCORES`

**About underscore prefixes:**

Using `_` prefix for protected/private functions helps your IDE and linters understand your intent:

```python
# mymodule.py

def _internal_helper(data):
    """Internal function - not part of public API."""
    return data.strip().lower()

def public_function(text):
    """Public API function."""
    return _internal_helper(text)

# IDE will warn that _internal_helper is "unused" if not called internally
# IDE will mark it as protected/internal in code navigation
```

_Rationale_: IDEs like PyCharm and VS Code use the underscore prefix to:

- Activate "unused code" warnings for internal helpers
- Indicate these functions shouldn't be imported with `from module import *`
- Show different icons/colors in code navigation to distinguish public vs internal APIs

##### General Naming Guidelines

Avoid one-letter variables (esp. `l`, `O`, `I`).

_Exception_: In very short blocks, when the meaning is clearly visible from the immediate context

**Fine**

```python
for e in elements:
    e.mutate()
```

Avoid redundant labeling.

**Yes**

```python
import audio

core = audio.Core()
controller = audio.Controller()
```

**No**

```python
import audio
from audio import *

core = audio.AudioCore()
controller = audio.AudioController()
```

Prefer "reverse notation".

**Yes**

```python
elements = ...
elements_active = ...
elements_defunct = ...
```

**No**

```python
elements = ...
active_elements = ...
defunct_elements ...
```

Avoid reusing the same variable name for different purposes.

**Yes**

```python
# Each variable has a single, clear purpose
user_input = input("Enter a number: ")
user_number = int(user_input)
squared_number = user_number ** 2
print(f"Result: {squared_number}")
```

```python
# Processing different types of data
raw_data = fetch_data_from_api()
processed_data = clean_data(raw_data)
validated_data = validate_data(processed_data)
```

**No**

```python
# 'data' means something different each time
data = input("Enter a number: ")  # data is a string
data = int(data)                   # now data is an int
data = data ** 2                   # now data is the squared result
print(f"Result: {data}")           # confusing!
```

```python
# Reusing 'result' for unrelated things
result = calculate_tax(price)
save_to_database(result)
result = send_email(user)  # result now means something completely different
result = validate_input(form)  # and now something else again
```

_Rationale_: Reusing variable names makes code harder to debug, understand, and maintain. Each variable should represent one concept throughout its scope.

#### Indentation

Up to you, but be consistent. [Enough said](https://thenewstack.io/spaces-vs-tabs-a-20-year-debate-and-now-this-what-the-hell-is-wrong-with-go/).

{% include figure.liquid loading="eager" path="https://media.giphy.com/media/l0IylSajlbPRFxH8Y/giphy.gif" class="img-fluid rounded z-depth-1" %}

However, note that: A tab could be a different number of columns depending on your environment, but a space is always one column. In terms of how many spaces (or tabs) constitutes indentation, it's more important to be consistent throughout your code than to use any specific tab stop value.

#### Equality checking

Avoid comparing to `True`, `False` or `None`.

**Yes**

```python
if attr:
    print('True!')

if attr is True:
    print('True!')

if not attr:
    print('False!')

if attr is None:
    print('None')
```

**No**

```python
if attr == True:
    print('True!')

if attr == False:
    print('False!')

if attr == None:
    print('None')
```

#### List comprehensions

Use list comprehension when possible.

**Yes**

```python
a = [3, 4, 5]
b = [i for i  in a  if i > 4]

#Or (filter is this case; map could also be more appropriate in other cases)
b = filter(lambda x: x > 4, a)
```

**No**

```python
a = [3, 4, 5]
b = []
for i in a:
    if  i > 4:
        b.append(i)
```

#### Keyword `with` and files

The `with` statement ensures that clean-up code is executed. When opening a file, `with` will make sure that the file is closed after the `with` block.

**Yes**

```python
with open('file.txt') as f:
    do_something_with_f
```

**No**

```python
f = open('file.txt')
do_something_with_f
f.close()
```

#### Imports

Import entire modules instead of individual symbols within a module. For example, for a top-level module `canteen` that has a file `canteen/sessions.py`,

**Yes**

```python
import canteen
import canteen.sessions
from canteen import sessions
```

**No**

```python
from canteen import get_user  # Symbol from canteen/__init__.py
from canteen.sessions import get_session  # Symbol from canteen/sessions.py
```

_Exception_: For third-party code where documentation explicitly says to import individual symbols.

_Rationale_: Avoids circular imports. See [here](https://stackabuse.com/python-circular-imports/).

Put all imports at the top of the page with three sections, each separated by a blank line, in this order:

1. System imports
2. Third-party imports
3. Local source tree imports

_Rationale_: Makes it clear where each module is coming from.

#### Documentation

Follow [PEP 257](https://peps.python.org/pep-0257/)'s docstring guidelines. [reStructured Text](http://docutils.sourceforge.net/docs/user/rst/quickref.html) and [Sphinx](http://sphinx-doc.org/) can help to enforce these standards.

When possible, use one-line docstrings for obvious functions.

```python
"""Return the pathname of ``foo``."""
```

Multiline docstrings should include

- Summary line
- Use case, if appropriate
- Args
- Return type and semantics, unless `None` is returned

```python
"""Train a model to classify Foos and Bars.

Usage::

    >>> import klassify
    >>> data = [("green", "foo"), ("orange", "bar")]
    >>> classifier = klassify.train(data)

:param train_data: A list of tuples of the form ``(color, label)``.
:rtype: A :class:`Classifier <Classifier>`
"""
```

Notes

- Use action words ("Return") rather than descriptions ("Returns").
- Document `__init__` methods in the docstring for the class.

```python
class Person(object):
    """A simple representation of a human being.

    :param name: A string, the person's name.
    :param age: An int, the person's age.
    """
    def __init__(self, name, age):
        self.name = name
        self.age = age
```

##### Alternative Docstring Formats

While the examples above use reStructuredText (reST) format, there are other popular docstring styles used in the Python community. Choose one and be consistent throughout your project.

**NumPy/SciPy Style**

Popular in scientific computing, more readable for complex functions with many parameters.

```python
def calculate_statistics(data, weights=None, ddof=0):
    """
    Calculate mean and standard deviation of data.

    Parameters
    ----------
    data : array_like
        Input data array.
    weights : array_like, optional
        Weights for each value in data. Default is None.
    ddof : int, optional
        Delta degrees of freedom. Default is 0.

    Returns
    -------
    mean : float
        Arithmetic mean of the data.
    std : float
        Standard deviation of the data.

    Raises
    ------
    ValueError
        If data is empty.

    Examples
    --------
    >>> calculate_statistics([1, 2, 3, 4, 5])
    (3.0, 1.4142135623730951)
    """
    pass
```

**Google Style**

Clean and readable, popular in many open-source projects.

```python
def calculate_statistics(data, weights=None, ddof=0):
    """Calculate mean and standard deviation of data.

    Args:
        data (array_like): Input data array.
        weights (array_like, optional): Weights for each value in data.
            Defaults to None.
        ddof (int, optional): Delta degrees of freedom. Defaults to 0.

    Returns:
        tuple: A tuple containing:
            - mean (float): Arithmetic mean of the data.
            - std (float): Standard deviation of the data.

    Raises:
        ValueError: If data is empty.

    Examples:
        >>> calculate_statistics([1, 2, 3, 4, 5])
        (3.0, 1.4142135623730951)
    """
    pass
```

**Comparison**

| Style                       | Best For                                      | Tools                          |
| --------------------------- | --------------------------------------------- | ------------------------------ |
| **reStructuredText (reST)** | General Python projects, Sphinx documentation | Sphinx, most IDEs              |
| **NumPy/SciPy**             | Scientific computing, data science projects   | Sphinx with Napoleon extension |
| **Google**                  | Clean, readable docs; Google-style projects   | Sphinx with Napoleon extension |

**Documentation Generation Tools**

Beyond Sphinx, several other tools can generate documentation from your docstrings:

| Tool | Features | Best For |
| --- | --- | --- |
| **[pdoc](https://pdoc.dev/)** | Minimal, clean HTML docs; auto-generates from docstrings; great for small projects | Quick documentation without configuration |
| **[MkDocs](https://www.mkdocs.org/)** with [mkdocstrings](https://mkdocstrings.github.io/) | Modern Material Design theme; Markdown-based; integrates docstrings | Beautiful, modern project documentation |
| **[Pydoc](https://docs.python.org/3/library/pydoc.html)** | Built-in Python tool; minimal setup; generates HTML or terminal docs | Simple projects; documentation without dependencies |
| **[Quartodoc](https://machow.github.io/quartodoc/)** | Bridges Quarto and Python; supports multiple docstring formats | Data science projects; integrating code with narratives |
| **[ReadTheDocs](https://readthedocs.org/)** | Free hosting; integrates with Sphinx; automatic builds from GitHub | Open-source projects needing hosted documentation |
| **[Griffe](https://mkdocstrings.github.io/griffe/)** | Modern Python doc parser; supports multiple formats; async-friendly | Projects requiring flexible docstring extraction |

**Key Points**

- **Be consistent**: Pick one style and use it throughout your project
- **Tool support**: Most documentation generators support multiple docstring formats
- **Team preference**: Follow your team's or project's existing convention
- **Readability**: NumPy and Google styles are often more readable for complex functions
- **Integration**: Consider which tools integrate with your CI/CD and hosting platform

##### On comments

Use them sparingly. Prefer code readability to writing a lot of comments. Often, small methods are more effective than comments.

_No_

```python
# If the sign is a stop sign
if sign.color == 'red' and sign.sides == 8:
    stop()
```

_Yes_

```python
def is_stop_sign(sign):
    return sign.color == 'red' and sign.sides == 8

if is_stop_sign(sign):
    stop()
```

When you do write comments, remember: "Strunk and White apply." - [PEP 8](https://peps.python.org/pep-0008/)

In summary:

> Use clear, direct language and avoid unnecessary words to ensure a reader's understanding, as recommended by Strunk and White.

#### Line lengths

Don't stress over it. 80-100 characters is fine. We have wide screens nowadays.

Use parentheses for line continuations.

```python
wiki = (
    "The Colt Python is a .357 Magnum caliber revolver formerly manufactured "
    "by Colt's Manufacturing Company of Hartford, Connecticut. It is sometimes "
    'referred to as a "Combat Magnum". It was first introduced in 1955, the '
    "same year as Smith & Wesson's M29 .44 Magnum."
)
```

#### String Formatting

Use f-strings (formatted string literals) for string formatting. They are more readable, concise, and faster than older methods.

**Yes**

```python
name = "Alice"
age = 30
city = "Lisbon"

# Simple variable interpolation
message = f"Hello, {name}!"

# Expressions inside f-strings
info = f"{name} is {age} years old and lives in {city}."

# Formatting numbers
price = 19.99
quantity = 3
total = f"Total: €{price * quantity:.2f}"  # Total: €59.97

# Multi-line f-strings
report = (
    f"User Report:\n"
    f"  Name: {name}\n"
    f"  Age: {age}\n"
    f"  City: {city}"
)
```

**No**

```python
name = "Alice"
age = 30
city = "Lisbon"

# Old-style % formatting (avoid)
message = "Hello, %s!" % name
info = "%s is %d years old and lives in %s." % (name, age, city)

# str.format() method (verbose)
message = "Hello, {}!".format(name)
info = "{} is {} years old and lives in {}.".format(name, age, city)

# String concatenation (error-prone and hard to read)
message = "Hello, " + name + "!"
info = name + " is " + str(age) + " years old and lives in " + city + "."
```

_Rationale_: F-strings (Python 3.6+) are faster, more readable, and less error-prone than `%` formatting or `.format()`. They allow expressions directly inside the string and make the code's intent clearer.

**Advanced f-string features**

```python
# Debugging with f-strings (Python 3.8+)
x = 10
y = 20
print(f"{x=}, {y=}, {x+y=}")  # x=10, y=20, x+y=30

# Calling functions
def get_status():
    return "active"

status_msg = f"System is {get_status()}"
```

**Formatting numbers with f-strings**

```python
# Format a float to 2 decimal places
price = 19.98765
formatted_price = f"{price:.2f}"  # '19.99'

# Format an integer with leading zeros (e.g., pad to 4 digits)
order_number = 42
formatted_order = f"{order_number:04d}"  # '0042'

# Right-align a string with spaces using f-strings
text = "Python"
width = 12
right_aligned = f"{text:>{width}}"
print(f"'{right_aligned}'")  # Output: '      Python'

# Or, for left alignment (for comparison):
left_aligned = f"{text:<{width}}"
print(f"'{left_aligned}'")  # Output: 'Python      '

# Format a percentage with 1 decimal place
success_rate = 0.857
formatted_rate = f"{success_rate:.1%}"  # '85.7%'

# Format large numbers with commas
population = 1234567
formatted_population = f"{population:,}"  # '1,234,567'

# Format large numbers with locale-aware grouping using `:n`
import locale

locale.setlocale(locale.LC_ALL, '')  # Set to user's default locale
large_number = 1234567.89
formatted_number = f"{large_number:n}"  # e.g., '1,234,567.89' or '1.234.567,89' depending on locale
```

#### Type Hints

Use type hints to make your code more readable and maintainable. Type hints help IDEs provide better autocomplete, catch errors early, and serve as inline documentation.

**Yes**

```python
def calculate_total(price: float, quantity: int) -> float:
    """Calculate total price for items."""
    return price * quantity

def greet(name: str) -> str:
    """Return a greeting message."""
    return f"Hello, {name}!"

def process_items(items: list[str]) -> dict[str, int]:
    """Count occurrences of each item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts
```

**No**

```python
def calculate_total(price, quantity):
    """Calculate total price for items."""
    return price * quantity  # What types? Will this work with all inputs?

def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}!"  # Is name always a string?

def process_items(items):
    """Count occurrences of each item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts  # What does this return?
```

_Rationale_: Type hints improve code clarity, enable better IDE support (autocomplete, refactoring, error detection), and help catch bugs before runtime. Modern IDEs like VS Code and PyCharm use type hints to provide intelligent code completion and warnings.

**Modern type hints (Python 3.9+)**

Starting with Python 3.9, you can use built-in types directly instead of importing from `typing`. Python 3.10+ also introduces the `|` operator for union types.

**Yes** (Python 3.10+)

```python
# Use built-in types with [] syntax (Python 3.9+)
def process_items(items: list[str]) -> dict[str, int]:
    """Count occurrences of each item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts

# Use | operator for unions (Python 3.10+)
def find_user(user_id: int) -> str | None:
    """Find user by ID, return None if not found."""
    if user_id > 0:
        return "Alice"
    return None

def process_id(id_value: int | str) -> str:
    """Process ID that can be int or string."""
    return str(id_value)

# Multiple union types
def parse_config(value: str | int | float | None) -> str:
    """Parse configuration value."""
    return str(value) if value is not None else ""
```

**Older style** (Python 3.5-3.8)

```python
from typing import Optional, Union, List, Dict

# Had to import and use capitalized generic types
def process_items(items: List[str]) -> Dict[str, int]:
    """Count occurrences of each item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts

# Used Optional and Union from typing module
def find_user(user_id: int) -> Optional[str]:
    """Find user by ID, return None if not found."""
    if user_id > 0:
        return "Alice"
    return None

def process_id(id_value: Union[int, str]) -> str:
    """Process ID that can be int or string."""
    return str(id_value)
```

_Note_: If you're using Python 3.10 or later, prefer the modern syntax with `|` and built-in types (`list`, `dict`, `set`, `tuple`). For Python 3.9, use built-in types with `[]` but continue using `Optional` and `Union` from `typing`. The old style with `List`, `Dict`, etc. from `typing` is now deprecated but still works.

**More type hint examples**

```python
from typing import Any, Callable

# Class type hints
class User:
    def __init__(self, name: str, age: int) -> None:
        self.name: str = name
        self.age: int = age

    def get_info(self) -> dict[str, Any]:
        """Return user information."""
        return {"name": self.name, "age": self.age}

# Callable type hints
def apply_operation(x: int, operation: Callable[[int], int]) -> int:
    """Apply a function to a number."""
    return operation(x)

# Type aliases for complex types
UserId = int
UserData = dict[str, str | int]  # Python 3.10+
# Or for older versions: dict[str, Union[str, int]]

def get_user_data(user_id: UserId) -> UserData:
    """Get user data by ID."""
    return {"name": "Alice", "age": 30}
```

**IDE and AI Assistant Benefits**

With type hints, your IDE and AI coding assistants can:

- **Autocomplete**: Suggest methods and attributes based on the type
- **Error detection**: Warn you when passing wrong types before running code
- **Refactoring**: Safely rename variables and functions across your codebase
- **Documentation**: Show parameter types in function signatures without reading docs
- **AI assistance**: GitHub Copilot, Codeium, and other AI assistants provide more accurate suggestions when they understand your types

```python
# IDE knows 'result' is a float, suggests float methods
result: float = calculate_total(19.99, 3)
result.is_integer()  # IDE autocompletes this method

# IDE warns if you pass wrong types
calculate_total("19.99", "3")  # IDE shows warning: expected float and int

# AI assistants provide better completions with type hints
def process_users(users: list[dict[str, str]]) -> list[str]:
    # AI knows 'users' is a list of dicts, suggests appropriate operations
    # AI knows return type should be list of strings
    return [user["name"] for user in users]  # AI suggests this correctly
```

_Note_: AI coding assistants like GitHub Copilot use type hints to understand your code's intent and provide more accurate, context-aware suggestions. Well-typed code gets better AI assistance.

#### Leverage the Standard Library

Python's standard library is extensive and well-tested. Before writing custom solutions or installing third-party packages, check if the standard library already provides what you need. Familiarizing yourself with common standard library modules will make you a more effective Python programmer.

##### collections - Specialized Container Data Types

The `collections` module provides alternatives to built-in containers with additional functionality.

**Counter - Count hashable objects**

**Yes**

```python
from collections import Counter

# Count occurrences in a list
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
word_counts = Counter(words)
print(word_counts)  # Counter({'apple': 3, 'banana': 2, 'orange': 1})

# Get most common items
print(word_counts.most_common(2))  # [('apple', 3), ('banana', 2)]

# Combine counters
more_words = ["apple", "grape"]
word_counts.update(more_words)
```

**No**

```python
# Manually counting (verbose and error-prone)
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
word_counts = {}
for word in words:
    if word in word_counts:
        word_counts[word] += 1
    else:
        word_counts[word] = 1
```

**defaultdict - Dictionary with default values**

```python
from collections import defaultdict

# Group items by category
items = [("fruit", "apple"), ("fruit", "banana"), ("vegetable", "carrot")]
grouped = defaultdict(list)
for category, item in items:
    grouped[category].append(item)
# {'fruit': ['apple', 'banana'], 'vegetable': ['carrot']}
```

##### functools - Higher-Order Functions

**partial - Partial function application**

**Yes**

```python
from functools import partial

def power(base: int, exponent: int) -> int:
    """Raise base to the power of exponent."""
    return base ** exponent

# Create specialized functions
square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(5))   # 125
```

**No**

```python
# Creating wrapper functions manually
def power(base: int, exponent: int) -> int:
    """Raise base to the power of exponent."""
    return base ** exponent

def square(base: int) -> int:
    return power(base, 2)

def cube(base: int) -> int:
    return power(base, 3)
```

**lru_cache - Memoization decorator**

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    """Calculate nth Fibonacci number with caching."""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Much faster for repeated calls
print(fibonacci(100))  # Computed instantly due to caching
```

##### itertools - Iterator Building Blocks

**chain - Combine multiple iterables**

```python
from itertools import chain

# Combine multiple lists into one
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list(chain(list1, list2))  # [1, 2, 3, 4, 5, 6]
```

**combinations - All combinations of items**

```python
from itertools import combinations

# Get all 2-item combinations
items = ['A', 'B', 'C']
combos = list(combinations(items, 2))
# [('A', 'B'), ('A', 'C'), ('B', 'C')]
```

For more combinatorics utilities, refer to the [official Python documentation](https://docs.python.org/3/library/itertools.html).

**groupby - Group consecutive items**

```python
from itertools import groupby

# Group consecutive items by a key
data = [('A', 1), ('A', 2), ('B', 1), ('B', 2), ('A', 3)]
for key, group in groupby(data, key=lambda x: x[0]):
    print(f"{key}: {list(group)}")
# A: [('A', 1), ('A', 2)]
# B: [('B', 1), ('B', 2)]
# A: [('A', 3)]
```

**islice - Slice an iterator**

```python
from itertools import islice

# Get items from an iterator without loading all into memory
def generate_numbers():
    n = 0
    while True:
        yield n
        n += 1

# Get first 10 even numbers
evens = (x for x in generate_numbers() if x % 2 == 0)
first_ten_evens = list(islice(evens, 10))  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

##### pathlib - Object-Oriented File Paths

**Yes**

```python
from pathlib import Path

# Modern, readable path operations
project_dir = Path("/home/user/project")
config_file = project_dir / "config" / "settings.json"

if config_file.exists():
    content = config_file.read_text()

# List all Python files
python_files = list(project_dir.glob("**/*.py"))
```

**No**

```python
import os

# Old-style string manipulation
project_dir = "/home/user/project"
config_file = os.path.join(project_dir, "config", "settings.json")

if os.path.exists(config_file):
    with open(config_file, 'r') as f:
        content = f.read()
```

##### dataclasses - Reduce Boilerplate for Classes

**Yes** (Python 3.7+)

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

    def distance_from_origin(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Point(3.0, 4.0)
print(p)  # Point(x=3.0, y=4.0)
print(p.distance_from_origin())  # 5.0
```

**No**

```python
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def distance_from_origin(self) -> float:
        return (self.x ** 2 + self.y ** 2) ** 0.5
```

_Rationale_: The standard library is well-documented, thoroughly tested, and requires no additional dependencies. Learning these modules will help you write more concise, efficient, and idiomatic Python code.

### Modern Python Features

Python continues to evolve with each version, introducing new syntax and features that make code more readable and concise. Here are some significant additions from recent Python versions.

#### Assignment Expressions (Walrus Operator) - Python 3.8+

The walrus operator `:=` allows you to assign values to variables as part of an expression. This is particularly useful in conditions and loops.

**Yes**

```python
# Assign and use in one line
if (n := len(data)) > 10:
    print(f"List is too long ({n} elements, expected <= 10)")

# Avoid redundant function calls in while loops
while (line := file.readline()) != "":
    process(line)

# List comprehensions with shared subexpression
data = [1, 2, 3, 4, 5]
results = [y for x in data if (y := x * 2) > 5]  # [6, 8, 10]

# Reuse expensive computation in comprehension
expensive_results = [result for x in data
                    if (result := expensive_function(x)) is not None]
```

**No**

```python
# Without walrus operator - less concise
n = len(data)
if n > 10:
    print(f"List is too long ({n} elements, expected <= 10)")

# Redundant calls
line = file.readline()
while line != "":
    process(line)
    line = file.readline()

# Computing twice
results = [x * 2 for x in data if x * 2 > 5]
```

_Rationale_: The walrus operator reduces code duplication and makes intentions clearer, especially when you need to use a computed value multiple times.

#### Positional-Only and Keyword-Only Parameters - Python 3.8+

Use `/` to specify positional-only parameters and `*` for keyword-only parameters, making your API more explicit and preventing misuse.

**Yes**

```python
# Positional-only parameters (before /)
def greet(name, /, greeting="Hello"):
    """Name must be positional, greeting can be keyword."""
    return f"{greeting}, {name}!"

greet("Alice")  # OK
greet("Alice", greeting="Hi")  # OK
# greet(name="Alice")  # Error: name is positional-only

# Keyword-only parameters (after *)
def create_user(username, *, email, age):
    """Email and age must be passed as keywords."""
    return {"username": username, "email": email, "age": age}

create_user("alice", email="alice@example.com", age=30)  # OK
# create_user("alice", "alice@example.com", 30)  # Error: email and age must be keyword

# Combining both
def process(a, b, /, c, *, d, e):
    """a, b are positional-only; c can be either; d, e are keyword-only."""
    pass
```

**No**

```python
# Ambiguous API without parameter restrictions
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# Users might do this (unclear which is which):
greet(greeting="Alice", name="Hello")  # Confusing!
```

_Rationale_: Explicit parameter types prevent API misuse and make function signatures self-documenting.

#### Pattern Matching (Structural Pattern Matching) - Python 3.10+

The `match`/`case` statement provides powerful pattern matching similar to switch statements in other languages, but much more flexible.

**Yes**

```python
# Simple value matching
def http_status(status: int) -> str:
    match status:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Internal Server Error"
        case _:
            return "Unknown Status"

# Pattern matching with structures
def process_command(command: tuple) -> str:
    match command:
        case ("quit",):
            return "Exiting..."
        case ("load", filename):
            return f"Loading {filename}"
        case ("save", filename, format):
            return f"Saving {filename} as {format}"
        case _:
            return "Unknown command"

# Matching objects and types
def describe(obj):
    match obj:
        case int(x) if x > 0:
            return f"Positive integer: {x}"
        case int(x) if x < 0:
            return f"Negative integer: {x}"
        case str(s) if len(s) > 0:
            return f"Non-empty string: {s}"
        case list([]):
            return "Empty list"
        case list([first, *rest]):
            return f"List starting with {first}"
        case {"name": name, "age": age}:
            return f"Person: {name}, age {age}"
        case _:
            return "Something else"
```

**No**

```python
# Long if-elif chains (less readable)
def http_status(status: int) -> str:
    if status == 200:
        return "OK"
    elif status == 404:
        return "Not Found"
    elif status == 500:
        return "Internal Server Error"
    else:
        return "Unknown Status"

def process_command(command: tuple) -> str:
    if len(command) == 1 and command[0] == "quit":
        return "Exiting..."
    elif len(command) == 2 and command[0] == "load":
        return f"Loading {command[1]}"
    elif len(command) == 3 and command[0] == "save":
        return f"Saving {command[1]} as {command[2]}"
    else:
        return "Unknown command"
```

_Rationale_: Pattern matching makes complex conditional logic more readable and maintainable, especially when dealing with structured data.

#### Dictionary Merge and Update Operators - Python 3.9+

Use `|` and `|=` operators for merging dictionaries.

**Yes**

```python
# Merge dictionaries with | operator
defaults = {"color": "blue", "size": "medium"}
custom = {"size": "large", "style": "modern"}
config = defaults | custom  # {'color': 'blue', 'size': 'large', 'style': 'modern'}

# Update in place with |=
settings = {"theme": "dark"}
settings |= {"language": "en", "theme": "light"}
# settings is now {'theme': 'light', 'language': 'en'}
```

**No**

```python
# Old way - more verbose
defaults = {"color": "blue", "size": "medium"}
custom = {"size": "large", "style": "modern"}
config = {**defaults, **custom}  # Works but less clear

# Or even older
config = defaults.copy()
config.update(custom)
```

_Rationale_: The `|` operator makes dictionary merging more intuitive and consistent with set operations.

#### Improved Error Messages - Python 3.10+

Python 3.10+ provides much more helpful error messages with better context and suggestions.

```python
# Example: Better syntax error messages
# Python 3.10+ will point to the exact location and suggest fixes

# Missing colon
# if x > 5
#        ^
# SyntaxError: expected ':'

# Better name error suggestions
name = "Alice"
# print(nam)
# NameError: name 'nam' is not defined. Did you mean: 'name'?

# Better attribute errors
class User:
    def __init__(self):
        self.username = "alice"

user = User()
# print(user.usrname)
# AttributeError: 'User' object has no attribute 'usrname'. Did you mean: 'username'?
```

#### Parenthesized Context Managers - Python 3.10+

Write cleaner code when using multiple context managers.

**Yes** (Python 3.10+)

```python
# Parentheses allow natural line breaks
with (
    open("input.txt") as infile,
    open("output.txt", "w") as outfile,
    open("log.txt", "w") as logfile,
):
    process_files(infile, outfile, logfile)
```

**No** (Python 3.9 and earlier)

```python
# Awkward backslash continuation
with open("input.txt") as infile, \
     open("output.txt", "w") as outfile, \
     open("log.txt", "w") as logfile:
    process_files(infile, outfile, logfile)
```

_Rationale_: Parenthesized context managers improve readability when working with multiple resources.

### Essential Python Idiomatics and Best Practices

#### The `if __name__ == "__main__"` Pattern

Use this idiomatic expression to make your Python files both importable modules and executable scripts.

**Yes**

```python
# mymodule.py
def calculate_sum(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

def main():
    """Main entry point when run as script."""
    result = calculate_sum(5, 3)
    print(f"Result: {result}")

if __name__ == "__main__":
    main()
```

**When imported:**

```python
# other_file.py
import mymodule

# Only the function is available, main() doesn't run automatically
result = mymodule.calculate_sum(10, 20)
```

**When run directly:**

```bash
python mymodule.py  # Runs main() and prints "Result: 8"
```

**No**

```python
# mymodule.py - Bad practice
def calculate_sum(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

# Code runs immediately when imported (bad!)
result = calculate_sum(5, 3)
print(f"Result: {result}")
```

_Rationale_: This pattern allows code reuse. The same file can be used as an importable module or run as a standalone script without executing unwanted side effects during import.

#### Logging vs Print

Use the `logging` module instead of `print()` for anything beyond simple scripts. Logging provides better control over output levels, formatting, and destinations.

**Yes**

```python
import logging

# Configure logging at the start of your application
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def process_data(data):
    logger.debug(f"Processing data: {data}")

    if not data:
        logger.warning("Empty data received")
        return None

    try:
        result = expensive_operation(data)
        logger.info(f"Successfully processed {len(data)} items")
        return result
    except Exception as e:
        logger.error(f"Failed to process data: {e}", exc_info=True)
        raise

# Benefits:
# - Can change log level without modifying code
# - Logs include timestamps and context
# - Can redirect to files, streams, or external services
# - Different loggers for different modules
```

**No**

```python
def process_data(data):
    print(f"Processing data: {data}")  # Always prints, no control

    if not data:
        print("WARNING: Empty data received")  # No standard format
        return None

    try:
        result = expensive_operation(data)
        print(f"Processed {len(data)} items")  # Mixed with actual output
        return result
    except Exception as e:
        print(f"ERROR: {e}")  # No stack trace, hard to debug
        raise
```

**Log Levels**

```python
import logging

logger = logging.getLogger(__name__)

# Use appropriate levels
logger.debug("Detailed information for debugging")
logger.info("General informational messages")
logger.warning("Warning messages for unexpected situations")
logger.error("Error messages for serious problems")
logger.critical("Critical messages for very serious errors")

# In production, set level to INFO or WARNING to reduce noise
logging.basicConfig(level=logging.WARNING)
# Now only warning, error, and critical messages appear
```

_Rationale_: Logging is configurable, structured, and production-ready. It allows you to control verbosity without changing code and provides better context for debugging.

#### Efficient Collection Operations

Choose the right data structure for the job. Understanding performance characteristics prevents inefficient code. For more use cases, refer to [this blog post](https://george-gca.github.io/blog/2023/simple-improvements-python-code/).

**Set Membership Testing**

**Yes**

```python
# Use sets for membership testing - O(1) average case
valid_users = {"alice", "bob", "charlie", "david"}  # set

if username in valid_users:  # Fast: O(1)
    grant_access()

# Converting list to set for multiple lookups
user_list = ["alice", "bob", "charlie", "david"]
user_set = set(user_list)  # Convert once

for login_attempt in login_attempts:
    if login_attempt in user_set:  # O(1) per check
        process_login(login_attempt)
```

**No**

```python
# Using lists for membership testing - O(n) linear search
valid_users = ["alice", "bob", "charlie", "david"]  # list

if username in valid_users:  # Slow: O(n)
    grant_access()

# Repeatedly searching through lists
for login_attempt in login_attempts:
    if login_attempt in valid_users:  # O(n) per check - very slow!
        process_login(login_attempt)
```

**Dictionary for Fast Lookups**

**Yes**

```python
# Use dicts for key-value lookups - O(1)
user_scores = {
    "alice": 95,
    "bob": 87,
    "charlie": 92
}

score = user_scores.get("alice", 0)  # Fast lookup with default

# Dict comprehension
squared = {x: x**2 for x in range(10)}
# {0: 0, 1: 1, 2: 4, 3: 9, ...}
```

**No**

```python
# Using parallel lists - inefficient and error-prone
usernames = ["alice", "bob", "charlie"]
scores = [95, 87, 92]

# Linear search to find score - O(n)
def get_score(username):
    for i, name in enumerate(usernames):
        if name == username:
            return scores[i]
    return 0
```

**Set Operations**

```python
# Set operations are fast and readable
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}

# Union - all unique elements
union = set_a | set_b  # {1, 2, 3, 4, 5, 6, 7, 8}

# Intersection - common elements
intersection = set_a & set_b  # {4, 5}

# Difference - elements in a but not in b
difference = set_a - set_b  # {1, 2, 3}

# Symmetric difference - elements in either but not both
sym_diff = set_a ^ set_b  # {1, 2, 3, 6, 7, 8}

# Remove duplicates from a list
unique_items = list(set(items_with_duplicates))
```

**List vs Generator for Large Data**

**Yes**

```python
# Generator - memory efficient for large data
def read_large_file(filename):
    with open(filename) as f:
        for line in f:  # Processes one line at a time
            yield line.strip()

# Only loads one line at a time
for line in read_large_file("huge_file.txt"):
    process(line)

# Generator expression
sum_of_squares = sum(x**2 for x in range(1000000))  # Memory efficient
```

**No**

```python
# List - loads everything into memory
def read_large_file(filename):
    with open(filename) as f:
        return [line.strip() for line in f]  # Loads entire file!

# Memory intensive
all_lines = read_large_file("huge_file.txt")
for line in all_lines:
    process(line)

# List comprehension - creates full list in memory
sum_of_squares = sum([x**2 for x in range(1000000)])  # Wasteful
```

_Rationale_: Using the right data structure improves performance dramatically. Sets and dicts offer O(1) lookups, while lists require O(n) searches. Generators save memory for large datasets.

#### Duck Typing and EAFP vs LBYL

Duck typing is a programming concept where the type or class of an object is determined by its behavior (methods and properties), rather than its explicit inheritance or type. The phrase "If it walks like a duck and quacks like a duck, it's a duck" means that if an object implements the necessary methods or behaviors, it can be used wherever those behaviors are expected—regardless of its actual type. This approach makes code more flexible and reusable, as it focuses on what an object can do, not what it is. Python also follows the philosophy of "Easier to Ask for Forgiveness than Permission" (EAFP) rather than "Look Before You Leap" (LBYL).

**EAFP - Pythonic Approach**

**Yes**

```python
# EAFP: Try the operation, handle exceptions if it fails
def get_user_age(user_dict):
    try:
        return user_dict["age"]
    except KeyError:
        return None

# Duck typing: "If it walks like a duck and quacks like a duck..."
def process_file(file_obj):
    # Don't check type - just use it like a file
    try:
        content = file_obj.read()
        return content.upper()
    except AttributeError:
        raise TypeError("Object must have a read() method")

# Works with any file-like object
from io import StringIO
process_file(open("file.txt"))  # Real file
process_file(StringIO("test"))  # String buffer - also works!

# EAFP with dict access
config = {"timeout": 30, "retries": 3}
try:
    timeout = config["timeout"]
    retries = config["retries"]
except KeyError as e:
    raise ValueError(f"Missing required config: {e}")
```

**No - LBYL (Look Before You Leap)**

```python
# LBYL: Check before you try (less Pythonic, race conditions)
def get_user_age(user_dict):
    if "age" in user_dict:  # Extra check
        return user_dict["age"]
    else:
        return None

# Type checking instead of duck typing (rigid)
def process_file(file_obj):
    if not isinstance(file_obj, io.IOBase):  # Too restrictive!
        raise TypeError("Must be a file object")
    content = file_obj.read()
    return content.upper()
# Now StringIO won't work, even though it has read()!

# Multiple checks (verbose and slower)
config = {"timeout": 30, "retries": 3}
if "timeout" in config and "retries" in config:
    timeout = config["timeout"]
    retries = config["retries"]
else:
    raise ValueError("Missing required config")
```

**More EAFP Examples**

```python
# Converting to int
# EAFP - Pythonic
try:
    value = int(user_input)
except ValueError:
    print("Invalid number")

# LBYL - Not Pythonic
if user_input.isdigit():
    value = int(user_input)
else:
    print("Invalid number")
# Problem: isdigit() doesn't handle negative numbers or floats

# File operations
# EAFP - Pythonic
try:
    with open("config.json") as f:
        config = json.load(f)
except FileNotFoundError:
    config = default_config()
except json.JSONDecodeError:
    print("Invalid JSON")

# LBYL - Less Pythonic
import os
if os.path.exists("config.json"):
    # Race condition: file could be deleted between check and open!
    with open("config.json") as f:
        config = json.load(f)
else:
    config = default_config()
```

**Duck Typing Benefits**

```python
# Functions work with any compatible type
def print_all(items):
    """Works with lists, tuples, sets, generators, etc."""
    for item in items:  # Just needs to be iterable
        print(item)

print_all([1, 2, 3])           # list
print_all((1, 2, 3))           # tuple
print_all({1, 2, 3})           # set
print_all(range(1, 4))         # range object
print_all(x for x in [1,2,3])  # generator

# Custom class works too if it implements __iter__
class MyCollection:
    def __init__(self, data):
        self.data = data

    def __iter__(self):
        return iter(self.data)

print_all(MyCollection([1, 2, 3]))  # Works!
```

_Rationale_: EAFP is more Pythonic, often faster (one operation vs check + operation), and handles edge cases better. Duck typing makes code more flexible and reusable by focusing on behavior rather than type.
