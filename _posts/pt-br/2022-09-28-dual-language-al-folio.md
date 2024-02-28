---
layout: post
title: Tornando seu al-folio em um site com dois idiomas
date: 2022-09-28 11:29:13
description: Adicionando suporte para outro idioma em seu al-folio.
tags: al-folio website jekyll localization languages
categories: website development
giscus_comments: true
related_posts: false
---

Este post faz parte de uma série de posts que explicam como configurar seu próprio site baseado no tema al-folio e adicionar suporte a uma segunda língua:

- [Executando localmente seu próprio site al-folio]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %})
- Tornando seu al-folio em um site com dois idiomas
- [Criando páginas de CV traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %})
- [Criando páginas de projetos traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- [Criando postagens de blog traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-blog %})

---

O [al-folio](https://github.com/alshedivat/al-folio) é um ótimo tema para sites em Jekyll. É altamente personalizável e fácil de usar, com suporte para blogs, informações de repositório, projetos e muito mais (veja o [exemplo](https://alshedivat.github.io/al-folio/)). No entanto, ele não oferece suporte a vários idiomas. Neste post, vou mostrar como adicionar suporte para outro idioma no seu al-folio. Vou adicionar suporte para `pt-BR`, já que é minha língua nativa. Para isso, você já deve ter [clonado sua cópia do repositório al-folio e executado localmente]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %}).

## Instalando dependências

Faremos isso com a ajuda do [Jekyll Multiple Languages ​​Plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin). Ele adiciona suporte ao i18n para Jekyll. Para instalar, adicione a seguinte linha ao seu `Gemfile` na parte `group :jekyll_plugins do`:

```ruby
gem 'jekyll-multiple-languages-plugin'
```

Além disso, adicione a seguinte linha ao seu `_config.yml` em `plugins:`:

```yaml
- jekyll-multiple-languages-plugin
```

e as seguintes linhas depois dele (fora de `plugins`), por exemplo, antes da seção `Jekyll Minifier`:

```yaml
# configurações de vários idiomas
languages: ["en", "pt-br"]
default_locale_in_subfolder: false
```

Definir `default_locale_in_subfolder` como `false` faz com que seu idioma principal seja a raiz do seu site, em vez de estar em uma subpasta. Por exemplo, em vez de `https://george-gca.github.io/en/`, será `https://george-gca.github.io/`. Este é o comportamento padrão do al-folio, então vamos mantê-lo. O primeiro idioma na lista será o idioma padrão, inglês neste caso. Em seguida, execute `bundle install` para instalar o plugin.

## Criando arquivos de tradução

Crie uma pasta chamada `_i18n` e adicione subpastas para cada idioma, usando os mesmos nomes usados ​​na configuração `languages` no `_config.yml` que acabamos de adicionar. Além disso, crie um arquivo `yml` para cada idioma. Por exemplo, para `pt-br`, crie uma pasta chamada `_i18n/pt-br`. Em seguida, crie um arquivo chamado `_i18n/pt-br.yml`. Nossa estrutura de diretórios deve ficar assim:

- \_i18n/en.yml
- \_i18n/pt-br.yml
- \_i18n/en/
- \_i18n/pt-br/

## Adicionando alternância de idioma

Agora, precisamos adicionar uma forma de mudar o idioma do nosso site. Vamos adicioná-lo à barra de navegação. Abra o arquivo `_includes/header.html` e adicione o seguinte código antes da área `Toogle theme mode`:

{%raw%}

```html
<!-- Mudar a lingua -->
<li class="nav-item active">
  {% if site.lang == "en" %}
  <a class="nav-link" href="{{site.baseurl_root}}/pt-br{{page.url}}"> PT-BR </a>
  {% elsif site.lang == "pt-br" %}
  <a class="nav-link" href="{{site.baseurl_root}}{{page.url}}"> EN </a>
  {% endif %}
</li>
```

{%endraw%}

Isso adiciona um link para o outro idioma. O `page.url` mantém a informação da página atual, para que o usuário não seja redirecionado para a página inicial. Observe que `site.baseurl_root` é uma variável introduzida pelo Jekyll Multiple Languages ​​Plugin e aponta para a raiz da página sem o caminho do idioma. Mais informações sobre as variáveis ​​recém-adicionadas podem ser encontradas [aqui](https://github.com/kurtsson/jekyll-multiple-languages-plugin#55-link-between-languages).

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/header_en.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Cabeçalho com botão para mudar de idioma.
</div>

## Adicionando títulos traduzidos

Até agora, adicionamos tudo o que é necessário para dar suporte à tradução, mas não fizemos a tradução de fato. Vamos fazer isso agora. Abra o arquivo `_i18n/en.yml` e adicione as seguintes linhas:

```yaml
titles:
  about: about
  blog: blog
  cv: cv
  news: news
  projects: projects
  publications: publications
  repositories: repositories
  teaching: teaching
  submenus: submenus
  unk: page not found
```

Isso vai criar os títulos das páginas. Agora, abra o arquivo `_i18n/pt-br.yml` e adicione as seguintes linhas:

```yaml
titles:
  about: sobre
  blog: blog
  cv: cv
  news: novidades
  projects: projetos
  publications: publicações
  repositories: repositórios
  teaching: ensino
  submenus: submenus
  unk: página não encontrada
```

Isso adiciona os títulos das páginas em português. Agora que temos os títulos traduzidos, temos que modificar as páginas para que usem essas variáveis. Para isso, abra todas as páginas da pasta `_pages` e altere seus títulos para usar a variável `titles` correta. Por exemplo, o novo título da página `about.md` deve ficar assim:

```yaml
title: titles.about
```

Se você executar seu site agora, verá que os títulos são mostrados como `titles.about` em vez de apenas `about` como deveria, já que o padrão é em inglês. Ainda precisamos dizer aos modelos html para selecionar a versão traduzida correta dessas variáveis. Para isso, abra o arquivo `_includes/header.html` e altere todas as variáveis ​​`title` para usar a [função t](https://github.com/kurtsson/jekyll-multiple-languages-plugin#51-translating-strings). A função `t`, ou sua versão mais longa `translate`, vai garantir que ela selecione a versão correta do arquivo yml do idioma atual. Mais especificamente, faça as seguintes alterações:

{%raw%}

```html
<!-- <a class="nav-link" href="{{ '/' | relative_url }}">{{ about_title }} -->
<a class="nav-link" href="{{ '/' | relative_url }}"
  >{% t about_title %}

  <!-- <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ p.title }} -->
  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
    >{% t p.title %}

    <!-- <a class="dropdown-item" href="{{ child.permalink | relative_url }}">{{ child.title }}</a> -->
    <a class="dropdown-item" href="{{ child.permalink | relative_url }}">{% t child.title %}</a>

    <!-- <a class="nav-link" href="{{ p.url | relative_url }}">{{ p.title }} -->
    <a class="nav-link" href="{{ p.url | relative_url }}">{% t p.title %}</a></a
  ></a
>
```

{%endraw%}

Agora execute seu site novamente e você verá que os títulos têm os valores corretos. Você pode até alterar o idioma clicando no link e ver que os títulos mudam de acordo.

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/header_pt-br.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Cabeçalho em português.
</div>

## Corrigindo a navegação traduzida

Tudo parece funcionar bem, só que não. Se você clicar no botão `PT-BR` no cabeçalho, depois clicar em outra página (por exemplo, repositórios), os títulos serão alterados novamente para inglês. Para lidar com esse tipo de situação, temos que garantir que, quando o usuário clicar nos links do cabeçalho, ele manterá o idioma. Vamos fazer isso primeiro para a página `about`. Para fazer isso, abra o arquivo `_includes/header.html` e mude o link para a página `sobre`, para que ele use a variável `site.baseurl` ao invés de `relative_url`. Mais especificamente, faça as seguintes alterações:

{%raw%}

```html
<!-- <a class="nav-link" href="{{ '/' | relative_url }}">{% t about_title %} -->
<a class="nav-link" href="{{ '/' | prepend: site.baseurl}}">{% t about_title %}</a>
```

{%endraw%}

Agora, se você estiver em outra página, por exemplo, a página `repositories`, e clicar no botão `PT-BR`, depois clicar na página `about`, ele vai manter o idioma nos títulos. Agora, vamos habilitar isso para todas as outras páginas. Para isso, abra o arquivo `_includes/header.html` novamente e faça as seguintes alterações:

{%raw%}

```html
<!-- <a class="nav-link" href="{{ '/blog/' | relative_url }}">{{ site.blog_nav_title }} -->
<a class="nav-link" href="{{ '/blog/' | prepend: site.baseurl }}"
  >{{ site.blog_nav_title }}

  <!-- <a class="dropdown-item" href="{{ child.permalink | relative_url }}">{% t child.title %}</a> -->
  <a class="dropdown-item" href="{{ child.permalink | prepend: site.baseurl }}">{% t child.title %}</a>

  <!-- <a class="nav-link" href="{{ p.url | relative_url }}">{% t p.title %} -->
  <a class="nav-link" href="{{ p.url | prepend: site.baseurl }}">{% t p.title %}</a></a
>
```

{%endraw%}

## Adicionando títulos traduzidos dentro das páginas

Agora tudo funciona! O sol está nascendo e o mundo está colorido novamente :rainbow:. Mas espera, ainda faltam algumas coisas. Se você clicar no botão `PT-BR`, depois clicar na página `publicações`, você verá que o título da página ainda é `titles.publications`.

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/publications_title_wrong.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    O que deveria ser um título traduzido.
</div>

Que merda, isso vai acabar algum dia? :scream: Bem, sim, vai. Só precisamos dizer às páginas para usar o título traduzido correto. Para isso, vamos ver quais templates as páginas usam. A página `publications` por exemplo, que está localizada no arquivo `_pages/publications.md`, utiliza o template `page`, como pode ser visto na seguinte linha no início do arquivo:

```yaml
layout: page
```

Então, vamos abrir o arquivo `_layouts/page.html` e alterar o título para usar a função `t`. Mais especificamente, faça as seguintes alterações:

{%raw%}

```html
<!-- <h1 class="post-title">{{ page.title }}</h1> -->
<h1 class="post-title">{% t page.title %}</h1>
```

{%endraw%}

Agora, se você executar seu site, ele não funcionará. Isso acontece porque a função `t` agora está tentando traduzir uma variável que não está definida. Mas onde? Se você fizer uma pequena pesquisa, notará que a página `publications` não é a única que usa o `layout: page`. Todas as páginas que o utilizam são:

- 404.html
- news.html
- \_pages/dropdown.md
- \_pages/projects.md
- \_pages/publications.md
- \_pages/repositories.md
- \_pages/teaching.md
- \_projects/1_project.md
- \_projects/2_project.md
- \_projects/3_project.md
- \_projects/4_project.md
- \_projects/5_project.md
- \_projects/6_project.md

Você precisa alterar o `title` de **TODAS** essas páginas. Nós já fizemos isso para as páginas dentro de `_pages/`, então vamos fazer para o resto. Abra o arquivo `404.html` e altere seu `title: "Page not found"` para `title: title.unk`, pois já definimos `titles.unk` em `_i18n/en.yml` e `_i18n /pt-br.yml`. Para manter a seção de projetos mais organizada, vamos criar novos atributos para ela dentro de cada um dos arquivos de tradução. Assim, os novos `_i18n/en.yml` e `_i18n/pt-br.yml` ficarão assim, respectivamente:

```yaml
titles:
  about: about
  blog: blog
  cv: cv
  news: news
  projects: projects
  publications: publications
  repositories: repositories
  teaching: teaching
  submenus: submenus
  unk: page not found
projects:
  titles:
    project1: Project 1
    project2: Project 2
    project3: Project 3
    project4: Project 4
    project5: Project 5
    project6: Project 6
```

```yaml
titles:
  about: sobre
  blog: blog
  cv: cv
  news: novidades
  projects: projetos
  publications: publicações
  repositories: repositórios
  teaching: ensino
  submenus: submenus
  unk: página não encontrada
projects:
  titles:
    project1: Projeto 1
    project2: Projeto 2
    project3: Projeto 3
    project4: Projeto 4
    project5: Projeto 5
    project6: Projeto 6
```

Agora, tudo o que precisamos fazer é abrir todos os arquivos dentro de `_projects/` e alterar seus títulos. Para o arquivo `_projects/1_project.md`, por exemplo, ficará assim:

```yaml
title: projects.titles.project1
```

Finalmente, podemos executar nosso site novamente e ele funcionará conforme o esperado. :tada:.

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/publications_title_fixed.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Agora ISSO é um título traduzido.
</div>

Não se esqueça de fazer o mesmo para as outras páginas que usam layouts diferentes, como `cv`. Abra o arquivo `_layouts/cv.html` e modifique:

{%raw%}

```html
<!-- <h1 class="post-title">{{ page.title }} {% if page.cv_pdf %}<a href="{{ page.cv_pdf | prepend: 'assets/pdf/' | relative_url}}" target="_blank" rel="noopener noreferrer" class="float-right"><i class="fas fa-file-pdf"></i></a>{% endif %}</h1> -->
<h1 class="post-title">
  {% t page.title %} {% if page.cv_pdf %}<a
    href="{{ page.cv_pdf | prepend: 'assets/pdf/' | relative_url}}"
    target="_blank"
    rel="noopener noreferrer"
    class="float-right"
    ><i class="fas fa-file-pdf"></i></a
  >{% endif %}
</h1>
```

{%endraw%}

## Adicionando conteúdo traduzido

Agora, vamos ver como adicionar conteúdo traduzido. Por exemplo, digamos que queremos traduzir a biografia na página `sobre`. A melhor maneira de fazer isso é criar partes traduzidas das páginas para cada idioma e importar a versão correta. Para isso, recorte toda a parte da biografia da página `about` (`_pages/about.md`), deixando apenas o cabeçalho. Em seguida, crie um novo arquivo `_i18n/en/pages/about.md` e cole o conteúdo lá. Faça o mesmo para o arquivo `_i18n/pt-br/pages/about.md`, mas adicionando a versão traduzida. Agora, no arquivo `_pages/about.md`, adicione a função [translate_file](https://github.com/kurtsson/jekyll-multiple-languages-plugin#52-inclusive-translated-files), apontando para os novos arquivos de sobre. O `_pages/about.md` final ficará assim:

{%raw%}

```html
---
layout: about
title: titles.about
subtitle: <a href='#'>Affiliations</a>. Address. Contacts. Moto. Etc.
permalink: /

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  address: >
    <p>555 your office number</p>
    <p>123 your address street</p>
    <p>Your City, State 12345</p>

news: true # includes a list of news items
selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page
---

{% translate_file pages/about.md %}
```

{%endraw%}

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/about_pt-br.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Biografia em português.
</div>

## Resolvendo o título da página no browser

Atualmente, quando você abre uma seção do seu site, na aba do navegador o nome da seção não é traduzido. Para resolver isso, abra o arquivo `_includes/metadata.html` e altere o seguinte código:

{% raw %}

```liquid
{% if page.url == '/blog/index.html' %}
  {{ site.blog_nav_title }} | {{ title }}
{%- elsif page.title != 'blank' and page.url != '/' -%}
  {{ page.title }} | {{ title }}
{%- else -%}
  {{ title }}
{%- endif -%}
```

{% endraw %}

por esse código:

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

Isso irá gerar outro problema, causado pelo título da segunda notícia na página de sobre. Precisamos adicionar um título traduzido para esta notícia. Agora, faça as seguintes alterações:

Arquivo `_news/announcement_2.md`:

```yaml
# title: A long announcement with details
title: news.titles.news2
```

Arquivo `_i18n/en.yml`:

```yaml
news:
  titles:
    news2: A long announcement with details
```

Arquivo `_i18n/pt-br.yml`:

```yaml
news:
  titles:
    news2: Um anúncio longo com detalhes
```

## Resumindo

Adicionar uma versão traduzida do seu site não é difícil, mas é meio chato. Mesmo com a ajuda deste [ótimo plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin), existem alguns pequenos detalhes que, se perdidos, levarão muito tempo e paciência para dominar (pelo menos me levou). Há algumas coisas que podem ser feitas também, como traduzir a descrição das páginas e mais conteúdo, mas como isso pode ser feito com base nos mesmos conceitos que mostrei aqui, vou deixar como lição de casa :laughing:. Vou detalhar como criar versões traduzidas do cv e blog em outros posts, já que esse já tá bem longo. Espero que este post tenha sido útil para você. Se você tiver alguma dúvida, sinta-se à vontade para perguntar nos comentários.
