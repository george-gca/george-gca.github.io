---
page_id: publications
layout: page
permalink: /publications/
title: publicações
description: publicações por categoria em ordem cronológica reversa. gerado pelo jekyll-scholar.
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->
<div class="publications" style="--stagger: {{ animation_count }};" data-animate>
{% assign animation_count = animation_count | plus: 1 %}

{% bibliography %}

</div>
