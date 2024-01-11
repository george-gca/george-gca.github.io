---
layout: post
title: Running locally your own al-folio website
date: 2022-09-27 22:13:16
description: Step by step on how to run your own al-folio locally.
tags: al-folio website jekyll local
categories: website development
giscus_comments: true
related_posts: false
---

This post is part of a series of posts that explain how to set up your own site based on the al-folio theme and add support for a second language:

- Running locally your own al-folio website
- [Turning your al-folio into a dual-language website]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %})
- [Creating localized CV pages]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %})
- [Creating localized Projects pages]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- [Creating localized blog posts]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-blog %})

---

I decided to write this post because I had a hard time figuring out how to run my own Jekyll page locally, especially since I don't regularly use Jekyll. I hope this post will help you to run your own [al-folio](https://alshedivat.github.io/al-folio/) website locally, or whatever other Jekyll-based theme you have.

## Installing Ruby and rbenv

I ran my code in a native Linux environment (Ubuntu 22.04.1 LTS), but I tested it in a [WSL environment](https://learn.microsoft.com/en-us/windows/wsl/install) as well. First things first: you need to install Ruby language support. The [recommended way](https://github.com/alshedivat/al-folio#local-setup-standard) by the al-folio creators is using [rbenv](https://github.com/rbenv/rbenv). For those familiar with Python, `rbenv` is similar to `pyenv`. To install `rbenv`, run the following commands:

```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv && src/configure && make -C src
```

This will download the `rbenv` repository to your home directory, and then compile it. **DON'T** install it via `apt`, since it will download an older version of the package, and will not allow you to install the latest Ruby versions. Next, add the following lines to your `~/.bashrc` file:

```bash
# enable rbenv
if [ -d "$HOME/.rbenv/" ]; then
    export PATH="$HOME/.rbenv/bin:$PATH"
    eval "$(rbenv init - bash)"
fi
```

Then, restart your terminal or run `. ~/.bashrc` to reload your bash settings. This will make the `rbenv` command available in your terminal. To test if this is working properly, run `curl -fsSL https://github.com/rbenv/rbenv-installer/raw/main/bin/rbenv-doctor | bash`. It should output something similar to this:

```
Checking for `rbenv' in PATH: /home/gca/.rbenv/bin/rbenv
Checking for rbenv shims in PATH: Not found
Checking `rbenv install' support: /home/gca/.rbenv/plugins/ruby-build/bin/rbenv-install (ruby-build 20220910.1-10-gecb9d22)
Counting installed Ruby versions: 1 versions
Auditing installed plugins: OK
```

It will display an error in line `Checking for rbenv shims in PATH`. Don't worry, this will be fixed. Next, you need to install [ruby-build](https://github.com/rbenv/ruby-build) as a `rbenv` plugin, so you can easily download and install different versions of Ruby. To do so, run the following commands:

```bash
mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
```

To check which versions of Ruby are available to install, simply run `rbenv install --list`. You can install any version you want, but I recommend installing the latest stable version. At the time of writing, it is version 3.1.2. To install it, you need first to install the ssl dependency and then the Ruby version.

```bash
sudo apt install -y libssl-dev
rbenv install 3.1.2
```

## Installing al-folio dependencies

Now that you have Ruby installed, you can install al-folio dependencies. First, clone the al-folio repository to your local machine. Then, enter the repository directory and create a local Ruby environment with the installed Ruby version. Next, install the `bundle` package, so it will take care of installing the rest of the dependencies. To do all of this, run the following commands:

```bash
git clone ~/git@github.com:alshedivat/al-folio.git
cd ~/al-folio
rbenv local 3.1.2
gem install bundle
bundle install
```

Since al-folio supports `jupyter` notebooks, we also need to install it. If you are not planning to use notebooks that much, you can install it via [pipx](https://github.com/pypa/pipx). To install both `pipx` and `jupyter`, run the following commands:

```bash
# this can also be done via apt with `sudo apt install -y pipx`
python3 -m pip install --user pipx
pipx install jupyter
```

## Running al-folio locally

From now on, you can run the site locally. All you need to do is to open the al-folio directory and call Jekyll:

```bash
bundle exec jekyll serve --lsi
```

Happy coding!
