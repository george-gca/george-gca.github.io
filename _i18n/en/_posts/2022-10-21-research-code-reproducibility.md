---
layout: post
title: The problem of research code reproducibility
date: 2022-10-21 15:13:16
description: A brief overview of the problem of research code reproducibility.
tags: research programming reproducibility code
categories: research-code
giscus_comments: true
related_posts: true
---

Everyone in the research community had that problem already:

> You found a paper that you want to reproduce. You found out that the original author (or possibly another researcher) published code to run those experiments. You download the code, try to run it, but it doesn't work. There are missing code, missing datasets, or missing dependencies. Maybe the code is a little outdated, and you need to update it to run it on your machine. Or you need to find out which specific library versions the authors used. You spend hours trying to get the code to run, but to no avail. You try to contact the authors, but they do not respond. You try to fix the code yourself, but it is too complicated. You give up.

Who never got so frustrated to the point that you just give up on that code, maybe even on that paper? Hell, I know people that gave up on a whole field of research because they could not reproduce the results of a paper. Multiple times I got caught in this kind of situation, and got me questioning the whole code publishing part. After a lot of afterthought, I came to a partial solution to this problem.

## The main culprit

Most of the time that I am unable to run someone else's code, it is because of one thing: **dependencies versions are not specified**.

Sure, a lot of people create something like `requirements.txt`, but they usually lack the version number. Even if they do specify the version number, it is usually not the exact version number. For example, instead of `numpy==1.19.5`, they would write `numpy>=1.19.5`. This is not good enough. If you want to reproduce someone else's results, you need to know **exactly** which version of each dependency you need to install. Otherwise, you will get different results. Even if you specify the exact version number, you might still get different results if the authors used a different version of the language, say, Python, or some other low-level dependencies, like cuda or cuDNN.

## Docker for the help

That is where [Docker](https://www.docker.com/) comes in. Docker is a [containerization technology](https://www.docker.com/resources/what-container/) that allows you to create an [image](https://docs.docker.com/glossary/#image) that packs all the dependencies that you need to run your code. You can then run your code inside a [container](https://docs.docker.com/glossary/#container), and you will **possibly** get the same results as the authors. Making an allusion to object oriented programming, **image** is the class and **container** is an object or an instance from that class. You can even share that image with other people, so they can run your code too. Docker also supports [running code on GPUs](https://github.com/NVIDIA/nvidia-docker).

As an example, here is the [base code](https://github.com/george-gca/sr-pytorch-lightning) that I used during my master degree. I tried as much as possible to make it reproducible and extensible. That means to not only run the AI model, but also be able to create your own model and run it with the same data and training parameters, to allow comparisons.

I decided to split the logic of dealing with Docker (contained in [Makefile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Makefile)) from running the Python code itself (contained in [start_here.sh](https://github.com/george-gca/sr-pytorch-lightning/blob/main/start_here.sh)). The recipe for creating the Docker image is inside the [Dockerfile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Dockerfile), and I also made available a [Dockerfile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Dockerfile_fixed_versions) with all the versions of the dependencies fixed, like you can see in the code snippet below. Everything you might need to run the code is explained in the [README](https://github.com/george-gca/sr-pytorch-lightning/blob/main/README.md) file.

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

To ensure reproducibility despite the random number generators, I used the [seed_everything](https://pytorch-lightning.readthedocs.io/en/stable/api/pytorch_lightning.utilities.seed.html#pytorch_lightning.utilities.seed.seed_everything) function from PyTorch Lightning. This function sets seed for pseudo-random number generators in: `pytorch`, `numpy`, `python.random`. It also sets the following environment variables: `PL_GLOBAL_SEED` and `PL_SEED_WORKERS`.

## Docker doesn't solve everything

As you can probably be thinking, this is not a perfect solution. There are still problems that might surge, and that you need to be aware of, since some of these are from out of our control.

### Repositories changes

Look, for example, this part of the [Dockerfile](https://github.com/george-gca/sr-pytorch-lightning/blob/main/Dockerfile_fixed_versions):

```bash
# temporary solution for bug
# see https://forums.developer.nvidia.com/t/gpg-error-http-developer-download-nvidia-com-compute-cuda-repos-ubuntu1804-x86-64/212904/3
apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/3bf863cc.pub && \
apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub && \
```

This is a solution for a bug that I found with the NVIDIA repository. Basically, they are (were?) in the process of rotating their repository GPG public keys, which is used to sign the packages. This was causing an error in the `apt-get update` command when creating the Docker image, and this was not happening during the entirety of my experiments, but happened by the time I decided to publish this code.

### Dependencies' dependencies

Sometimes some of your dependencies specific version requires specific versions of its own dependencies. This happened to me when specifying `tensorboard==2.9.0`, which caused an error when building the Docker image. To fix this, I needed to define the proper `protobuf` version to install, even though my code does not use `protobuf` directly.

```bash
prettytable==3.3.0 \
# specify protobuf to avoid bug with tensorboard
# https://developers.google.com/protocol-buffers/docs/news/2022-05-06#python-updates
protobuf==3.20 \
pytorch-lightning==1.6.3 \
tensorboard==2.9.0 \
```
