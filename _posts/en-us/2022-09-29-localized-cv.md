---
layout: post
title: Creating localized CV pages
date: 2022-09-29 21:40:13
description: How to create localized CV pages on your al-folio website.
tags: al-folio website jekyll localization languages
categories: website development
giscus_comments: true
related_posts: false
---

This post is part of a series of posts that explain how to set up your own site based on the al-folio theme and add support for a second language:

- [Running locally your own al-folio website]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %})
- [Turning your al-folio into a dual-language website]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %})
- Creating localized CV pages
- [Creating localized Projects pages]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- [Creating localized blog posts]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-blog %})

---

We already [created a local al-folio website]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %}) and [added support for another language in it]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %}). If you look at the `cv` tab, it looks really nice, and can also give you the option to download a pdf file. Let's see how we can create a localized (with a per language translation) version of it.

## Creating the structure

The current structure of the cv page is composed of 3 main files: `_pages/cv.md`, `_layouts/cv.html`, and `_data/cv.yml`. The first one is the definition of the page, the second one is the layout of the page, and the third one is the data that is used to populate it. We will create a new folder for each language inside the `_data/` directory, and copy the file `_data/cv.yml` to both of them. The new `_data/` directory will look like this:

- \_data/en/cv.yml
- \_data/pt-br/cv.yml
- \_data/coauthors.yml
- \_data/repositories.yml
- \_data/venues.yml

Now, lets replace the content of the `_data/pt-br/cv.yml` file with the following:

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

Now, open the `_layouts/cv.html` file and replace the following line:

{% raw %}

```html
<!-- {% for entry in site.data.cv %} -->
{% for entry in site.data[site.lang].cv %}
```

{% endraw %}

This will be sufficient to make the page work for the new language. Now, lets add the option to download the localized pdf file. For this, create a new folder for each language inside the `assets/pdf/` directory, and copy the file `assets/pdf/example_pdf.pdf` to both of them. The new `assets/pdf/` directory will look like this:

- assets/pdf/en/example_pdf.pdf
- assets/pdf/pt-br/example_pdf.pdf
- assets/pdf/example_pdf.pdf

Now, lets update the link to the localized pdf file. We will use the same name for both files, which is already defined in the `cv_pdf: example_pdf.pdf` attribute inside `_pages/cv.md`. If you wish to use a different name for the pdfs, rename both and also update this information in the related attribute. Next, modify the following line in the `_layouts/cv.html` file:

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

And that will do.
