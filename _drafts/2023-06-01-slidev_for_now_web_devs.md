---
layout: post
title:  Sli.dev for non-web developers
date:   2023-06-01 17:19:10
description: How to setup and use Sli.dev for non-web developers
tags: programming code slides sli.dev web
categories: web
giscus_comments: true
related_posts: true
---

I always struggled every time I had to do a new presentation. Don't get me wrong, Google Slides is good, and suffices for most common use cases. The problem is when the slides keeps changing, and you want to do some versioning on them. I made some slides in the past using LaTeX with the Beamer class. A friend even showed me a [nicer template](https://github.com/deuslirio/UFGTeX-Presentation) than the default ones. The problem is, though this solution is portable (you can generate a PDF file), it lacks some features that I wanted, like animations and transitions.

I took a look at [Reveal.js](https://revealjs.com/), but it was too much work to setup and maintain. I also went for [Remark](https://remarkjs.com/), but the [last update](https://github.com/gnab/remark) was more than 2 years ago. That's when I found [Sli.dev](https://sli.dev/). It's a framework [under constant development](https://github.com/slidevjs/slidev) for creating slides using Markdown. It's based on a lot of web technologies, but you don't need to be fluent on them to use it.

## Installing node version manager (nvm)

[nvm](https://github.com/nvm-sh/nvm) allows you to quickly install and use different versions of node via the command line. To install the latest version, run the following command:

```bash
get_latest_github_raw_no_v() {
  # use it for when the link for the download doesn't have a version included in the name of the file
  # e.g.: https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
  # usage: get_latest_github_raw_no_v "user/repo" "filename"
  version=$(curl --silent "https://api.github.com/repos/$1/releases/latest" |  # Get latest release from GitHub api
    grep '"tag_name":' |                                             # Get tag line
    sed -E 's/.*"([^"]+)".*/\1/')                                    # Pluck JSON value
  echo "https://raw.githubusercontent.com/$1/$version/"$2
}

# Install node version manager (nvm)
site=$(get_latest_github_raw_no_v "nvm-sh/nvm" "install.sh")
curl -o- $site | bash
```

Then, add the following lines to your `~/.bashrc` file:

```bash
# enable node version manager
if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
fi
```

And restart your terminal, or just reload the `~/.bashrc` file:

```bash
. ~/.bashrc
```

## Installing Node (latest version)

To install the latest node version, run the following command:

```bash
nvm install $(nvm ls-remote | grep -i latest | tail -n 1 | sed -ne 's/[^v0-9]*\(\([0-9]*\.\)\{0,4\}[0-9][^.]\).*/\1/p' | xargs)
```

In my case, the latest version in `v20.2.0`. You can check your version by running:

```bash
node --version
```

## Installing Sli.dev

To install Sli.dev, simply run:

```bash
npm init slidev
```

This command will install everything you need, ask for the project name, and start the template project. After the installation, you should see the following lines in your terminal:

```bash
public slide show   > http://localhost:3030/
  presenter mode      > http://localhost:3030/presenter/
  remote control      > pass --remote to enable

  shortcuts           > restart | open | edit
```

If the browser did not open automatically, you can open it manually by accessing the URL `http://localhost:3030/`. To stop running the server, just press `Ctrl+C` in the terminal. After stopped, you can start the development server again by running:

```bash
npm run-script dev
```
