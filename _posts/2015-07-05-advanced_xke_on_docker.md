---
layout: post
title: "Docker avancé"
categories: [xke]
---

## docker-machine

docker-machine est un utilitaire qui permet de créer des machines virtuelles permettant de créer un ensemble de machine virtuelle faisant tourner du docker. docker-machine permet de créer des environnements à la fois en local (via virtualbox) et sur des environnements cloud (amazon, ...)

### Pré-requis

docker-machine est un simple exécutable. Pour l'installer, lancer les commandes ci- dessous :
{% highlight bash %}
$ curl -L https://github.com/docker/machine/releases/download/v0.3.0/docker-machine_darwin-amd64 > /usr/local/bin/docker-machine
$ chmod +x /usr/local/bin/docker-machine
{% endhighlight %}

Pour vérifier que docker-machine est bien installé, lancer la commande :

{% highlight bash %}
$ docker-machine -v
{% endhighlight %}

Si docker-machine est correctement installé, vous devrez voire apparaître la version 0.3.0.

### Création de notre premier environnement docker-machine

Docker-machine permet de créer des environements à la fois sur un provider local (e.g. virtualbox), mais aussi d'utiliser des plateformes cloud comme ammazon. Pour faire plaisir à notre C.T.O. préféré, nous allons utiliser amazon ec2(prière donc de bien éteindre les machines à la fin du XKE).

Pour commencer, nous allons créer un cluster de 3 instance sur amazon ec2. Pour créer des instances sur amazon ec2, vous allez devoir spécifier à docker machine que vous voulez utiliser le driver ec2. La commande pour créer un cluster est logiquement : docker-machine create, et l'option pour spécifier le driver est : --driver amazonec2. Les options obligatoires sont :
  - acces key amazon (--amazonec2-access-key)
  - secret acces key (--amazonec2-secret-key)
  - la région amazon (--amazonec2-region)
  - l'identifiant du VPC (--amazonec2-vpc-id)

[lien vers la documentation de docker-machine](https://docs.docker.com/machine/#amazon-web-services)

Le dernier argument à spécifier est le nom du cluster. Penser à le remplacer par un identifiant unique.

{% highlight bash %}
$ docker-machine create --driver amazonec2 --amazonec2-region eu-west-1 --amazonec2-vpc-id vpc-a03fc0c5 --amazonec2-access-key xxx --amazonec2-secret-key xxx cluster-name
{% endhighlight %}

## Lister la liste des clusters managé par docker-machine

La commande ls vous permet de voir la liste des clusters actifs managées par docker-machine. En la testant, vous pourrez voir le cluser que vous venez de créer.

{% highlight bash %}
$ docker-machine ls
{% endhighlight %}


