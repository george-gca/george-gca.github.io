---
layout: post
title: Creating localized blog posts
date: 2022-09-30 17:40:13
description: How to create localized blog on your al-folio website.
tags: al-folio website jekyll localization languages
categories: website development
giscus_comments: true
related_posts: false
---

This post is part of a series of posts that explain how to set up your own site based on the al-folio theme and add support for a second language:

- [Running locally your own al-folio website]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %})
- [Turning your al-folio into a dual-language website]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %})
- [Creating localized CV pages]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %})
- [Creating localized Projects pages]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- Creating localized blog posts

---

We [created a local al-folio website]({{ site.baseurl_root }}{% post_url 2022-09-27-running-local-al-folio %}), [added support for another language in it]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %}), [created localized CV pages]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %}), and [project pages]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %}). Now, let's localize the blog part.

## Creating the structure

If you go to the blog section of your al-folio site, you'll realize that it is quite empty, although there are posts in the template. Actually, the [Jekyll Multiple Languages Plugin](https://github.com/kurtsson/jekyll-multiple-languages-plugin) already support [localized blog posts](https://github.com/kurtsson/jekyll-multiple-languages-plugin#57-creating-posts). It is not displaying them because it is not finding them. So, let's create the correct structure for them. Create a `_posts/` directory inside each language under the `_i18n/` directory, and copy the content of the `_posts/` directory from the root of the website to the language directories. So, for example, if you have a `_posts/` directory with the following content:

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

You should create the following structure for all your languages, in this example, the English language:

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

Create that, translate the pages contents, and it will now show the missing blog posts. Easy, right? Errr, you are missing a few small details: the date format, the reading time, and the link when clicking on a tag in the header of the blog section. The bad news is that Jekyll doesn't natively support localized date formats. The good news is that it is not that hard to create it though. Let's start with the date format.

## Localizing the date format

There are two main formats of date used in the template: in the posts list and inside the posts, with the format `September 28, 2020`, and when filtering the posts (e.g.: by tag), with the format `Sep 28, 2020`. The easiest way I found of localizing them is by first manually translating the months names. For this, add the following section to your language files (`_i18n/en.yml` and `_i18n/pt-br.yml`), translating the months names to your language:

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

Since the dates are used in a variety of locations, let's create a function to reuse the code. Create the file `_includes/date_format.html` with the following code:

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

This code defines a function that extracts the month, day, and year from the `date_from` variable, formats according to `format`, and returns the formatted localized string. Notice that, to access the given variables, we must refer to them preceded with `include.`. The `format` variable can be either `long` or `short`, as we defined above, and the `date_from` variable must have a date object inside it. The function also considers the current language. Now, let's call the function with the proper parameters. Inside the file `blog/index.html`, do the following changes:

{% raw %}

```html
<!-- {{ post.date | date: '%B %-d, %Y' }} -->
{% include date_format.html format="long" date_from=post %}
```

{% endraw %}

The posts list will now display the date format correctly. Just do the same changes for every other place where the date format appears, like the filters pages, changing the month format to `"short"` when needed, and also giving the correct `date_from` parameter. For example, for the file `_layouts/archive-category.html` the change will be:

{% raw %}

```html
<!-- <th scope="row">{{ post.date | date: "%b %-d, %Y" }}</th> -->
<th scope="row">{% include date_format.html format="short" date_from=post %}</th>
```

{% endraw %}

## Localizing the reading time

Now, let's localize the reading time. Do the following changes to the file `blog/index.html`:

{% raw %}

```html
<!-- {{ read_time }} min read &nbsp; &middot; &nbsp; -->
{% if site.lang == 'en' %}{{ read_time }} min read{% else %}Leitura de {{ read_time }} min{% endif %} &nbsp; &middot; &nbsp;
```

{% endraw %}

## Fixing blog archive navigation

When you click to filter blog posts by tag, year, or category, the page will show the posts, but the navigation will be broken. This is because these navigations are not localized. To fix this, modify the following lines in files `_layouts/archive-category.html`, `_layouts/archive-tag.html`, and `_layouts/archive-year.html`:

{% raw %}

```html
<!-- <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a> -->
<a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
```

{% endraw %}

Also, change the following line in the file `blog/index.html`:

{% raw %}

```html
<!-- <i class="fas fa-hashtag fa-sm"></i> <a href="{{ tag | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a> -->
<i class="fas fa-hashtag fa-sm"></i> <a href="{{ tag | prepend: '/blog/tag/' | prepend: site.baseurl }}">{{ tag }}</a>
```

{% endraw %}

## Fixing pagination

If your blog has enough posts to enable more pages with results (pagination), you'll realize that it is not yet translated. To fix this, first we need to create localized words for `Older` and `Newer` in the language files `_i18n/en.yml` and `_i18n/pt-br.yml`, respectivelly:

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

Next, we change all uses of `relative_url` for `prepend: site.baseurl` in the file `_includes/pagination.html`, so it correctly handles the language urls. Also, change the words "Newer" and "Older" for its correspondent translation from the correct language file:

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

## Fixing page title in the browser

If you filter your blog posts by year, you'll notice that the year is not displayed in the browser title. To fix this, modify the following lines in the file `_includes/metadata.html`:

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

for these:

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
