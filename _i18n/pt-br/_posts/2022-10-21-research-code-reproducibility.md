---
layout: post
title: O problema da reproducibilidade de códigos de pesquisa
date: 2022-10-21 15:13:16
description: Uma breve visão geral do problema da reproducibilidade de códigos de pesquisa.
tags: research programming reproducibility code
categories: research-code
giscus_comments: true
related_posts: true
---

Todo mundo no meio de pesquisa já passou por esse problema:

> Você encontrou um artigo que deseja reproduzir. Você descobriu que o autor original (ou possivelmente outro pesquisador) publicou o código para executar esses experimentos. Você baixa o código, tenta executá-lo, mas não funciona. Falta trechos de código, bases de dados ou dependências. Talvez o código esteja um pouco desatualizado e você precise atualizá-lo para executar em sua máquina. Ou você precisa descobrir quais versões específicas das bibliotecas os autores usaram. Você passa horas tentando executar o código, mas sem sucesso. Você tenta entrar em contato com os autores, mas eles não respondem. Você tenta consertar o código sozinho, mas é muito complicado. Você desiste.

Quem nunca ficou tão frustrado a ponto de desistir daquele código, talvez até daquele artigo? Nossa, conheço pessoas que desistiram de todo um campo de pesquisa porque não conseguiram reproduzir os resultados de um artigo. Várias vezes fui pego nesse tipo de situação, o que me fez questionar toda a parte de publicação de código. Depois de muito pensar, cheguei a uma solução parcial para esse problema.

## O principal culpado

Na maioria das vezes que eu não consigo executar o código de outra pessoa, é por causa de uma coisa: **as versões das dependências não são especificadas**.

Claro, muitas pessoas criam algo como um `requirements.txt`, mas geralmente não têm os números das versões. Mesmo quando possuem número de versão, geralmente não é o número exato da versão. Por exemplo, em vez de `numpy==1.19.5`, está `numpy>=1.19.5`. Isso não é suficiente. Se você quiser reproduzir os resultados de outra pessoa, você precisa saber **exatamente** qual versão de cada dependência você precisa instalar. Caso contrário, você obterá resultados diferentes. Mesmo se você especificar o número exato da versão, ainda poderá obter resultados diferentes se os autores usarem uma versão diferente da linguagem, digamos, Python, ou algumas outras dependências de baixo nível, como cuda ou cuDNN.

## Docker pra salvar o dia

É aí que entra o [Docker](https://www.docker.com/). O Docker é uma [tecnologia de conteinerização](https://www.docker.com/resources/what-container/) que permite criar uma [imagem](https://docs.docker.com/glossary/#image) que empacota todas as dependências necessárias para executar seu código. Você pode então executar seu código dentro de um [contêiner](https://docs.docker.com/glossary/#container), **possivelmente** obtendo os mesmos resultados que os autores. Fazendo uma alusão à programação orientada a objetos, **imagem** é a classe e **contêiner** é um objeto ou uma instância dessa classe. Você pode até compartilhar essa imagem com outras pessoas, para que elas também possam executar seu código. O Docker também suporta [executar código em GPUs](https://github.com/NVIDIA/nvidia-docker).

Como exemplo, aqui está o [código base](https://github.com/george-gca/sr-pytorch-lightning) que usei durante meu mestrado. Tentei ao máximo tornar o código reprodutível e extensível. Isso significa não apenas executar o modelo de IA, mas também poder criar seu próprio modelo e executá-lo com os mesmos dados e parâmetros de treinamento, para permitir comparações.

Decidi dividir a lógica de lidar com o Docker (contido no [Makefile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Makefile)) da execução do próprio código Python (contido no [start_here.sh](https://github.com/george-gca/sr-pytorch-lightning/blob/main/start_here.sh)). A receita para criar a imagem do Docker está dentro do [Dockerfile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Dockerfile), e também disponibilizei um [Dockerfile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Dockerfile_fixed_versions) com todas as versões das dependências definidas, como você pode ver no trecho de código abaixo. Tudo o que você pode precisar para executar o código é explicado no arquivo [README](https://github.com/george-gca/sr-pytorch-lightning/blob/main/README.md).

```bash
    DEBIAN_FRONTEND=noninteractive $APT_INSTALL \
        bc=1.07.1-2 \
        curl=7.58.0-2ubuntu3.18 \
        git=1:2.17.1-1ubuntu0.11 \
        libffi-dev=3.2.1-8 \
        rsync=3.1.2-2.1ubuntu1.4 \
        wget=1.19.4-1ubuntu2.2 && \

# ==================================================================
# install python libraries via pip
# ------------------------------------------------------------------

    $PIP_INSTALL \
        pip==22.0.4 \
        setuptools==62.2.0 \
        wheel==0.37.1 && \
```

Para garantir a reproducibilidade, apesar dos geradores de números aleatórios, usei a função [seed_everything](https://pytorch-lightning.readthedocs.io/en/stable/api/pytorch_lightning.utilities.seed.html#pytorch_lightning.utilities.seed.seed_everything) do PyTorch Lightning. Essa função define a semente para geradores de números pseudo-aleatórios em: `pytorch`, `numpy`, `python.random`. Ele também define as seguintes variáveis de ambiente: `PL_GLOBAL_SEED` e `PL_SEED_WORKERS`.

## O Docker não resolve tudo

Como você provavelmente está pensando, essa não é uma solução perfeita. Ainda existem problemas que podem surgir e que você precisa estar ciente, pois alguns deles estão fora do nosso controle.

### Alterações nos repositórios

Veja, por exemplo, essa parte do [Dockerfile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Dockerfile_fixed_versions):

```bash
# temporary solution for bug
# see https://forums.developer.nvidia.com/t/gpg-error-http-developer-download-nvidia-com-compute-cuda-repos-ubuntu1804-x86-64/212904/3
apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/3bf863cc.pub && \
apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub && \
```

Esta é uma solução para um problema que encontrei no repositório da NVIDIA. Basicamente, eles estão (estavam?) em processo de rotação de suas chaves públicas GPG do repositório, que são usadas para assinar os pacotes. Isso estava causando um erro no comando `apt-get update` ao criar a imagem do Docker, e isso não estava acontecendo durante os meus experimentos, mas aconteceu quando eu decidi publicar o código.

### Dependências de dependências

Às vezes, algumas versões específicas de dependências requerem versões específicas de suas próprias dependências. Isso aconteceu comigo ao especificar `tensorboard==2.9.0`, o que causou um erro ao construir a imagem do Docker. Para corrigir isso, eu precisava definir a versão apropriada do `protobuf` para instalar, mesmo meu código não usando o `protobuf` diretamente.

```bash
prettytable==3.3.0 \
# specify protobuf to avoid bug with tensorboard
# https://developers.google.com/protocol-buffers/docs/news/2022-05-06#python-updates
protobuf==3.20 \
pytorch-lightning==1.6.3 \
tensorboard==2.9.0 \
```
