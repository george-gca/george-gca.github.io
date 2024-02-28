---
layout: post
title: Melhorando seu código Python com truques simples
date: 2023-01-25 13:28:15
description: Como usar funções da biblioteca padrão para melhorar seu código.
tags: programming code improvement python
categories: python
giscus_comments: true
related_posts: true
toc:
  sidebar: left
---

Nosso código às vezes está lento. Às vezes, está consumindo muita memória. Talvez não esteja tão legível quanto gostaríamos que fosse. Neste post, veremos como utilizar algumas funções da biblioteca padrão para melhorar o nosso código. Todo o código usado neste post [está disponível aqui](https://gist.github.com/george-gca/bea9d8c23a0932a22d6b1b80006629f4). Embora eu apresente apenas algumas funções que uso com frequência, há muitas mais que podem ser usadas para melhorar seu código. Encorajo você a verificar a [documentação oficial](https://docs.python.org/3/library/) para descobrir o que mais está disponível.

## Use [list comprehension](https://realpython.com/list-comprehension-python/) sempre que possível

### O que isso significa?

List comprehension é basicamente outra maneira de criar uma lista. Suponha que queremos criar uma lista de valores em um intervalo:

```python
# forma tradicional
tmp = []
for i in range(10_000_000):
  tmp.append(i)

# list comprehension
tmp = [i for i in range(10_000_000)]
```

### Por que isso importa?

List comprehension geralmente é muito mais rápido do que o loop tradicional. Vamos compará-los:

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

### Outros exemplos

#### Criando uma lista com uma condição `if`

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

#### Criando uma lista com uma condição `if else`

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

### A maneira mais rápida de criar uma lista

Ao gerar uma lista a partir de um gerador (`range` neste caso), é mais rápido usar o construtor `list()`.

```python
tmp = list(range(10_000_000))
```

Para validar isso, vamos comparar o código para 7 execuções, 10 loops cada:

|                                 |       loop       | list comprehension | construtor de lista |
| :-----------------------------: | :--------------: | :----------------: | :-----------------: |
| média ± desvio padrão. por loop | 1.04 s ± 89.8 ms |  731 ms ± 71.6 ms  |  301 ms ± 18.4 ms   |
|      incremento de memória      |    293.57 MiB    |     285.82 MiB     |      75.12 MiB      |

Por que o construtor `list()` é mais rápido? De acordo com [esta resposta no StackOverflow](https://stackoverflow.com/a/29356931):

> A list comprehension executa o loop em bytecode Python, como um loop for regular. A chamada list() itera inteiramente em código C, o que é muito mais rápido.

Para comparar todas essas soluções, vamos verificar os bytecodes equivalentes. Para o caso do loop:

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

Para a solução de list comprehension:

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

E para a solução do construtor de lista:

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

Podemos ver que o construtor `list()` gera menos bytecodes.

## Use geradores ([generators](https://realpython.com/introduction-to-python-generators/)) e iteradores ([iterators](https://docs.python.org/3/glossary.html#term-iterator)) sempre que possível

Para criar um gerador como uma list comprehension (chamada expressão geradora ou [generator expression](https://docs.python.org/3/glossary.html#index-20)), basta substituir os colchetes [ ] por parênteses ( ).

### Por que isso importa?

[Geradores](https://docs.python.org/3/glossary.html#index-19) parecem uma função normal, porém contém expressões `yield` para produzir uma série de valores utilizáveis em um loop for ou que podem ser recuperados um de cada vez com a função `next()`. Ele retorna um iterador de gerador ([generator iterator](https://docs.python.org/3/glossary.html#term-generator-iterator)), que suspende temporariamente o processamento, lembrando o estado local de execução (incluindo variáveis locais e instruções try pendentes).

Vamos fazer algumas comparações:

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

Não é tão diferente, certo? Agora, vamos verificar o consumo de memória. Vamos focar no incremento, pois ele representa a diferença de memória entre o início e o fim desta execução.

```txt
memory increment: 263.44 MiB
```

```txt
memory increment: 0.00 MiB
```

O que aconteceu? O gerador retorna apenas um elemento por vez, que por sua vez é fornecido à função sum. Dessa forma, não precisamos gerar previamente toda a lista para realizar a soma dos elementos. Na verdade, como a função [sum](https://docs.python.org/3/library/functions.html#sum) recebe um iterador como parâmetro, poderíamos usá-la assim:

```python
tmp = sum(i for i in range(10_000_000))
```

```txt
593 ms ± 90.4 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

Ou ainda assim:

```python
tmp = sum(range(10_000_000))
```

```txt
168 ms ± 4.68 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.00 MiB
```

Que executa bem mais rápido.

## Evite gerar todos os valores sempre que possível

Para os exemplos seguintes, suponha que temos uma lista ordenada de valores.

### O que fazer se quisermos apenas os valores inferiores a um limite?

A maneira utilizando list comprehension de conseguir isso é esta:

```python
tmp = [i for i in range(10_000_000) if i < 1_000_000]
```

```txt
596 ms ± 7.16 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.02 MiB
```

Agora, com loops:

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

Por que é mais rápido com loop?

Porque usando list comprehension toda a lista deve ser gerada antes de selecionar os elementos. O mesmo não acontece para o loop, que só percorre alguns dos valores.

### Podemos fazer melhor?

Sim, com [takewhile](https://docs.python.org/3/library/itertools.html#itertools.takewhile).

```python
from itertools import takewhile

tmp = list(takewhile(lambda x: x < 1_000_000, range(10_000_000)))
```

```txt
107 ms ± 2.37 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

---

Nota: `takewhile` só é mais rápido quando você sabe que a condição será satisfeita "em breve".

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

Nesse caso, é mais rápido gerar a lista inteira e depois filtrá-la. Mas observe que, embora usar list comprehension seja mais rápido, `takewhile` ocupa menos memória, pois não precisa armazenar a lista inteira, mesmo que momentaneamente.

### E se quisermos apenas os valores superiores a um limite?

Primeiro, vamos tentar com loops:

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

Agora, com list comprehension:

```python
tmp = [i for i in range(10_000_000) if i > 1_000_000]
```

```txt
978 ms ± 11.2 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 169.84 MiB
```

Neste caso, como o loop percorrerá todos os elementos, ele é mais lento que list comprehension. Porém, ocupa menos memória, pois não precisa armazenar toda a lista.

### Podemos fazer melhor?

Sim, com [dropwhile](https://docs.python.org/3/library/itertools.html#itertools.dropwhile)

```python
from itertools import dropwhile

tmp = list(dropwhile(lambda x: x < 1_000_000, range(10_000_000)))
```

```txt
442 ms ± 10.2 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.05 MiB
```

---

Nota: `dropwhile` também só é mais rápido quando você sabe que a condição será satisfeita "em breve".

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

### E quando queremos obter as primeiras N amostras?

Com loops:

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

Fazendo com list comprehension:

```python
tmp = [i for i in range(10_000_000)][:1_000_000]
```

```txt
523 ms ± 10.8 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

Por que é mais rápido com loops?

Porque usando list comprehension toda a lista deve ser gerada antes de fazer a operação de seleção. O mesmo não é verdade para o loop, que só percorre alguns dos valores.

### Podemos fazer melhor?

Sim, com [islice](https://docs.python.org/3/library/itertools.html#itertools.islice)

```python
from itertools import islice

tmp = list(islice((i for i in range(10_000_000)), 1_000_000))
```

```txt
72.5 ms ± 1.82 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
memory increment: 0.01 MiB
```

### E quando queremos obter as últimas N amostras?

Podemos obter o mesmo resultado com `islice`. Vamos direto às comparações:

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

Observe novamente que, assim como aconteceu no caso do `dropwhile` quando a condição demora mais para ser satisfeita, usar `islice` é mais lento do que fazer com list comprehension, porém ocupa muito menos memória.

### E se quisermos apenas contar o número de elementos que serão gerados?

Suponha que queremos saber quantos elementos serão gerados a partir de uma condição. Normalmente, faríamos assim:

```python
tmp = [i for i in range(value) if i % 2 == 0]
count = len(tmp)
```

```txt
1.02 s ± 63.6 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
increment: 0.04 MiB
```

Mas o problema é que estamos armazenando uma lista inteira na memória apenas para obter seu tamanho.

### Podemos fazer melhor?

Sim, criando um gerador que gere `1` toda vez que a condição for verdadeira, e somando tudo.

```python
count = sum(1 for i in range(value) if i % 2 == 0)
```

```txt
991 ms ± 18.9 ms per loop (mean ± std. dev. of 7 runs, 10 loops each)
increment: 0.00 MiB
```

## Outras funções úteis de [itertools](https://docs.python.org/3/library/itertools.html?highlight=itertools#module-itertools)

Já introduzimos 3 das funções mais úteis: `dropwhile`, `islice` e `takewhile`. Vamos verificar outras funções úteis.

### [cycle](https://docs.python.org/3/library/itertools.html?highlight=itertools#itertools.cycle)

Repete indefinidamente uma determinada sequência.

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

Repete indefinidamente um determinado valor, a menos que o argumento `times` seja especificado.

```python
from itertools import repeat

tmp = list(repeat(10, 5))
print(tmp)
```

```txt
[10, 10, 10, 10, 10]
```

### [product](https://docs.python.org/3/library/itertools.html?highlight=itertools#itertools.product)

Equivalente a um loop for aninhado.

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

Como neste caso estamos usando a mesma sequência para todos os loops, podemos usar `repeat` para simplificar o código:

```python
from itertools import product

tmp = [sum(i) for i in product(range(2), repeat=4)]
print(tmp)
```

```txt
[0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]
```

### [itertools](https://docs.python.org/3/library/itertools.html?highlight=itertools#module-itertools) tem todas as funções combinatórias implementadas

| arranjo | permutação | combinação com repetição | combinação |
| :-----: | :--------: | :----------------------: | :--------: |
|   AA    |            |            AA            |            |
|   AB    |     AB     |            AB            |     AB     |
|   AC    |     AC     |            AC            |     AC     |
|   AD    |     AD     |            AD            |     AD     |
|   BA    |     BA     |                          |            |
|   BB    |            |            BB            |            |
|   BC    |     BC     |            BC            |     BC     |
|   BD    |     BD     |            BD            |     BD     |
|   CA    |     CA     |                          |            |
|   CB    |     CB     |                          |            |
|   CC    |            |            CC            |            |
|   CD    |     CD     |            CD            |     CD     |
|   DA    |     DA     |                          |            |
|   DB    |     DB     |                          |            |
|   DC    |     DC     |                          |            |
|   DD    |            |            DD            |            |

## Melhorando o código com [functools](https://docs.python.org/3/library/functools.html?highlight=functools#module-functools)

### Armazenando chamadas de função com [lru_cache](https://docs.python.org/3/library/functools.html#functools.lru_cache)

Vamos pegar a função de Fibonacci, por exemplo, que chama a si mesma recursivamente.

```python
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

Vamos usá-la em uma list comprehension para obter os primeiros 16 números de Fibonacci:

```python
tmp = [fib(i) for i in range(16)]
```

```txt
698 µs ± 152 µs per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

Leva um bom tempo para executar para um número pequeno. Mas e se pudéssemos salvar automaticamente os resultados das chamadas anteriores à função? É disso que se trata a `lru_cache`. Ela armazena chamadas anteriores, com seus parâmetros fornecidos e saída calculada, como uma cache que remove os elementos menos recentemente usados (cache LRU). Dessa forma, sempre que chamarmos a função e essa chamada já tiver sido feita (e seus resultados ainda estiverem armazenados na cache), simplesmente pegamos os resultados da cache.

```python
from functools import lru_cache

@lru_cache
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)
```

Vamos tentar novamente:

```python
tmp = [fib(i) for i in range(16)]
```

```txt
3.34 µs ± 719 ns per loop (mean ± std. dev. of 7 runs, 10 loops each)
```

Agora, vamos verificar as informações da cache:

- hits: número de vezes que a função foi chamada e os resultados já estavam lá;
- misses: número de vezes que a função foi chamada e o resultado não estava armazenado;
- maxsize: tamanho máximo permitido para a cache;
- currsize: tamanho atual da cache (resultados armazenados).

```python
print(fib.cache_info())
```

```txt
CacheInfo(hits=1132, misses=16, maxsize=128, currsize=16)
```

### Criando funções com valores padrões com [partial](https://docs.python.org/3/library/functools.html#functools.partial)

Suponha que temos uma função chamada `divide_by` que realiza a divisão. É uma função bastante genérica, mas geralmente é chamada com alguns valores específicos, como divisão por dois ou por três.

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

E se, em vez de criar uma função totalmente nova, pudéssemos apenas criar assinaturas diferentes para a função, uma para cada valor mais comum de y? É para isso que serve `partial`:

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
