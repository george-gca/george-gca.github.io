---
layout: post
title: Executando localmente seu próprio site al-folio
date: 2022-09-27 22:13:16
description: Passo a passo sobre como executar seu próprio al-folio localmente.
tags: al-folio website jekyll local
categories: website development
giscus_comments: true
related_posts: false
---

Este post faz parte de uma série de posts que explicam como configurar seu próprio site baseado no tema al-folio e adicionar suporte a uma segunda língua:

- Executando localmente seu próprio site al-folio
- [Tornando seu al-folio em um site com dois idiomas]({{ site.baseurl_root }}{% post_url 2022-09-28-dual-language-al-folio %})
- [Criando páginas de CV traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-29-localized-cv %})
- [Criando páginas de projetos traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-projects %})
- [Criando postagens de blog traduzidas]({{ site.baseurl_root }}{% post_url 2022-09-30-localized-blog %})

---

Decidi escrever este post porque tive dificuldade em descobrir como executar minha própria página Jekyll localmente, principalmente porque eu não uso regularmente o Jekyll. Espero que este post ajude você a executar seu próprio site [al-folio](https://alshedivat.github.io/al-folio/) localmente, ou qualquer outro tema baseado em Jekyll que você tenha.

## Instalando Ruby e rbenv

Meu código foi executado em um ambiente Linux nativo (Ubuntu 22.04.1 LTS), mas também testei em um [ambiente WSL](https://learn.microsoft.com/pt-br/windows/wsl/install) . Primeiro você precisa instalar o suporte à linguagem Ruby. A [maneira recomendada](https://github.com/alshedivat/al-folio#local-setup-standard) pelos criadores do al-folio é usar [rbenv](https://github.com/rbenv/rbenv). Para aqueles familiarizados com Python, `rbenv` é semelhante ao `pyenv`. Para instalar o `rbenv`, execute os seguintes comandos:

```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
cd ~/.rbenv && src/configure && make -C src
```

Isso fará o download e compilação do repositório `rbenv` no seu home. **NÃO** instale via `apt`, pois ele baixa uma versão mais antiga do pacote e não permite que você instale as versões mais recentes do Ruby. Em seguida, adicione as seguintes linhas ao seu arquivo `~/.bashrc`:

```bash
# habilita o rbenv
if [ -d "$HOME/.rbenv/" ]; then
    export PATH="$HOME/.rbenv/bin:$PATH"
    eval "$(rbenv init - bash)"
fi
```

Reinicie seu terminal ou execute `. ~/.bashrc` para recarregar suas configurações do bash. Isso tornará o comando `rbenv` disponível no terminal. Para testar se está funcionando corretamente, execute `curl -fsSL https://github.com/rbenv/rbenv-installer/raw/main/bin/rbenv-doctor | bash`. Ele deve produzir algo semelhante a isso:

```
Checking for `rbenv' in PATH: /home/gca/.rbenv/bin/rbenv
Checking for rbenv shims in PATH: Not found
Checking `rbenv install' support: /home/gca/.rbenv/plugins/ruby-build/bin/rbenv-install (ruby-build 20220910.1-10-gecb9d22)
Counting installed Ruby versions: 1 versions
Auditing installed plugins: OK
```

Vai aparecer um erro na linha `Checking for rbenv shims in PATH`. Não se preocupe, isso vai ser corrigido. Em seguida, você precisa instalar o [ruby-build](https://github.com/rbenv/ruby-build) como um plugin do `rbenv`, para que você possa facilmente baixar e instalar diferentes versões do Ruby. Para isso, execute os seguintes comandos:

```bash
mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
```

Para verificar quais versões do Ruby estão disponíveis para instalação, basta executar `rbenv install --list`. Você pode instalar qualquer versão que desejar, mas recomendo instalar a versão estável mais recente. No momento é a versão 3.1.2. Para instalá-la, você precisa primeiro instalar a dependência ssl e depois a versão do Ruby.

```bash
sudo apt install -y libssl-dev
rbenv install 3.1.2
```

## Instalando as dependências do al-folio

Agora que você tem o Ruby instalado, você pode instalar as dependências do al-folio. Primeiro, clone o repositório al-folio em sua máquina local. Em seguida, entre no diretório do repositório e crie um ambiente Ruby local com a versão do Ruby instalada. Em seguida, instale o pacote `bundle`, para que ele se encarregue de instalar o restante das dependências. Para fazer tudo isso, execute os seguintes comandos:

```bash
git clone ~/git@github.com:alshedivat/al-folio.git
cd ~/al-folio
rbenv local 3.1.2
gem install bundle
bundle install
```

Também é necessário instalar o pacote `jupyter`, já que o al-folio suporta `jupyter` notebooks. Se você não planeja usar notebooks com tanta frequência, pode instalar via [pipx](https://github.com/pypa/pipx). Para instalar o `pipx` e o `jupyter`, execute os seguintes comandos:

```bash
# também é possível instalar via apt com o comando `sudo apt install -y pipx`
python3 -m pip install --user pipx
pipx install jupyter
```

## Executando o al-folio localmente

Agora você pode executar o site localmente. Tudo o que você precisa fazer é abrir o diretório do al-folio e executar o Jekyll:

```bash
bundle exec jekyll serve --lsi
```

Boa programação!
