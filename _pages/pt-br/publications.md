---
page_id: publications
layout: page
permalink: /publications/
title: Publicações
description: Publicações selecionadas
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->
<div class="publications" style="--stagger: {{ animation_count }};" data-animate>
{% assign animation_count = animation_count | plus: 1 %}

{% bibliography %}

</div>