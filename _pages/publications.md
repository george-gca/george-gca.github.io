---
layout: page
title: titles.publications
description: descriptions.publications
permalink: /publications/
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->
<div class="publications" style="--stagger: {{ animation_count }};" data-animate>
{% assign animation_count = animation_count | plus: 1 %}

{% bibliography %}

</div>
