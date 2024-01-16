---
layout: post
title: sli.dev para desenvolvedores não web
date: 2023-06-01 17:19:10
description: Como configurar e usar sli.dev para desenvolvedores que não são web
tags: programming code slides sli.dev web
categories: web presentation
giscus_comments: true
related_posts: true
---

Eu sempre tive dificuldades sempre que tinha que fazer uma nova apresentação. Não me interpretem mal, o Google Slides é bom e é suficiente para a maioria dos casos de uso mais comuns. O problema é quando os slides estão sempre mudando e você quer fazer um controle de versão neles. No passado, fiz alguns slides usando LaTeX com a classe Beamer. Um amigo até me mostrou um [modelo mais bonito](https://github.com/deuslirio/UFGTeX-Presentation) do que os predefinidos. O problema é que, embora esta solução seja portátil (pode gerar um documento PDF), não tem algumas funcionalidades que eu queria, como animações, transições e suporte para desenho.

Analisei o [Reveal.js](https://revealjs.com/), mas era muito trabalhoso para configurar e manter. Também considerei o [Remark](https://remarkjs.com/), mas a [última atualização](https://github.com/gnab/remark) foi há mais de 2 anos. Foi então que encontrei o [sli.dev](https://sli.dev/). É uma ferramenta [em constante desenvolvimento](https://github.com/slidevjs/slidev) para criar slides usando [Markdown](https://sli.dev/guide/syntax.html). É baseado em muitas tecnologias web, mas você não precisa ser fluente nelas para usá-lo. Aqui está tudo o que precisa para começar.

## Instalando o gerenciador de versões do node (nvm)

O [nvm](https://github.com/nvm-sh/nvm) lhe permite rapidamente instalar e usar diferentes versões do node através da linha de comando. Para instalar a versão mais recente, execute o seguinte comando:

```bash
get_latest_github_raw_no_v() {
  # use quando a URL para o download não tiver uma versão incluída no nome do arquivo
  # por exemplo: https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh
  # forma de usar: get_latest_github_raw_no_v "user/repo" "filename"
  version=$(curl --silent "https://api.github.com/repos/$1/releases/latest" |  # Obtém a versão mais recente da API do GitHub
    grep '"tag_name":' |                                             # Pega a linha da tag
    sed -E 's/.*"([^"]+)".*/\1/')                                    # Extrai o valor do JSON
  echo "https://raw.githubusercontent.com/$1/$version/"$2
}

# Instala o node version manager (nvm)
site=$(get_latest_github_raw_no_v "nvm-sh/nvm" "install.sh")
curl -o- $site | bash
```

Depois, adicione as seguintes linhas ao seu `~/.bashrc`:

```bash
# habilita o node version manager
if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Carrega o nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Habilita o bash_completion
fi
```

Reinicie seu terminal, ou apenas recarregue o arquivo `~/.bashrc`:

```bash
. ~/.bashrc
```

## Instalando o Node (versão mais recente)

Para instalar a versão mais recente do node, execute o seguinte comando:

```bash
nvm install $(nvm ls-remote | grep -i latest | tail -n 1 |
  sed -ne 's/[^v0-9]*\(\([0-9]*\.\)\{0,4\}[0-9][^.]\).*/\1/p' | xargs)
```

No meu caso, a última versão disponível é a `v20.2.0`. É possível verificar a versão instalada executando:

```bash
node --version
```

## Instalando o sli.dev

Para instalar o sli.dev, é só executar:

```bash
npm init slidev
```

Este comando irá instalar tudo o que precisa, pedir o nome do projeto e iniciar o projeto modelo. Após a instalação, as seguintes linhas devem aparecer no seu terminal:

```
public slide show   > http://localhost:3030/
  presenter mode      > http://localhost:3030/presenter/
  remote control      > pass --remote to enable

  shortcuts           > restart | open | edit
```

Se o browser não abriu automaticamente, é só abri-lo manualmente e acessar a URL `http://localhost:3030/`. Para parar a execução do servidor, basta pressionar `Ctrl+C` no terminal. Depois de parado, é possível iniciar novamente o servidor de desenvolvimento entrando no diretório criado e executando:

```bash
npm run-script dev
```

Para ver uma lista de comandos (scripts), execute `npm run`:

```txt
Scripts available in XXXXXXXXX via `npm run-script`:
  build
    slidev build
  dev
    slidev --open
  export
    slidev export
```

Se você quiser modificar qualquer um desses comandos (ou criar mais, como exportar as notas do apresentador), você pode editar o arquivo `package.json`. Por exemplo, para adicionar um comando para exportar as notas do apresentador, adicione as seguintes linhas à seção `scripts`:

```json
"export_notes": "slidev export-notes"
```

## Mudando o tema do sli.dev

Para alterar o tema da apresentação, basta editar o atributo `theme` no cabeçalho (ou [front matter](https://sli.dev/guide/syntax.html#front-matter-layouts)) do arquivo `slides.md`. Após a alteração, a interface cli baixa automaticamente e aplica o novo tema.

```yaml
theme: academic
```

{% include figure.liquid path="assets/img/blog/2023-06-01-slidev_for_non_web_devs/change_theme.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true %}

<div class="caption">
    Instalando o novo tema no sli.dev.
</div>

## Configurações básicas

Não sou um usuário avançado do sli.dev ou um programador Web. Por isso, demorei algum tempo para descobrir algumas coisas, e acho que vale a pena mencioná-las. A primeira é forçar os slides a ficarem em modo escuro. Para fazer isso, adicione a seguinte linha ao cabeçalho do `slides.md`:

```yaml
colorSchema: "dark"
```

Ao utilizar o tema `academic`, por padrão, cada slide com um `# título` será adicionado ao índice. Para ocultar um slide do índice, adicione a seguinte linha ao cabeçalho do slide:

```yaml
hideInToc: true
```

Por uma questão de organização, eu prefiro criar um arquivo diferente para cada seção da minha apresentação e, em seguida, importar esses arquivos no meu `slides.md` principal. Para fazer isso, crie um novo arquivo com a extensão markdown e adicione as seguintes linhas ao `slides.md` para cada arquivo a ser incluído:

{%raw%}

```yaml
---
src: slides/other_slide.md
---
```

{% endraw %}

## Exportando os slides

[Exportar para PDF ou PNG](https://sli.dev/guide/exporting.html) depende do `Playwright` para renderização. Portanto, é necessário instalar o `playwright-chromium` para utilizar este recurso. Para isso, execute:

```bash
npm i -D playwright-chromium
```

Depois, adicione as seguintes linhas à seção `scripts` do arquivo `package.json`:

```json
"export_slides": "slidev export --with-toc --with-clicks"
```

Por fim, execute o comando:

```bash
npm run-script export_slides
```

## Atualizando as dependências

Para atualizar o `node` para a versão mais recente, execute:

```bash
nvm install $(nvm ls-remote | grep -i latest | tail -n 1 |
  sed -ne 's/[^v0-9]*\(\([0-9]*\.\)\{0,4\}[0-9][^.]\).*/\1/p' | xargs) --reinstall-packages-from=current
```

Para verificar as dependências que precisam ser atualizadas, execute:

```bash
npm outdated
```

que irá produzir algo como:

```txt
Package      Current   Wanted  Latest  Location                  Depended by
@slidev/cli  0.43.11  0.43.15  0.46.1  node_modules/@slidev/cli  xxxxxxxx
```

Para atualizar as dependências instaladas, basta executar:

```bash
npm update
```

Tenha em mente que o `npm update` nunca atualizará para uma versão de quebra de compatibilidade, apenas para uma versão menor. O que isso significa é que ele usará a versão `Wanted` na tabela acima em vez da versão `Latest`. Para obter a versão `Latest`, chame o comando de instalação com `@latest` anexado ao nome do pacote. Por exemplo, para atualizar o `@slidev/cli` para a versão mais recente, execute:

```bash
npm install @slidev/cli@latest
```
