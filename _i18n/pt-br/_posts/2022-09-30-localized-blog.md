---
layout: post
title: Criando postagens de blog traduzidas
date: 2022-09-30 17:40:13
description: Como criar um blog traduzido no seu site al-folio.
tags: al-folio website jekyll localization languages
categories: website development
giscus_comments: true
related_posts: false
---

Este post faz parte de uma série de posts que explicam como configurar seu próprio site baseado no tema al-folio e adicionar suporte a uma segunda língua:

- [Executando localmente seu próprio site al-folio]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %})
- [Tornando seu al-folio em um site com dois idiomas]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %})
- [Criando páginas de CV traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %})
- [Criando páginas de projetos traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- Criando postagens de blog traduzidas

---

Nós [criamos um site al-folio local]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %}), [adicionamos suporte para outro idioma nele]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %}), [criamos páginas de CV]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %}) e [páginas de projetos]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %}) traduzidas. Agora, vamos traduzir a parte do blog.

## Criando a estrutura

Se você for para a seção de blog do seu site al-folio, perceberá que ela está bastante vazia, embora haja postagens no modelo. Na verdade, o [Jekyll Multiple Languages ​​Plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin) já suporta [postagens de blog localizadas](https://github.com/kurtsson/jekyll-multiple-languages-plugin#57-creating-posts). Ele só não está exibindo porque não está encontrando as postagens. Então, vamos criar a estrutura correta para eles. Crie um diretório `_posts/` dentro de cada idioma no diretório `_i18n/` e copie o conteúdo do diretório `_posts/` da raiz do site para os diretórios de idioma. Então, por exemplo, se você tiver um diretório `_posts/` com o seguinte conteúdo:

- \_posts/2015-03-15-formatting-and-links.md
- \_posts/2015-05-15-images.md
- \_posts/2015-07-15-code.md
- \_posts/2015-10-20-comments.md
- \_posts/2015-10-20-math.md
- \_posts/2018-12-22-distill.md
- \_posts/2020-09-28-github-metadata.md
- \_posts/2020-09-28-twitter.md
- \_posts/2021-07-04-diagrams.md
- \_posts/2022-02-01-redirect.md

Você deve criar a seguinte estrutura para todos os seus idiomas, por exemplo, para o idioma inglês:

- \_i18n/en/\_posts/2015-03-15-formatting-and-links.md
- \_i18n/en/\_posts/2015-05-15-images.md
- \_i18n/en/\_posts/2015-07-15-code.md
- \_i18n/en/\_posts/2015-10-20-comments.md
- \_i18n/en/\_posts/2015-10-20-math.md
- \_i18n/en/\_posts/2018-12-22-distill.md
- \_i18n/en/\_posts/2020-09-28-github-metadata.md
- \_i18n/en/\_posts/2020-09-28-twitter.md
- \_i18n/en/\_posts/2021-07-04-diagrams.md
- \_i18n/en/\_posts/2022-02-01-redirect.md

Crie isso, traduza o conteúdo das páginas e agora o modelo mostrará as postagens do blog. Fácil, certo? Ééééé, faltam dois pequenos detalhes: o formato da data e o tempo de leitura. A má notícia é que o Jekyll não oferece suporte nativo a formatos de data por idioma. A boa notícia é que não é tão difícil criar. Vamos começar com o formato da data.

## Traduzindo o formato da data

Existem dois formatos principais de data utilizados no template: na lista de posts e dentro dos posts, com o formato `28 de setembro, 2020`, e ao filtrar os posts (ex.: por tag), com o formato `28 de set, 2020`. A maneira mais fácil que encontrei de traduzi-los é primeiro traduzindo manualmente os nomes dos meses. Para isso, adicione a seguinte seção aos seus arquivos de idioma (`_i18n/en.yml` e `_i18n/pt-br.yml`), traduzindo os nomes dos meses para o seu idioma:

```yaml
months:
  long:
    january: January
    february: February
    march: March
    april: April
    may: May
    june: June
    july: July
    august: August
    september: September
    october: October
    november: November
    december: December
  short:
    january: Jan
    february: Feb
    march: Mar
    april: Apr
    may: May
    june: Jun
    july: Jul
    august: Aug
    september: Sep
    october: Oct
    november: Nov
    december: Dec
```

Como as datas são usadas em vários locais, vamos criar uma função para reutilizar o código. Crie o arquivo `_includes/date_format.html` com o seguinte código:

{% raw %}

```liquid
{% assign months = 'january|february|march|april|may|june|july|august|september|october|november|december' | split: '|' %}
{% assign m = include.date_from.date | date: '%-m' | minus: 1 %}
{% assign day = include.date_from.date | date: '%d' %}
{% capture month %}months.{{ include.format }}.{{ months[m] }}{% endcapture %}
{% assign year = include.date_from.date | date: '%Y' %}
{% if site.lang == 'en' -%}
  {%- t month %}
  {{ day }}, {{ year -}}
{%- else -%}
  {{- day }} de {% t month %}, {{ year -}}
{%- endif %}
```

{% endraw %}

Este código define uma função que extrai o mês, dia e ano da variável `date_from`, formata de acordo com `format` e retorna a string traduzida formatada. Observe que, para acessar as variáveis fornecidas, devemos nos referir a elas precedidas de `include.`. A variável `format` pode ser `long` ou `short`, como definimos acima, e a variável `date_from` deve ter um objeto de data dentro dela. A função também considera o idioma atual. Agora, vamos chamar a função com os parâmetros apropriados. Dentro do arquivo `blog/index.html`, faça as seguintes alterações:

{% raw %}

```html
<!-- {{ post.date | date: '%B %-d, %Y' }} -->
{% include date_format.html format="long" date_from=post %}
```

{% endraw %}

A lista de postagens agora exibirá o formato de data corretamente. Basta fazer as mesmas alterações para todos os outros lugares onde o formato da data aparece, como as páginas de filtros, alterando o formato do mês para `"short"` quando necessário, e também fornecendo o parâmetro `date_from` correto. Por exemplo, para o arquivo `_layouts/archive-category.html` a mudança será:

{% raw %}

```html
<!-- <th scope="row">{{ post.date | date: "%b %-d, %Y" }}</th> -->
<th scope="row">{% include date_format.html format="short" date_from=post %}</th>
```

{% endraw %}

## Traduzindo o tempo de leitura

Agora, vamos traduzir o tempo de leitura. Faça as seguintes alterações no arquivo `blog/index.html`:

{% raw %}

```html
<!-- {{ read_time }} min read &nbsp; &middot; &nbsp; -->
{% if site.lang == 'en' %}{{ read_time }} min read{% else %}Leitura de {{ read_time }} min{% endif %} &nbsp; &middot; &nbsp;
```

{% endraw %}

## Corrigindo a navegação nos arquivos do blog

Ao clicar para filtrar as postagens do blog por tag, ano ou categoria, a página mostra as postagens, mas a navegação não funciona como deveria. Isso ocorre porque essas navegações ainda não dão suporte à tradução. Para corrigir isso, modifique as seguintes linhas nos arquivos `_layouts/archive-category.html`, `_layouts/archive-tag.html` e `_layouts/archive-year.html`:

{% raw %}

```html
<!-- <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a> -->
<a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
```

{% endraw %}

Também mude a seguinte linha no arquivo `blog/index.html`:

{% raw %}

```html
<!-- <i class="fas fa-hashtag fa-sm"></i> <a href="{{ tag | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a> -->
<i class="fas fa-hashtag fa-sm"></i> <a href="{{ tag | prepend: '/blog/tag/' | prepend: site.baseurl }}">{{ tag }}</a>
```

{% endraw %}

## Corrigindo a paginação

Se o seu blog tiver postagens suficientes para habilitar mais páginas com resultados (paginação), você perceberá que isso ainda não está traduzido. Para corrigir, primeiro precisamos criar traduções para os termos `Older` e `Newer` nos arquivos de idioma `_i18n/en.yml` e `_i18n/pt-br.yml`, respectivamente:

```yaml
pagination:
  newer: Newer
  older: Older
```

```yaml
pagination:
  newer: Recentes
  older: Antigas
```

Em seguida, mudamos todos os usos de `relative_url` para `prepend: site.baseurl` no arquivo `_includes/pagination.html`, para que ele lide com as URLs no idioma correto. Além disso, substitua as palavras "Newer" e "Older" pela sua tradução correspondente do arquivo de idioma:

{% raw %}

```html
{%- if paginator.total_pages > 1 -%}
<nav aria-label="Blog page naviation">
  <ul class="pagination pagination-lg justify-content-center">
    <li class="page-item {% unless paginator.previous_page %}disabled{% endunless %}">
      <!-- <a class="page-link" href="{{ paginator.previous_page_path | relative_url }}" tabindex="-1" aria-disabled="{{ paginator.previous_page }}">Newer</a> -->
      <a
        class="page-link"
        href="{{ paginator.previous_page_path |  prepend: site.baseurl }}"
        tabindex="-1"
        aria-disabled="{{ paginator.previous_page }}"
        >{% t pagination.newer %}</a
      >
    </li>
    {%- if paginator.page_trail -%} {% for trail in paginator.page_trail -%}
    <!-- <li class="page-item {% if page.url == trail.path %}active{% endif %}"><a class="page-link" href="{{ trail.path | relative_url }}" title="{{trail.title}}">{{ trail.num }}</a></li> -->
    <li class="page-item {% if page.url == trail.path %}active{% endif %}">
      <a class="page-link" href="{{ trail.path | prepend: site.baseurl }}" title="{{trail.title}}">{{ trail.num }}</a>
    </li>
    {% endfor -%} {%- endif -%}
    <li class="page-item {% unless paginator.next_page %}disabled{% endunless %}">
      <!-- <a class="page-link" href="{{ paginator.next_page_path | relative_url }}">Older</a> -->
      <a class="page-link" href="{{ paginator.next_page_path | prepend: site.baseurl }}">{% t pagination.older %}</a>
    </li>
  </ul>
</nav>
{%- endif -%}
```

{% endraw %}

## Corrigindo o título da página no navegador

Se você filtrar as postagens do seu blog por ano, notará que o ano não é exibido no título do navegador. Para corrigir isso, modifique as seguintes linhas no arquivo `_includes/metadata.html`:

{% raw %}

```liquid
{% if page.url == '/blog/index.html' %}
  {{ site.blog_nav_title }} | {{ title }}
{% elsif page.url contains '/blog/' %}
  {{ page.title }} | {{ title }}
{%- elsif page.title contains 'Announcement' -%}
  {{ title }}
{%- elsif page.title != 'blank' and page.url != '/' -%}
  {% t page.title %} | {{ title }}
{%- else -%}
  {{ title }}
{%- endif -%}
```

{% endraw %}

por essas:

{% raw %}

```liquid
{% if page.url == '/blog/index.html' %}
  {{ site.blog_nav_title }} | {{ title }}
{% elsif page.url contains '/blog/' %}
  {%- capture blog_year -%}{{ page.url | slice: 0, 11 }}{%- endcapture -%}
  {%- if page.url == blog_year -%}
    {{ page.date | date: '%Y' }} | {{ title }}
  {%- else -%}
    {{ page.title }} | {{ title }}
  {%- endif -%}
{%- elsif page.title != 'blank' and page.url != '/' -%}
  {%- if page.title contains 'Announcement' -%}
    {{ title }}
  {%- else -%}
    {% t page.title %} | {{ title }}
  {%- endif -%}
{%- else -%}
  {{ title }}
{%- endif -%}
```

{% endraw %}
