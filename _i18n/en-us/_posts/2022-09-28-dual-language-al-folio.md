---
layout: post
title: Turning your al-folio into a dual-language website
date: 2022-09-28 11:29:13
description: Adding support for another language in your al-folio.
tags: al-folio website jekyll localization languages
categories: website development
giscus_comments: true
related_posts: false
---

This post is part of a series of posts that explain how to set up your own site based on the al-folio theme and add support for a second language:

- [Running locally your own al-folio website]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %})
- Turning your al-folio into a dual-language website
- [Creating localized CV pages]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %})
- [Creating localized Projects pages]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- [Creating localized blog posts]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-blog %})

---

[al-folio](https://github.com/alshedivat/al-folio) is a great theme for Jekyll websites. It is very customizable and easy to use, with support for blogging, repository information, projects, and more (see [demo](https://alshedivat.github.io/al-folio/)). However, it does not support multiple languages out of the box. This post will show you how to add support for another language in your al-folio. I'll add support for `pt-BR`, since it is my mother language. I'll assume you have already [cloned your copy of the al-folio repository and have it running locally]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %}).

## Installing dependencies

We will do this with the help of the [Jekyll Multiple Languages Plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin). It adds i18n support for Jekyll. To install it, add the following line to your `Gemfile` under the `group :jekyll_plugins do`:

```ruby
gem 'jekyll-multiple-languages-plugin'
```

Also, add the following line to your `_config.yml` under `plugins:`:

```yaml
- jekyll-multiple-languages-plugin
```

and the following lines after it (outside `plugins`), for example, before the `Jekyll Minifier` section:

```yaml
# multi language settings
languages: ["en", "pt-br"]
default_locale_in_subfolder: false
```

Setting `default_locale_in_subfolder` to `false` will make your main language be the root of your website, instead of being in a subfolder. For example, instead of `https://george-gca.github.io/en/`, it will be `https://george-gca.github.io/`. This is the default behavior of al-folio, so we will keep it. The first language in the list will be the default language, English in this case. Then, run `bundle install` to install the plugin.

## Creating translation files

Create a folder called `_i18n` and add sub-folders for each language, using the same names used on the `languages` setting on the `_config.yml` we just added. Also, create a `yml` file for each language. For example, for `pt-br`, create a folder called `_i18n/pt-br`. Then, create a file called `_i18n/pt-br.yml`. Our directory structure should look like this:

- \_i18n/en.yml
- \_i18n/pt-br.yml
- \_i18n/en/
- \_i18n/pt-br/

## Adding language toggle

Now, we need to add a language toggle to our website. We will add it to the navigation bar. Open the file `_includes/header.html` and add the following code before the `Toogle theme mode` area:

{%raw%}

```html
<!-- Toogle language -->
<li class="nav-item active">
  {% if site.lang == "en" %}
  <a class="nav-link" href="{{site.baseurl_root}}/pt-br{{page.url}}"> PT-BR </a>
  {% elsif site.lang == "pt-br" %}
  <a class="nav-link" href="{{site.baseurl_root}}{{page.url}}"> EN </a>
  {% endif %}
</li>
```

{%endraw%}

This will add a link to the other language. The `page.url` will keep the current page, so the user will not be redirected to the home page. Note that `site.baseurl_root` is a variable introduced by the Jekyll Multiple Languages Plugin, and it points to the root of the page without the language path. More information about the newly added variables can be found [here](https://github.com/kurtsson/jekyll-multiple-languages-plugin#55-link-between-languages).

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/header_en.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Header with language toggle.
</div>

## Adding translated titles

Until now, we added everything we needed to support the translation, but haven't done the translation per se. We will start that now. Open the file `_i18n/en.yml` and add the following lines:

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

This will add the titles for the pages. Now, open the file `_i18n/pt-br.yml` and add the following lines:

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

This will add the titles for the pages in Portuguese. Now that we have the translated titles, we have to tell the pages to use these instead of the hardcoded ones. To do so, open all the pages under the `_pages` folder and change their title to use the correct `titles` variable. For example, the new title for the `about.md` page should look like this:

```yaml
title: titles.about
```

If you run your website now, you'll see that the titles are shown as `titles.about` instead of just `about` as it was supposed to, since its default is in English. We still need to tell the html templates to select the correct translated version of these variables. To do so, open the file `_includes/header.html` and change all the `title` variables to use the [t function](https://github.com/kurtsson/jekyll-multiple-languages-plugin#51-translating-strings). The `t` function, or its longer version `translate`, will ensure that it will select the correct version from the current language yml file. More specifically, do the following changes:

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

Now run your website again and you'll see that the titles have the correct values. You can even change the language on the toggle and see that the titles change accordingly.

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/header_pt-br.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Header in Portuguese.
</div>

## Fixing translated navigation

Everything seems to work fine, except not. If you click in the `PT-BR` toggle in the header, then click in another page (e.g. repositories), it will change again the titles to English. To handle this kind of situation, we have to make sure that when the user clicks the header links, it will keep the language. Lets do this first for the `about` page. To do so, open the file `_includes/header.html` and change the link to the `about` page to use the `site.baseurl` variable instead of the `relative_url`. More specifically, do the following changes:

{%raw%}

```html
<!-- <a class="nav-link" href="{{ '/' | relative_url }}">{% t about_title %} -->
<a class="nav-link" href="{{ '/' | prepend: site.baseurl}}">{% t about_title %}</a>
```

{%endraw%}

Now, if you are in another page, for example, the `repositories` page, and click in the `PT-BR` toggle, then click in the `about` page, it will keep the language in the titles. Now, let's enable this for all the other pages. To do so, open the file `_includes/header.html` again and do the following changes:

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

## Adding translated titles inside the pages

Now everything is working fine! The sun is rising, and the world is colorful again :rainbow:. But wait, there is still stuff missing. If you click in the `PT-BR` toggle, then click in the `publicações` page, you'll see that the title of the page is still `titles.publications`.

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/publications_title_wrong.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    What should be a translated title.
</div>

Oh crap, will this ever end someday? :scream: Well, yes, it will. We just need to tell the pages to use the correct translated title. To do so, let's see which templates do the pages use. The page `publications` for example, which is located in file `_pages/publications.md`, uses the template `page`, as can be seen by the following line in the beginning of the file:

```yaml
layout: page
```

So, lets open the file `_layouts/page.html` and change the title to use the `t` function. More specifically, do the following changes:

{%raw%}

```html
<!-- <h1 class="post-title">{{ page.title }}</h1> -->
<h1 class="post-title">{% t page.title %}</h1>
```

{%endraw%}

Now, if you run your website, it will not work. This happens because the `t` function is now trying to translate a variable that is not defined. But where? If you do a little search, you'll notice that the `publications` page is not the only one that uses the `layout: page`. All pages that use it are:

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

You need to change the `title` for **ALL** these pages. We already did it for the pages inside `_pages/`, so let's do it for the rest. Open the file `404.html` and change its `title: "Page not found"` to `title: titles.unk`, since we already defined `titles.unk` in both `_i18n/en.yml` and `_i18n/pt-br.yml`. To keep the projects section more organized, let's create new attributes for it inside each of the translation files. So, the new `_i18n/en.yml` and `_i18n/pt-br.yml` will look like this, respectively:

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

Now, all we have to do is open all the files inside `_projects/` and change its titles. For the file `_projects/1_project.md`, for example, will look like this:

```yaml
title: projects.titles.project1
```

Finally, we can run our website again and it will work as expected. :tada:.

{% include figure.liquid path="assets/img/blog/2022-09-28-dual-language-al-folio/publications_title_fixed.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Now THIS is a translated title.
</div>

Don't forget to do the same for the other pages that use different layouts, like `cv`. Open the file `_layouts/cv.html` and modify:

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

## Adding translated content

Now, let's see how to add translated content. For example, let's say that we want to translate the biography in the `about` page. The best way to achieve this is to create translated parts of the pages for each language, and then import the correct version. For this, cut the whole biography part of the `about` page (`_pages/about.md`), leaving only the header. Then, create a new file `_i18n/en/pages/about.md` and paste the content there. Do the same for the file `_i18n/pt-br/pages/about.md`, but adding the translated version. Now, in the file `_pages/about.md`, add the [translate_file](https://github.com/kurtsson/jekyll-multiple-languages-plugin#52-including-translated-files) function, pointing to the new about files. The final `_pages/about.md` will look like this:

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
    Biography in Portuguese.
</div>

## Fixing page title in the browser

Currently, when you open a section of your site, in the browser tab the section name is not translated. To solve this, open the file `_includes/metadata.html` and change the following code:

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

for this code:

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

This will trigger another problem, caused by the title of the second news in the about page. We need to add a translated title for this new. Now, do the following changes:

File `_news/announcement_2.md`:

```yaml
# title: A long announcement with details
title: news.titles.news2
```

File `_i18n/en.yml`:

```yaml
news:
  titles:
    news2: A long announcement with details
```

File `_i18n/pt-br.yml`:

```yaml
news:
  titles:
    news2: Um anúncio longo com detalhes
```

## Summing up

Adding a translated version of your site is not hard, but it is kind of annoying. Even with the help of this [great plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin), there are some little details that, if missed, will take a lot of time and patience to master (at least took me). There are a few things that can be done also, like translating the description of the pages and more of their content, but since these can be done based on the same concepts that I showed here, I'll leave it as a homework :laughing:. I will detail how to create translated versions of your cv and blog in other posts, since this one is already really long. I hope this post was useful to you. If you have any questions, feel free to ask in the comments.
