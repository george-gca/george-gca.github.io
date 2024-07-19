---
layout: post
title: adding search with ninja keys
date: 2024-05-15 10:35:00
description: How to add search functionality to your website using ninja keys
tags: programming code web
categories: web
giscus_comments: true
related_posts: true
---

I've been working on a new project, and I wanted to add a search functionality to it. I've seen some websites that use a search bar, but I wanted something different. I wanted to use ninja keys to search for content. Here is how I did it.

## Setting up the project

I'm using [Eleventy](https://www.11ty.dev/) to generate my website. It's a static site generator that allows you to use different templating engines. I'm using [Nunjucks](https://mozilla.github.io/nunjucks/) for my project. I've created a new folder called `search` inside the `_includes` folder. Inside this folder, I've created a new file called `search.njk`. This file will contain the search functionality.
