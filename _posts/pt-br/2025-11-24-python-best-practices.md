---
layout: post
title: Um guia abrangente de boas práticas em Python
date: 2025-11-24 23:44:15
description: De estilo de código e recursos modernos a como aproveitar a biblioteca padrão e os principais padrões para escrever código Python limpo e eficiente.
tags: programming code improvement python
categories: python
giscus_comments: true
related_posts: true
toc:
  sidebar: left
---

Um guia de boas práticas para desenvolver em Python. Inspirado pelo [gist de Rui Maranhao](https://gist.github.com/ruimaranhao/4e18cbe3dad6f68040c32ed6709090a3).

## Em geral

> "O belo é melhor que o feio." - [PEP 20](https://peps.python.org/pep-0020/)

### Diretrizes gerais de desenvolvimento

#### "Explícito é melhor que implícito" - [PEP 20](https://peps.python.org/pep-0020/)

**Sim**

```python
def process_data(data, encoding='utf-8', timeout=30):
    """Processa dados com parâmetros explícitos."""
    # Parâmetros são claros e visíveis
    return data.decode(encoding)
```

**Não**

```python
def process_data(data):
    """Processa dados com valores ocultos."""
    # Valores mágicos escondidos na função
    return data.decode('utf-8')  # Qual encoding? Por quê?
```

#### "Legibilidade conta." - [PEP 20](https://peps.python.org/pep-0020/)

**Sim**

```python
def calculate_total_price(items, tax_rate):
    subtotal = sum(item.price for item in items)
    tax = subtotal * tax_rate
    total = subtotal + tax
    return total
```

**Não**

```python
def calc(i, t):
    return sum(x.p for x in i) * (1 + t)
```

#### "Qualquer pessoa pode corrigir qualquer coisa."

Não crie barreiras artificiais ou "propriedade" do código. Se você encontrar um bug ou uma oportunidade de melhoria em qualquer parte do código, corrija.

> Este princípio vem da filosofia de desenvolvimento da Khan Academy.

**Sim**

- Viu um erro de digitação no módulo de outra pessoa? Corrija.
- Encontrou um bug no código de outro time? Envie uma correção.
- Notou documentação desatualizada? Atualize.

**Não**

- "Esse não é meu módulo, não vou mexer."
- "Vou contornar esse bug no código deles."
- Deixar código quebrado para o "dono" corrigir.

#### Corrija cada problema (má decisão de design, decisão errada ou código ruim) assim que for descoberto.

**Sim**

```python
# Você percebe durante a revisão de código que uma função faz demais.
# Refatore imediatamente:

def process_user_data(user):
    validate_user(user)
    save_to_database(user)
    send_welcome_email(user)
```

**Não**

```python
# Você percebe o problema mas adiciona um comentário TODO:

def process_user_data(user):
    # TODO: Esta função faz demais, deveria ser refatorada
    validate_user(user)
    save_to_database(user)
    send_welcome_email(user)
    # TODO provavelmente nunca será resolvido
```

#### "Agora é melhor que nunca." - [PEP 20](https://peps.python.org/pep-0020/)

Não espere pela solução "perfeita". Implemente código funcional, depois itere.

**Sim**

- Implemente uma funcionalidade básica, publique, obtenha feedback, melhore.
- Escreva testes simples agora ao invés de esperar para desenhar a suíte de testes perfeita.

**Não**

- Debater infinitamente a arquitetura ideal sem escrever código.
- Esperar meses para publicar porque quer tratar todos os casos extremos.

#### Teste sem piedade. Escreva documentação para novas funcionalidades.

**Sim**

```python
def divide(a, b):
    """Divide a por b.

    :param a: Numerador
    :param b: Denominador (deve ser diferente de zero)
    :returns: Resultado de a / b
    :raises ValueError: Se b for zero
    """
    if b == 0:
        raise ValueError("Não é possível dividir por zero")
    return a / b

# E testes correspondentes:
class TestDivide(unittest.TestCase):
    def test_divide_positive_numbers(self):
        self.assertEqual(divide(10, 2), 5)

    def test_divide_by_zero_raises_error(self):
        with self.assertRaises(ValueError):
            divide(10, 0)
```

**Não**

```python
def divide(a, b):
    return a / b  # Sem docs, sem testes, vai quebrar com zero
```

#### Mais importante que Desenvolvimento Orientado a Testes -- Desenvolvimento Orientado a Humanos

Escreva código para humanos primeiro, máquinas depois.

**Sim**

```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, item):
        """Adiciona um item ao carrinho."""
        self.items.append(item)

    def get_total(self):
        """Calcula o preço total de todos os itens."""
        return sum(item.price for item in self.items)
```

**Não**

```python
class SC:
    def __init__(self):
        self.i = []

    def a(self, x):
        self.i.append(x)

    def t(self):
        return sum(z.p for z in self.i)
```

#### Essas diretrizes podem -- e provavelmente vão -- mudar.

Seja flexível e aberto a melhorar práticas conforme aprende e conforme o campo evolui. O que funciona hoje pode não ser a melhor abordagem amanhã.

## Em particular

### Estilo

Siga o [PEP 8](https://peps.python.org/pep-0008/), quando fizer sentido.

#### Nomenclatura

- Variáveis, funções, métodos, pacotes, módulos
  - `lower_case_with_underscores`
- Classes e Exceções
  - `CapWords`
- Métodos protegidos e funções internas
  - `_single_leading_underscore(self, ...)`
  - _Nota_: Começar com underscores ajudam IDEs a identificar membros protegidos/privados e podem causar avisos de "não usado" para helpers internos
- Métodos privados
  - `__double_leading_underscore(self, ...)`
- Constantes
  - `ALL_CAPS_WITH_UNDERSCORES`

**Sobre prefixos com underscore:**

Usar prefixo `_` para funções protegidas/privadas ajuda IDEs e linters a entender sua intenção:

```python
# mymodule.py

def _internal_helper(data):
    """Função interna - não faz parte da API pública."""
    return data.strip().lower()

def public_function(text):
    """Função da API pública."""
    return _internal_helper(text)

# IDE vai avisar que _internal_helper está "não usada" se não for chamada internamente
# IDE vai marcar como protegida/interna na navegação de código
```

_Racional_: IDEs como PyCharm e VS Code usam o prefixo underscore para:

- Ativar avisos de "código não usado" para helpers internos
- Indicar que essas funções não devem ser importadas com `from module import *`
- Mostrar ícones/cores diferentes na navegação para distinguir APIs públicas de internas

##### Diretrizes gerais de nomenclatura

Evite variáveis de uma letra (especialmente `l`, `O`, `I`).

_Exceção_: Em blocos muito curtos, quando o significado é claramente visível pelo contexto imediato

**Ok**

```python
for e in elements:
    e.mutate()
```

Evite nomes redundantes.

**Sim**

```python
import audio

core = audio.Core()
controller = audio.Controller()
```

**Não**

```python
import audio
from audio import *

core = audio.AudioCore()
controller = audio.AudioController()
```

Prefira "notação reversa".

**Sim**

```python
elements = ...
elements_active = ...
elements_defunct = ...
```

**Não**

```python
elements = ...
active_elements = ...
defunct_elements ...
```

Evite reutilizar o mesmo nome de variável para propósitos diferentes.

**Sim**

```python
# Cada variável tem um propósito único e claro
user_input = input("Digite um número: ")
user_number = int(user_input)
squared_number = user_number ** 2
print(f"Resultado: {squared_number}")
```

```python
# Processando diferentes tipos de dados
raw_data = fetch_data_from_api()
processed_data = clean_data(raw_data)
validated_data = validate_data(processed_data)
```

**Não**

```python
# 'data' significa algo diferente a cada vez
data = input("Digite um número: ")  # data é string
data = int(data)                    # agora é int
data = data ** 2                    # agora é o resultado ao quadrado
print(f"Resultado: {data}")         # confuso!
```

```python
# Reutilizando 'result' para coisas não relacionadas
result = calculate_tax(price)
save_to_database(result)
result = send_email(user)  # agora result é outra coisa
result = validate_input(form)  # e agora outra ainda
```

_Racional_: Reutilizar nomes de variáveis dificulta depuração, entendimento e manutenção. Cada variável deve representar um conceito durante todo seu escopo.

#### Indentação

Fica a seu critério, mas seja consistente. [É isso](https://thenewstack.io/spaces-vs-tabs-a-20-year-debate-and-now-this-what-the-hell-is-wrong-with-go/).

{% include figure.liquid loading="eager" path="https://media.giphy.com/media/l0IylSajlbPRFxH8Y/giphy.gif" class="img-fluid rounded z-depth-1" %}

No entanto, note: Um tab pode ter um número diferente de colunas dependendo do seu ambiente, mas um espaço é sempre uma coluna. O mais importante é ser consistente em todo o seu código, não usar um valor específico de tabulação.

#### Comparação de igualdade

Evite comparar com `True`, `False` ou `None`.

**Sim**

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

**Não**

```python
if attr == True:
    print('True!')

if attr == False:
    print('False!')

if attr == None:
    print('None')
```

#### List comprehensions

Use list comprehensions sempre que possível.

**Sim**

```python
a = [3, 4, 5]
b = [i for i in a if i > 4]

# Ou (filter neste caso; map pode ser mais apropriado em outros casos)
b = filter(lambda x: x > 4, a)
```

**Não**

```python
a = [3, 4, 5]
b = []
for i in a:
    if i > 4:
        b.append(i)
```

#### Palavra-chave `with` e arquivos

A instrução `with` garante que o código de limpeza seja executado. Ao abrir um arquivo, `with` garante que o arquivo será fechado após o bloco.

**Sim**

```python
with open('file.txt') as f:
    do_something_with_f
```

**Não**

```python
f = open('file.txt')
do_something_with_f
f.close()
```

#### Imports

Importe módulos inteiros ao invés de símbolos individuais. Por exemplo, para um módulo de topo `canteen` que tem um arquivo `canteen/sessions.py`:

**Sim**

```python
import canteen
import canteen.sessions
from canteen import sessions
```

**Não**

```python
from canteen import get_user  # Símbolo de canteen/__init__.py
from canteen.sessions import get_session  # Símbolo de canteen/sessions.py
```

_Exceção_: Para código de terceiros onde a documentação diz explicitamente para importar símbolos individuais.

_Racional_: Evita imports circulares. Veja [aqui](https://stackabuse.com/python-circular-imports/).

Coloque todos os imports no topo do arquivo em três seções, cada uma separada por uma linha em branco, nesta ordem:

1. Imports do sistema
2. Imports de terceiros
3. Imports do projeto local

_Racional_: Fica claro de onde cada módulo está vindo.

#### Documentação

Siga as diretrizes de docstring do [PEP 257](https://peps.python.org/pep-0257/). [reStructured Text](http://docutils.sourceforge.net/docs/user/rst/quickref.html) e [Sphinx](http://sphinx-doc.org/) podem ajudar a reforçar esses padrões.

Quando possível, use docstrings de uma linha para funções óbvias.

```python
"""Retorna o caminho de ``foo``."""
```

Docstrings multilinha devem incluir:

- Linha de resumo
- Caso de uso, se apropriado
- Argumentos
- Tipo de retorno e semântica, a menos que retorne `None`

```python
"""Treina um modelo para classificar Foos e Bars.

Uso::

    >>> import klassify
    >>> data = [("green", "foo"), ("orange", "bar")]
    >>> classifier = klassify.train(data)

:param train_data: Uma lista de tuplas no formato ``(color, label)``.
:rtype: Um :class:`Classifier <Classifier>`
"""
```

Notas

- Use verbos de ação ("Retorna") ao invés de descrições ("Retorno").
- Documente métodos `__init__` na docstring da classe.

```python
class Person(object):
    """Uma representação simples de um ser humano.

    :param name: String, nome da pessoa.
    :param age: Int, idade da pessoa.
    """
    def __init__(self, name, age):
        self.name = name
        self.age = age
```

##### Formatos alternativos de docstring

Além do reStructuredText (reST), há outros estilos populares de docstring na comunidade Python. Escolha um e seja consistente no projeto.

**Estilo NumPy/SciPy**

Popular em computação científica, mais legível para funções complexas com muitos parâmetros.

```python
def calculate_statistics(data, weights=None, ddof=0):
    """
    Calcula média e desvio padrão dos dados.

    Parâmetros
    ----------
    data : array_like
        Array de dados de entrada.
    weights : array_like, opcional
        Pesos para cada valor em data. Padrão é None.
    ddof : int, opcional
        Delta dos graus de liberdade. Padrão é 0.

    Retorno
    -------
    mean : float
        Média aritmética dos dados.
    std : float
        Desvio padrão dos dados.

    Exceções
    --------
    ValueError
        Se data estiver vazio.

    Exemplos
    --------
    >>> calculate_statistics([1, 2, 3, 4, 5])
    (3.0, 1.4142135623730951)
    """
    pass
```

**Estilo Google**

Limpo e legível, popular em muitos projetos open-source.

```python
def calculate_statistics(data, weights=None, ddof=0):
    """Calcula média e desvio padrão dos dados.

    Args:
        data (array_like): Array de dados de entrada.
        weights (array_like, opcional): Pesos para cada valor em data. Padrão é None.
        ddof (int, opcional): Delta dos graus de liberdade. Padrão é 0.

    Retorna:
        tuple: Uma tupla contendo:
            - mean (float): Média aritmética dos dados.
            - std (float): Desvio padrão dos dados.

    Exceções:
        ValueError: Se data estiver vazio.

    Exemplos:
        >>> calculate_statistics([1, 2, 3, 4, 5])
        (3.0, 1.4142135623730951)
    """
    pass
```

**Comparação**

| Estilo                   | Melhor para                                   | Ferramentas                      |
| ------------------------ | --------------------------------------------- | -------------------------------- |
| **reStructuredText**     | Projetos Python gerais, documentação Sphinx   | Sphinx, maioria das IDEs         |
| **NumPy/SciPy**          | Computação científica, projetos de dados      | Sphinx com extensão Napoleon     |
| **Google**               | Docs limpas, projetos estilo Google           | Sphinx com extensão Napoleon     |

**Ferramentas de Geração de Documentação**

Além do Sphinx, várias outras ferramentas podem gerar documentação a partir de suas docstrings:

| Ferramenta | Características | Melhor para |
| --- | --- | --- |
| **[pdoc](https://pdoc.dev/)** | Docs HTML minimalistas e limpas; gera automaticamente de docstrings; ótimo para pequenos projetos | Documentação rápida sem configuração |
| **[MkDocs](https://www.mkdocs.org/)** com [mkdocstrings](https://mkdocstrings.github.io/) | Tema Material Design moderno; baseado em Markdown; integra docstrings | Documentação bonita e moderna do projeto |
| **[Pydoc](https://docs.python.org/3/library/pydoc.html)** | Ferramenta Python nativa; mínima configuração; gera HTML ou docs de terminal | Projetos simples; documentação sem dependências |
| **[Quartodoc](https://machow.github.io/quartodoc/)** | Conecta Quarto e Python; suporta múltiplos formatos de docstring | Projetos de data science; integrando código com narrativas |
| **[ReadTheDocs](https://readthedocs.org/)** | Hospedagem gratuita; integra com Sphinx; compilação automática do GitHub | Projetos open-source que precisam de documentação hospedada |
| **[Griffe](https://mkdocstrings.github.io/griffe/)** | Parser de doc Python moderno; suporta múltiplos formatos; amigável a async | Projetos que requerem extração flexível de docstrings |

**Pontos-chave**

- **Seja consistente**: Escolha um estilo e use em todo o projeto
- **Suporte de ferramentas**: Maioria dos geradores suportam múltiplos formatos de docstring
- **Preferência do time**: Siga a convenção do projeto ou equipe
- **Legibilidade**: NumPy e Google são mais legíveis para funções complexas
- **Integração**: Considere quais ferramentas se integram com sua plataforma de CI/CD e hospedagem

##### Sobre comentários

Use com moderação. Prefira legibilidade do código a muitos comentários. Muitas vezes, métodos pequenos são mais eficazes que comentários.

_Não_

```python
# Se o sinal for de parada
if sign.color == 'red' and sign.sides == 8:
    stop()
```

_Sim_

```python
def is_stop_sign(sign):
    return sign.color == 'red' and sign.sides == 8

if is_stop_sign(sign):
    stop()
```

Ao escrever comentários, lembre-se: "Strunk e White" se aplicam. - [PEP 8](https://peps.python.org/pep-0008/)

Resumindo:

> Use linguagem clara e direta e evite palavras desnecessárias para garantir o entendimento do leitor, como recomendado por Strunk e White.

#### Comprimento de linhas

Não se preocupe demais. 80-100 caracteres está ótimo. Temos telas largas hoje em dia.

Use parênteses para continuar linhas.

```python
wiki = (
    "The Colt Python is a .357 Magnum caliber revolver formerly manufactured "
    "by Colt's Manufacturing Company of Hartford, Connecticut. It is sometimes "
    'referred to as a "Combat Magnum". It was first introduced in 1955, the '
    "same year as Smith & Wesson's M29 .44 Magnum."
)
```

#### Formatação de strings

Use f-strings (literais formatados) para formatar strings. São mais legíveis, concisas e rápidas que métodos antigos.

**Sim**

```python
name = "Alice"
age = 30
city = "Lisboa"

# Interpolação simples de variável
message = f"Olá, {name}!"

# Expressões dentro de f-strings
info = f"{name} tem {age} anos e mora em {city}."

# Formatando números
price = 19.99
quantity = 3
total = f"Total: €{price * quantity:.2f}"  # Total: €59.97

# f-string multi-linha
report = (
    f"Relatório do usuário:\n"
    f"  Nome: {name}\n"
    f"  Idade: {age}\n"
    f"  Cidade: {city}"
)
```

**Não**

```python
name = "Alice"
age = 30
city = "Lisboa"

# Formatação estilo % (evite)
message = "Olá, %s!" % name
info = "%s tem %d anos e mora em %s." % (name, age, city)

# Método str.format() (verboso)
message = "Olá, {}!".format(name)
info = "{} tem {} anos e mora em {}.".format(name, age, city)

# Concatenação de strings (propenso a erros e difícil de ler)
message = "Olá, " + name + "!"
info = name + " tem " + str(age) + " anos e mora em " + city + "."
```

_Racional_: F-strings (Python 3.6+) são mais rápidas, legíveis e menos propensas a erro que `%` ou `.format()`. Permitem expressões diretamente na string e tornam a intenção do código mais clara.

**Recursos avançados de f-string**

```python
# Debug com f-strings (Python 3.8+)
x = 10
y = 20
print(f"{x=}, {y=}, {x+y=}")  # x=10, y=20, x+y=30

# Chamando funções
def get_status():
    return "ativo"

status_msg = f"Sistema está {get_status()}"
```

**Formatando números com f-strings**

```python
# Formatar float com 2 casas decimais
price = 19.98765
formatted_price = f"{price:.2f}"  # '19.99'

# Inteiro com zeros à esquerda (ex: 4 dígitos)
order_number = 42
formatted_order = f"{order_number:04d}"  # '0042'

# Alinhar uma string à direita com espaços usando f-strings
texto = "Python"
largura = 12
alinhado_direita = f"{texto:>{largura}}"
print(f"'{alinhado_direita}'")  # Saída: '      Python'

# Ou, para alinhamento à esquerda (para comparação):
alinhado_esquerda = f"{texto:<{largura}}"
print(f"'{alinhado_esquerda}'")  # Saída: 'Python      '

# Porcentagem com 1 casa decimal
success_rate = 0.857
formatted_rate = f"{success_rate:.1%}"  # '85.7%'

# Números grandes com vírgulas
population = 1234567
formatted_population = f"{population:,}"  # '1,234,567'

# Números grandes com agrupamento por localidade usando `:n`
import locale
locale.setlocale(locale.LC_ALL, '')  # Define para o local padrão do usuário
large_number = 1234567.89
formatted_number = f"{large_number:n}"  # Ex: '1.234.567,89' ou '1,234,567.89'
```

#### Type Hints (Dicas de Tipo)

Use dicas de tipo para tornar o código mais legível e fácil de manter. Elas ajudam IDEs a fornecer autocompletar, detectar erros cedo e servem como documentação inline.

**Sim**

```python
def calculate_total(price: float, quantity: int) -> float:
    """Calcula o preço total dos itens."""
    return price * quantity

def greet(name: str) -> str:
    """Retorna uma mensagem de saudação."""
    return f"Olá, {name}!"

def process_items(items: list[str]) -> dict[str, int]:
    """Conta ocorrências de cada item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts
```

**Não**

```python
def calculate_total(price, quantity):
    """Calcula o preço total dos itens."""
    return price * quantity  # Quais tipos? Vai funcionar com qualquer entrada?

def greet(name):
    """Retorna uma mensagem de saudação."""
    return f"Olá, {name}!"  # name é sempre string?

def process_items(items):
    """Conta ocorrências de cada item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts  # O que retorna?
```

_Racional_: Dicas de tipo melhoram clareza, permitem melhor suporte de IDE (autocomplete, refatoração, detecção de erros) e ajudam a encontrar bugs antes da execução. IDEs modernas como VS Code e PyCharm usam type hints para sugestões inteligentes e avisos.

**Dicas de tipo modernas (Python 3.9+)**

A partir do Python 3.9, você pode usar tipos embutidos diretamente ao invés de importar do `typing`. O Python 3.10+ também introduz o operador `|` para tipos união.

**Sim** (Python 3.10+)

```python
# Use tipos embutidos com [] (Python 3.9+)
def process_items(items: list[str]) -> dict[str, int]:
    """Conta ocorrências de cada item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts

# Use operador | para uniões (Python 3.10+)
def find_user(user_id: int) -> str | None:
    """Busca usuário por ID, retorna None se não encontrar."""
    if user_id > 0:
        return "Alice"
    return None

def process_id(id_value: int | str) -> str:
    """Processa ID que pode ser int ou string."""
    return str(id_value)

# Múltiplos tipos união
def parse_config(value: str | int | float | None) -> str:
    """Processa valor de configuração."""
    return str(value) if value is not None else ""
```

**Estilo antigo** (Python 3.5-3.8)

```python
from typing import Optional, Union, List, Dict

# Era necessário importar e usar tipos genéricos com letra maiúscula
def process_items(items: List[str]) -> Dict[str, int]:
    """Conta ocorrências de cada item."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts

# Usava Optional e Union do módulo typing
def find_user(user_id: int) -> Optional[str]:
    """Busca usuário por ID, retorna None se não encontrar."""
    if user_id > 0:
        return "Alice"
    return None

def process_id(id_value: Union[int, str]) -> str:
    """Processa ID que pode ser int ou string."""
    return str(id_value)
```

_Nota_: Se estiver usando Python 3.10 ou superior, prefira a sintaxe moderna com `|` e tipos embutidos (`list`, `dict`, `set`, `tuple`). Para Python 3.9, use tipos embutidos com `[]` mas continue usando `Optional` e `Union` do typing. O estilo antigo com `List`, `Dict` etc. do typing está depreciado, mas ainda funciona.

**Mais exemplos de type hints**

```python
from typing import Any, Callable

# Dicas de tipo em classes
class User:
    def __init__(self, name: str, age: int) -> None:
        self.name: str = name
        self.age: int = age

    def get_info(self) -> dict[str, Any]:
        """Retorna informações do usuário."""
        return {"name": self.name, "age": self.age}

# Dicas de tipo para funções
def apply_operation(x: int, operation: Callable[[int], int]) -> int:
    """Aplica uma função a um número."""
    return operation(x)

# Alias de tipo para tipos complexos
UserId = int
UserData = dict[str, str | int]  # Python 3.10+
# Ou para versões antigas: dict[str, Union[str, int]]

def get_user_data(user_id: UserId) -> UserData:
    """Obtém dados do usuário pelo ID."""
    return {"name": "Alice", "age": 30}
```

**Benefícios para IDE e assistentes de IA**

Com type hints, sua IDE e assistentes de código podem:

- **Autocomplete**: Sugerir métodos e atributos baseado no tipo
- **Detecção de erros**: Avisar ao passar tipos errados antes de rodar
- **Refatoração**: Renomear variáveis e funções com segurança
- **Documentação**: Mostrar tipos nos parâmetros sem ler documentação
- **Assistência de IA**: GitHub Copilot, Codeium e outros sugerem melhor quando entendem seus tipos

```python
# IDE sabe que 'result' é float, sugere métodos de float
result: float = calculate_total(19.99, 3)
result.is_integer()  # IDE sugere este método

# IDE avisa se passar tipos errados
calculate_total("19.99", "3")  # IDE mostra aviso: esperado float e int

# Assistentes de IA sugerem melhor com type hints
def process_users(users: list[dict[str, str]]) -> list[str]:
    # IA sabe que 'users' é lista de dicionários, sugere operações apropriadas
    # IA sabe que retorno deve ser lista de strings
    return [user["name"] for user in users]  # IA sugere corretamente
```

_Nota_: Assistentes de IA como GitHub Copilot usam type hints para entender a intenção do código e sugerir de forma mais precisa e contextual. Código bem tipado recebe melhor assistência.

#### Aproveite a biblioteca padrão

A biblioteca padrão do Python é extensa e bem testada. Antes de escrever soluções customizadas ou instalar pacotes de terceiros, verifique se a biblioteca padrão já oferece o que você precisa. Conhecer os módulos comuns vai te tornar um programador Python mais eficiente.

##### collections - Tipos de containers especializados

O módulo `collections` oferece alternativas aos containers da linguagem com funcionalidades extras.

**Counter - Contador de objetos hashable**

**Sim**

```python
from collections import Counter

# Conta ocorrências em uma lista
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
word_counts = Counter(words)
print(word_counts)  # Counter({'apple': 3, 'banana': 2, 'orange': 1})

# Obtém os itens mais comuns
print(word_counts.most_common(2))  # [('apple', 3), ('banana', 2)]

# Combina contadores
more_words = ["apple", "grape"]
word_counts.update(more_words)
```

**Não**

```python
# Contando manualmente (verboso e propenso a erro)
words = ["apple", "banana", "apple", "orange", "banana", "apple"]
word_counts = {}
for word in words:
    if word in word_counts:
        word_counts[word] += 1
    else:
        word_counts[word] = 1
```

**defaultdict - Dicionário com valores padrão**

```python
from collections import defaultdict

# Agrupa itens por categoria
items = [("fruta", "maçã"), ("fruta", "banana"), ("legume", "cenoura")]
grouped = defaultdict(list)
for category, item in items:
    grouped[category].append(item)
# {'fruta': ['maçã', 'banana'], 'legume': ['cenoura']}
```

##### functools - Funções de ordem superior

**partial - Aplicação parcial de função**

**Sim**

```python
from functools import partial

def power(base: int, exponent: int) -> int:
    """Eleva base à potência de exponent."""
    return base ** exponent

# Cria funções especializadas
square = partial(power, exponent=2)
cube = partial(power, exponent=3)

print(square(5))  # 25
print(cube(5))    # 125
```

**Não**

```python
# Criando funções wrapper manualmente
def power(base: int, exponent: int) -> int:
    """Eleva base à potência de exponent."""
    return base ** exponent

def square(base: int) -> int:
    return power(base, 2)

def cube(base: int) -> int:
    return power(base, 3)
```

**lru_cache - Decorador de memoização**

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    """Calcula o n-ésimo número de Fibonacci com cache."""
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Muito mais rápido para chamadas repetidas
print(fibonacci(100))  # Calculado instantaneamente devido ao cache
```

##### itertools - Ferramentas para iteradores

**chain - Combina múltiplos iteráveis**

```python
from itertools import chain

# Combina múltiplas listas em uma
lista1 = [1, 2, 3]
lista2 = [4, 5, 6]
combinada = list(chain(lista1, lista2))  # [1, 2, 3, 4, 5, 6]
```

**combinations - Todas as combinações de itens**

```python
from itertools import combinations

# Obtém todas as combinações de 2 itens
itens = ['A', 'B', 'C']
combos = list(combinations(itens, 2))
# [('A', 'B'), ('A', 'C'), ('B', 'C')]
```

Para mais funções de combinatória, consulte a [documentação oficial do Python](https://docs.python.org/pt-br/3/library/itertools.html).

**groupby - Agrupa itens consecutivos**

```python
from itertools import groupby

# Agrupa itens consecutivos por uma chave
dados = [('A', 1), ('A', 2), ('B', 1), ('B', 2), ('A', 3)]
for chave, grupo in groupby(dados, key=lambda x: x[0]):
    print(f"{chave}: {list(grupo)}")
# A: [('A', 1), ('A', 2)]
# B: [('B', 1), ('B', 2)]
# A: [('A', 3)]
```

**islice - Fatia um iterador**

```python
from itertools import islice

# Obtém itens de um iterador sem carregar tudo na memória
def gera_numeros():
    n = 0
    while True:
        yield n
        n += 1

# Obtém os primeiros 10 números pares
pares = (x for x in gera_numeros() if x % 2 == 0)
primeiros_dez_pares = list(islice(pares, 10))  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

##### pathlib - Manipulação orientada a objetos de caminhos

**Sim**

```python
from pathlib import Path

# Operações modernas e legíveis com caminhos
projeto = Path("/home/usuario/projeto")
arquivo_config = projeto / "config" / "settings.json"

if arquivo_config.exists():
    conteudo = arquivo_config.read_text()

# Lista todos os arquivos Python
arquivos_py = list(projeto.glob("**/*.py"))
```

**Não**

```python
import os

# Manipulação de strings antiga
projeto = "/home/usuario/projeto"
arquivo_config = os.path.join(projeto, "config", "settings.json")

if os.path.exists(arquivo_config):
    with open(arquivo_config, 'r') as f:
        conteudo = f.read()
```

##### dataclasses - Reduz o boilerplate de classes

**Sim** (Python 3.7+)

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

**Não**

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

_Racional_: A biblioteca padrão é bem documentada, testada e não exige dependências extras. Aprender esses módulos te ajuda a escrever código mais conciso, eficiente e idiomático.

### Recursos Modernos do Python

O Python continua a evoluir com cada versão, introduzindo novas sintaxes e recursos que tornam o código mais legível e conciso. Aqui estão algumas adições significativas das versões recentes do Python.

#### Expressões de atribuição (Walrus Operator) - Python 3.8+

O operador walrus (morsa do inglês) `:=` permite atribuir valores a variáveis como parte de uma expressão. Útil em condições e loops.

**Sim**

```python
# Atribuir e usar em uma linha
if (n := len(dados)) > 10:
    print(f"A lista é muito longa ({n} elementos, esperado <= 10)")

# Evita chamadas redundantes em while loops
while (linha := arquivo.readline()) != "":
    processa(linha)

# List comprehensions com subexpressão compartilhada
dados = [1, 2, 3, 4, 5]
resultados = [y for x in dados if (y := x * 2) > 5]  # [6, 8, 10]

# Reutiliza computação cara em comprehension
resultados_caros = [resultado for x in dados
                    if (resultado := funcao_cara(x)) is not None]
```

**Não**

```python
# Sem walrus operator - menos conciso
n = len(dados)
if n > 10:
    print(f"A lista é muito longa ({n} elementos, esperado <= 10)")

# Chamadas redundantes
linha = arquivo.readline()
while linha != "":
    processa(linha)
    linha = arquivo.readline()

# Computando duas vezes
resultados = [x * 2 for x in dados if x * 2 > 5]
```

_Racional_: O operador walrus reduz duplicação de código e deixa a intenção mais clara, especialmente quando você precisa usar um valor computado múltiplas vezes.

#### Parâmetros posicionais e apenas-por-palavra-chave (Python 3.8+)

Use `/` para especificar parâmetros que devem ser passados apenas por posição, e `*` para parâmetros que devem ser passados apenas por palavra-chave. Isso torna a API mais explícita e evita usos indevidos.

**Sim**

```python
# Parâmetros apenas-posicionais (antes de /)
def saudacao(nome, /, cumprimento="Olá"):
    """`nome` deve ser posicional, `cumprimento` pode ser palavra-chave."""
    return f"{cumprimento}, {nome}!"

saudacao("Alice")  # OK
saudacao("Alice", cumprimento="Oi")  # OK
# saudacao(nome="Alice")  # Erro: nome é apenas-posicional

# Parâmetros apenas-por-palavra-chave (após *)
def cria_usuario(username, *, email, idade):
    """`email` e `idade` devem ser passados como keywords."""
    return {"username": username, "email": email, "idade": idade}

cria_usuario("alice", email="alice@example.com", idade=30)  # OK
# cria_usuario("alice", "alice@example.com", 30)  # Erro: email e idade devem ser keyword

# Combinando ambos
def processa(a, b, /, c, *, d, e):
    """a, b são apenas-posicionais; c pode ser ambos; d, e são apenas-keyword."""
    pass
```

**Não**

```python
# API ambígua sem restrições de parâmetros
def saudacao(nome, cumprimento="Olá"):
    return f"{cumprimento}, {nome}!"

# Usuários podem fazer isso (confuso):
saudacao(cumprimento="Alice", nome="Hello")  # Confuso!
```

_Racional_: Tipos explícitos de parâmetros evitam usos indevidos da API e tornam as assinaturas de funções autodocumentadas.

#### Pattern Matching (match/case) - Python 3.10+

A instrução `match`/`case` fornece correspondência estrutural poderosa, útil para substituir cadeias longas de `if`/`elif` ao lidar com dados estruturados.

**Sim**

```python
# Correspondência de valor simples
def http_status(status: int) -> str:
    match status:
        case 200:
            return "OK"
        case 404:
            return "Não encontrado"
        case 500:
            return "Erro interno do servidor"
        case _:
            return "Status desconhecido"

# Pattern matching com estruturas
def processa_comando(comando: tuple) -> str:
    match comando:
        case ("sair",):
            return "Saindo..."
        case ("carregar", arquivo):
            return f"Carregando {arquivo}"
        case ("salvar", arquivo, formato):
            return f"Salvando {arquivo} como {formato}"
        case _:
            return "Comando desconhecido"

# Correspondência de objetos e tipos
def descreve(obj):
    match obj:
        case int(x) if x > 0:
            return f"Inteiro positivo: {x}"
        case int(x) if x < 0:
            return f"Inteiro negativo: {x}"
        case str(s) if len(s) > 0:
            return f"String não-vazia: {s}"
        case list([]):
            return "Lista vazia"
        case list([primeiro, *resto]):
            return f"Lista começando com {primeiro}"
        case {"name": nome, "age": idade}:
            return f"Pessoa: {nome}, idade {idade}"
        case _:
            return "Algo mais"
```

**Não**

```python
# Cadeias longas de if/elif (menos legível)
def http_status(status: int) -> str:
    if status == 200:
        return "OK"
    elif status == 404:
        return "Não encontrado"
    elif status == 500:
        return "Erro interno do servidor"
    else:
        return "Status desconhecido"

def processa_comando(comando: tuple) -> str:
    if len(comando) == 1 and comando[0] == "sair":
        return "Saindo..."
    elif len(comando) == 2 and comando[0] == "carregar":
        return f"Carregando {comando[1]}"
    elif len(comando) == 3 and comando[0] == "salvar":
        return f"Salvando {comando[1]} como {comando[2]}"
    else:
        return "Comando desconhecido"
```

_Racional_: Pattern matching torna a lógica condicional complexa mais legível e fácil de manter, especialmente ao lidar com dados estruturados.

#### Operadores de mesclar e atualizar para dicionários (Python 3.9+)

Use `|` e `|=` para mesclar dicionários de forma clara.

**Sim**

```python
# Mesclar dicionários com |
defaults = {"cor": "azul", "tamanho": "médio"}
custom = {"tamanho": "grande", "estilo": "moderno"}
config = defaults | custom  # {'cor': 'azul', 'tamanho': 'grande', 'estilo': 'moderno'}

# Atualiza na própria variável com |=
settings = {"tema": "escuro"}
settings |= {"idioma": "pt", "tema": "claro"}
# settings agora é {'tema': 'claro', 'idioma': 'pt'}
```

**Não**

```python
# Maneira antiga - mais verbosa
defaults = {"cor": "azul", "tamanho": "médio"}
custom = {"tamanho": "grande", "estilo": "moderno"}
config = {**defaults, **custom}  # Funciona mas é menos claro

# Ou cópia + update
config = defaults.copy()
config.update(custom)
```

_Racional_: O operador `|` torna a mesclagem de dicionários mais intuitiva e consistente com operações de conjuntos.

#### Mensagens de erro melhores (Python 3.10+)

Versões recentes do Python apresentam mensagens de erro com mais contexto e sugestões — aproveite isso ao depurar e ao escrever testes.

```python
# Exemplo: Melhoria de sintaxe de mensagens de erro
# Python 3.10+ apontará para a localização exata e sugerirá correções

# Dois pontos ausentes
# if x > 5
#        ^
# SyntaxError: expected ':'

# Melhores sugestões de NameError
name = "Alice"
# print(nam)
# NameError: name 'nam' is not defined. Did you mean: 'name'?

# Melhores AttributeErrors
class User:
    def __init__(self):
        self.username = "alice"

user = User()
# print(user.usrname)
# AttributeError: 'User' object has no attribute 'usrname'. Did you mean: 'username'?
```

#### Context managers entre parênteses (Python 3.10+)

Permitem escrever múltiplos context managers com quebras de linha naturais.

**Sim**

```python
with (
    open("entrada.txt") as fin,
    open("saida.txt", "w") as fout,
    open("log.txt", "w") as logfile,
):
    processa_arquivos(fin, fout, logfile)
```

**Não**

```python
# Continuação com barra invertida menos legível
with open("entrada.txt") as fin, \
     open("saida.txt", "w") as fout, \
     open("log.txt", "w") as logfile:
    processa_arquivos(fin, fout, logfile)
```

_Racional_: Context managers entre parênteses melhoram a legibilidade ao trabalhar com múltiplos recursos.

## Expressões idiomáticas Python essenciais e boas práticas

### O padrão `if __name__ == "__main__"`

Use esta expressão para tornar seus arquivos Python tanto módulos importáveis quanto scripts executáveis.

**Sim**

```python
# meumodulo.py
def calcula_soma(a: int, b: int) -> int:
    """Adiciona dois números."""
    return a + b

def main():
    """Ponto de entrada quando executado como script."""
    resultado = calcula_soma(5, 3)
    print(f"Resultado: {resultado}")

if __name__ == "__main__":
    main()
```

**Quando importado:**

```python
# outro_arquivo.py
import meumodulo

# Apenas a função está disponível, main() não roda automaticamente
resultado = meumodulo.calcula_soma(10, 20)
```

**Quando executado diretamente:**

```bash
python meumodulo.py  # Roda main() e imprime "Resultado: 8"
```

**Não**

```python
# meumodulo.py - Má prática
def calcula_soma(a: int, b: int) -> int:
    """Adiciona dois números."""
    return a + b

# Código roda imediatamente quando importado (ruim!)
resultado = calcula_soma(5, 3)
print(f"Resultado: {resultado}")
```

_Racional_: Este padrão permite reutilização de código. O mesmo arquivo pode ser usado como módulo importável ou executado como um script autônomo sem efeitos colaterais indesejados durante a importação.

### Logging vs Print

Use o módulo `logging` ao invés de `print()` para qualquer coisa além de scripts simples. Logging fornece melhor controle sobre níveis de saída, formatação e destinos.

**Sim**

```python
import logging

# Configura logging no início da sua aplicação
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def processa_dados(dados):
    logger.debug(f"Processando dados: {dados}")

    if not dados:
        logger.warning("Dados vazios recebidos")
        return None

    try:
        resultado = operacao_cara(dados)
        logger.info(f"Processados {len(dados)} itens com sucesso")
        return resultado
    except Exception as e:
        logger.error(f"Falha ao processar dados: {e}", exc_info=True)
        raise

# Benefícios:
# - Pode mudar o nível de log sem modificar código
# - Logs incluem timestamps e contexto
# - Pode redirecionar para arquivos, streams ou serviços externos
# - Diferentes loggers para diferentes módulos
```

**Não**

```python
def processa_dados(dados):
    print(f"Processando dados: {dados}")  # Sempre imprime, sem controle

    if not dados:
        print("AVISO: Dados vazios recebidos")  # Sem formato padrão
        return None

    try:
        resultado = operacao_cara(dados)
        print(f"Processados {len(dados)} itens")  # Misto com saída real
        return resultado
    except Exception as e:
        print(f"ERRO: {e}")  # Sem stack trace, difícil depurar
        raise
```

**Níveis de log**

```python
import logging

logger = logging.getLogger(__name__)

# Use níveis apropriados
logger.debug("Informação detalhada para depuração")
logger.info("Mensagens informativas gerais")
logger.warning("Avisos para situações inesperadas")
logger.error("Erros para problemas sérios")
logger.critical("Erros críticos para problemas muito graves")

# Em produção, defina o nível para INFO ou WARNING para reduzir ruído
logging.basicConfig(level=logging.WARNING)
# Agora apenas avisos, erros e mensagens críticas aparecem
```

_Racional_: Logging é configurável, estruturado e pronto para produção. Permite controlar verbosidade sem mudar código e fornece melhor contexto para depuração.

### Operações eficientes em coleções

Escolha a estrutura de dados correta para o trabalho. Entender características de performance evita código ineficiente. Para mais casos de uso, consulte [este post de blog](https://george-gca.github.io/blog/2023/simple-improvements-python-code/).

**Testando membros em conjuntos**

**Sim**

```python
# Use conjuntos para testagem de membros - O(1) caso médio
usuarios_validos = {"alice", "bob", "charlie", "david"}  # set

if username in usuarios_validos:  # Rápido: O(1)
    concede_acesso()

# Converta lista para conjunto para múltiplas buscas
lista_usuarios = ["alice", "bob", "charlie", "david"]
conjunto_usuarios = set(lista_usuarios)  # Converte uma vez

for tentativa_login in tentativas_login:
    if tentativa_login in conjunto_usuarios:  # O(1) por verificação
        processa_login(tentativa_login)
```

**Não**

```python
# Usar listas para testagem de membros - O(n) busca linear
usuarios_validos = ["alice", "bob", "charlie", "david"]  # list

if username in usuarios_validos:  # Lento: O(n)
    concede_acesso()

# Buscar repetidamente em listas
for tentativa_login in tentativas_login:
    if tentativa_login in usuarios_validos:  # O(n) por verificação - muito lento!
        processa_login(tentativa_login)
```

**Dicionário para buscas rápidas**

**Sim**

```python
# Use dicionários para buscas chave-valor - O(1)
scores_usuarios = {
    "alice": 95,
    "bob": 87,
    "charlie": 92
}

score = scores_usuarios.get("alice", 0)  # Busca rápida com padrão

# Dict comprehension
ao_quadrado = {x: x**2 for x in range(10)}
# {0: 0, 1: 1, 2: 4, 3: 9, ...}
```

**Não**

```python
# Usar listas paralelas - ineficiente e propenso a erros
nomes_usuarios = ["alice", "bob", "charlie"]
scores = [95, 87, 92]

# Busca linear para encontrar score - O(n)
def get_score(nome_usuario):
    for i, nome in enumerate(nomes_usuarios):
        if nome == nome_usuario:
            return scores[i]
    return 0
```

**Operações com conjuntos**

```python
# Operações com conjuntos são rápidas e legíveis
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}

# União - todos os elementos únicos
uniao = set_a | set_b  # {1, 2, 3, 4, 5, 6, 7, 8}

# Interseção - elementos comuns
intersecao = set_a & set_b  # {4, 5}

# Diferença - elementos em a mas não em b
diferenca = set_a - set_b  # {1, 2, 3}

# Diferença simétrica - elementos em um ou outro mas não em ambos
diff_sim = set_a ^ set_b  # {1, 2, 3, 6, 7, 8}

# Remove duplicatas de uma lista
itens_unicos = list(set(itens_com_duplicatas))
```

**Lista vs Gerador para dados grandes**

**Sim**

```python
# Gerador - eficiente em memória para dados grandes
def le_arquivo_grande(nome_arquivo):
    with open(nome_arquivo) as f:
        for linha in f:  # Processa uma linha por vez
            yield linha.strip()

# Carrega apenas uma linha por vez
for linha in le_arquivo_grande("arquivo_gigante.txt"):
    processa(linha)

# Expressão de gerador
soma_de_quadrados = sum(x**2 for x in range(1000000))  # Eficiente em memória
```

**Não**

```python
# Lista - carrega tudo em memória
def le_arquivo_grande(nome_arquivo):
    with open(nome_arquivo) as f:
        return [linha.strip() for linha in f]  # Carrega arquivo inteiro!

# Usa muita memória
todas_linhas = le_arquivo_grande("arquivo_gigante.txt")
for linha in todas_linhas:
    processa(linha)

# List comprehension - cria lista completa em memória
soma_de_quadrados = sum([x**2 for x in range(1000000)])  # Desperdiçador
```

_Racional_: Usar a estrutura de dados correta melhora a performance dramaticamente. Conjuntos e dicionários oferecem buscas O(1), enquanto listas requerem O(n). Geradores economizam memória para datasets grandes.

### Duck Typing e EAFP vs LBYL

Duck typing é um conceito de programação onde o tipo ou classe de um objeto é determinado pelo seu comportamento (métodos e propriedades), ao invés de sua herança ou tipo explícito. A frase "Se caminha como um pato e faz quac como um pato, é um pato" significa que, se um objeto implementa os métodos ou comportamentos necessários, ele pode ser usado onde esses comportamentos são esperados — independentemente do seu tipo real. Essa abordagem torna o código mais flexível e reutilizável, pois foca no que um objeto pode fazer, não no que ele é. Python também segue a filosofia de "É mais fácil pedir perdão do que permissão" (EAFP) em vez de "Olhe antes de pular" (LBYL).

**EAFP - Abordagem Pythônica**

**Sim**

```python
# EAFP: Tenta a operação, trata exceções se falhar
def get_user_age(user_dict):
    try:
        return user_dict["age"]
    except KeyError:
        return None

# Duck typing: "Se caminha como um pato e faz quac como um pato..."
def processa_arquivo(file_obj):
    # Não verifica tipo - apenas usa como arquivo
    try:
        conteudo = file_obj.read()
        return conteudo.upper()
    except AttributeError:
        raise TypeError("Objeto deve ter método read()")

# Funciona com qualquer objeto tipo-arquivo
from io import StringIO
processa_arquivo(open("file.txt"))  # Arquivo real
processa_arquivo(StringIO("teste"))  # Buffer de string - também funciona!

# EAFP com acesso a dict
config = {"timeout": 30, "retries": 3}
try:
    timeout = config["timeout"]
    retries = config["retries"]
except KeyError as e:
    raise ValueError(f"Config obrigatória faltando: {e}")
```

**Não - LBYL (Olhe antes de pular)**

```python
# LBYL: Verifica antes de tentar (menos Pythônico, race conditions)
def get_user_age(user_dict):
    if "age" in user_dict:  # Verificação extra
        return user_dict["age"]
    else:
        return None

# Verificação de tipo ao invés de duck typing (rígido)
def processa_arquivo(file_obj):
    if not isinstance(file_obj, io.IOBase):  # Muito restritivo!
        raise TypeError("Deve ser um objeto arquivo")
    conteudo = file_obj.read()
    return conteudo.upper()
# Agora StringIO não funciona, mesmo tendo read()!

# Múltiplas verificações (verboso e mais lento)
config = {"timeout": 30, "retries": 3}
if "timeout" in config and "retries" in config:
    timeout = config["timeout"]
    retries = config["retries"]
else:
    raise ValueError("Config obrigatória faltando")
```

**Mais exemplos de EAFP**

```python
# Convertendo para int
# EAFP - Pythônico
try:
    valor = int(entrada_usuario)
except ValueError:
    print("Número inválido")

# LBYL - Não Pythônico
if entrada_usuario.isdigit():
    valor = int(entrada_usuario)
else:
    print("Número inválido")
# Problema: isdigit() não lida com números negativos ou floats

# Operações com arquivo
# EAFP - Pythônico
try:
    with open("config.json") as f:
        config = json.load(f)
except FileNotFoundError:
    config = config_padrao()
except json.JSONDecodeError:
    print("JSON inválido")

# LBYL - Menos Pythônico
import os
if os.path.exists("config.json"):
    # Race condition: arquivo pode ser deletado entre verificação e abertura!
    with open("config.json") as f:
        config = json.load(f)
else:
    config = config_padrao()
```

**Benefícios do Duck Typing**

```python
# Funções funcionam com qualquer tipo compatível
def imprime_tudo(itens):
    """Funciona com listas, tuplas, conjuntos, geradores, etc."""
    for item in itens:  # Apenas precisa ser iterável
        print(item)

imprime_tudo([1, 2, 3])           # lista
imprime_tudo((1, 2, 3))           # tupla
imprime_tudo({1, 2, 3})           # conjunto
imprime_tudo(range(1, 4))         # objeto range
imprime_tudo(x for x in [1,2,3])  # gerador

# Classe customizada também funciona se implementa __iter__
class MinhaColecao:
    def __init__(self, dados):
        self.dados = dados

    def __iter__(self):
        return iter(self.dados)

imprime_tudo(MinhaColecao([1, 2, 3]))  # Funciona!
```

_Racional_: EAFP é mais Pythônico, geralmente mais rápido (uma operação vs verificação + operação), e lida com casos extremos melhor. Duck typing torna código mais flexível e reutilizável ao focar em comportamento ao invés de tipo.
