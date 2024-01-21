---
layout: page
title: titles.repositories
description: descriptions.repositories
permalink: /repositories/
nav: true
nav_order: 4
---

## {% t repositories.users %}
{: .animated_section}

{% if site.data.repositories.github_users %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center animated_section">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
    {% include repository/repo_languages.liquid username=user %}
  {% endfor %}
</div>

---

{% if site.repo_trophies.enabled %}
{% for user in site.data.repositories.github_users %}
{% if site.data.repositories.github_users.size > 1 %}

  <h4 class="animated_section">{{ user }}</h4>
  {% endif %}
  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center animated_section">
  {% include repository/repo_trophies.liquid username=user %}
  </div>

---

{% endfor %}
{% endif %}
{% endif %}

## {% t repositories.repos %}
{: .animated_section}

{% if site.data.repositories.github_repos %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center animated_section">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
