---
layout: post
title: Criando páginas de CV traduzidas
date: 2022-09-29 21:40:13
description: Como criar páginas de CV por idioma no seu site al-folio.
tags: al-folio website jekyll localization languages
categories: website development
giscus_comments: true
related_posts: false
---

Este post faz parte de uma série de posts que explicam como configurar seu próprio site baseado no tema al-folio e adicionar suporte a uma segunda língua:

- [Executando localmente seu próprio site al-folio]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %})
- [Tornando seu al-folio em um site com dois idiomas]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %})
- Criando páginas de CV traduzidas
- [Criando páginas de projetos traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- [Criando postagens de blog traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-blog %})

---

Já [criamos um site al-folio local]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %}) e [adicionamos suporte para outro idioma nele]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %}). Se você olhar a aba `cv`, ela é bem bonita e também dá a opção de baixar um arquivo pdf. Vamos ver como podemos criar uma versão "localizada" (com tradução por idioma) dela.

## Criando a estrutura

A estrutura atual da página cv é composta por 3 arquivos principais: `_pages/cv.md`, `_layouts/cv.html` e `_data/cv.yml`. A primeira é a definição da página, a segunda é o layout da página e a terceira são os dados que são usados ​​para preenchê-la. Vamos criar uma nova pasta para cada idioma dentro do diretório `_data/`, e copiar o arquivo `_data/cv.yml` para ambos. O novo diretório `_data/` ficará assim:

- \_data/en/cv.yml
- \_data/pt-br/cv.yml
- \_data/coauthors.yml
- \_data/repositories.yml
- \_data/venues.yml

Agora, vamos substituir o conteúdo do arquivo `_data/pt-br/cv.yml` pelo seguinte:

```yaml
- title: Informações Gerais
  type: map
  contents:
    - name: Nome Completo
      value: Albert Einstein
    - name: Data de Nascimento
      value: 14 de março de 1879
    - name: Idiomas
      value: Inglês, Alemão

- title: Educação
  type: time_table
  contents:
    - title: PhD
      institution: University of Zurich, Zurique, Suíça
      year: 1905
      description:
        - Descrição 1.
        - Descrição 2.
        - title: Descrição 3.
          contents:
            - Sub-descrição 1.
            - Sub-descrição 2.
    - title: Diploma de ensino federal
      institution: Eidgenössische Technische Hochschule, Zurique, Suíça
      year: 1900
      description:
        - Descrição 1.
        - Descrição 2.

- title: Experiência
  type: time_table
  contents:
    - title: Professor de Física Teórica
      institution: Institute for Advanced Study, Princeton University
      year: 1933 - 1955
      description:
        - Descrição 1.
        - Descrição 2.
        - title: Descrição 3.
          contents:
            - Sub-descrição 1.
            - Sub-descrição 2.
    - title: Visiting Professor
      institution: California Institute of Technology, Pasadena, Califórnia, EUA
      year: 1933
      description:
        - Descrição 1.
        - Descrição 2.

    - title: Diretor
      institution: Kaiser Wilhelm Institute for Physics, Berlim, Alemanha.
      year: 1917-1933

    - title: Professor de Física Teórica
      institution: Karl-Ferdinand University, Praga, Tchecoslováquia
      year: 1911 - 1917
      description:

    - title: Professor Associado de Física Teórica
      institution: University of Zurich, Zurique, Suíça
      year: 1909 - 1911

- title: Projetos de Código Aberto
  type: time_table
  contents:
    - title: <a href="https://github.com/alshedivat/al-folio">al-folio</a>
      year: 2015-atual
      description: Um tema Jekyll bonito, simples, limpo e responsivo para acadêmicos.

- title: Honras e Prêmios
  type: time_table
  contents:
    - year: 1921
      items:
        - Prêmio Nobel de Física
        - Medalha Matteucci
    - year: 2029
      items:
        - Medalha Max Planck

- title: Interesses Acadêmicos
  type: nested_list
  contents:
    - title: Tópico 1.
      items:
        - Descrição 1.
        - Descrição 2.
    - title: Tópico 2.
      items:
        - Descrição 1.
        - Descrição 2.

- title: Outros Interesses
  type: list
  contents:
    - <u>Hobbies:</u> Hobby 1, Hobby 2, etc.
```

Agora, abra o arquivo `_layouts/cv.html` e substitua a seguinte linha:

{% raw %}

```html
<!-- {% for entry in site.data.cv %} -->
{% for entry in site.data[site.lang].cv %}
```

{% endraw %}

Isso será suficiente para fazer a página funcionar para o novo idioma. Agora, vamos adicionar a opção de baixar o arquivo pdf traduzido. Para isso, crie uma nova pasta para cada idioma dentro do diretório `assets/pdf/`, e copie o arquivo `assets/pdf/example_pdf.pdf` para ambos. O novo diretório `assets/pdf/` ficará assim:

- assets/pdf/en/example_pdf.pdf
- assets/pdf/pt-br/example_pdf.pdf
- assets/pdf/example_pdf.pdf

Agora, vamos atualizar o link para o arquivo pdf no idioma correto. Usaremos o mesmo nome para ambos os arquivos, que já está definido no atributo `cv_pdf: example_pdf.pdf` dentro de `_pages/cv.md`. Se você deseja usar um nome diferente para os pdfs, renomeie ambos e também atualize esta informação no atributo relacionado. Em seguida, modifique a seguinte linha no arquivo `_layouts/cv.html`:

{% raw %}

```html
<!-- <h1 class="post-title">{% t page.title %} {% if page.cv_pdf %}<a href="{{ page.cv_pdf | prepend: 'assets/pdf/' | relative_url}}" target="_blank" rel="noopener noreferrer" class="float-right"><i class="fas fa-file-pdf"></i></a>{% endif %}</h1> -->
<h1 class="post-title">
  {% t page.title %} {% if page.cv_pdf %}<a
    href="{{ page.cv_pdf | prepend: '/' | prepend: site.lang | prepend: 'assets/pdf/' | relative_url}}"
    target="_blank"
    rel="noopener noreferrer"
    class="float-right"
    ><i class="fas fa-file-pdf"></i></a
  >{% endif %}
</h1>
```

{% endraw %}

E isso vai servir.
