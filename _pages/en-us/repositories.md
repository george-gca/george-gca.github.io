---
page_id: repositories
layout: page
permalink: /repositories/
title: repositories
description: Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.
nav: true
nav_order: 4
---

## GitHub users

{: style="--stagger: {{ animation_count }};" data-animate}
{% assign animation_count = animation_count | plus: 1 %}

{% if site.data.repositories.github_users %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center" style="--stagger: {{ animation_count }};" data-animate>
{% assign animation_count = animation_count | plus: 1 %}
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
    {% include repository/repo_languages.liquid username=user %}
  {% endfor %}
</div>

---

{% if site.repo_trophies.enabled %}
{% for user in site.data.repositories.github_users %}
{% if site.data.repositories.github_users.size > 1 %}

  <h4 style="--stagger: {{ animation_count }};" data-animate>{{ user }}</h4>
  {% assign animation_count = animation_count | plus: 1 %}
  {% endif %}
  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center" style="--stagger: {{ animation_count }};" data-animate>
  {% assign animation_count = animation_count | plus: 1 %}
  {% include repository/repo_trophies.liquid username=user %}
  </div>

---

{% endfor %}
{% endif %}
{% endif %}

## GitHub Repositories

{: style="--stagger: {{ animation_count }};" data-animate}
{% assign animation_count = animation_count | plus: 1 %}

{% if site.data.repositories.github_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center" style="--stagger: {{ animation_count }};" data-animate>
{% assign animation_count = animation_count | plus: 1 %}
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
