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

Si docker-machine est correctement installé, vous devrez voire apparaître la version 0.3.0


