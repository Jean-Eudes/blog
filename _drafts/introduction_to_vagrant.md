---
layout: post
title:  "Introduction to Vagrant"
categories: xke
---

# XKE Vagrant

## Objectif du XKE

L'objectif de ce XKE est de prendre en main Vagrant, un outil open source facilitant la création d'environnement virtualisés. Il se présente comme une surchouche aux outils de virtualialisations traditionnelles. La configuration de Vagrant se base sur un dsl ruby, ce qui le rend facilement versionnable etréutilisable.

Au cours de ce Hands-on, nous allons créer un environnement iso prod, composés de trois machines :
 - un serveur de base de données
 - un serveur d'application
 - un proxy

## Pré-requis

Pour commencer ce Hands on, vous devez au préalable installer [virtualbox](https://www.virtualbox.org/wiki/Downloads) (version 4.2 ou supérieur) et [Vagrant](http://downloads.vagrantup.com/) (version 1.2 et supérieur)

## Récupération de l'image de la vm

{% highlight ruby %}
vagrant box add precise32 http://files.vagrantup.com/precise32.box
{% endhighlight %}

Initialisation de la configuration par défaut

{% highlight ruby %}
vagrant init precise32
{% endhighlight %}

Démarrer la machine
{% highlight ruby %}
vagrant up
{% endhighlight %}

Se connecter sur la machine
{% highlight ruby %}
vagrant ssh
{% endhighlight %}

Eteindre la machine
{% highlight ruby %}
vagrant halt
{% endhighlight %}

Supprimer la machine
{% highlight ruby %}
vagrant destroy
{% endhighlight %}

On va maintenant supprimer le fichier crée par défaut, et le remplacer par le fichier suivant :
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.define "web" do |web|
    web.vm.box = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
  end
end
{% endhighlight %}

En se basant sur ce template, rajouter une troisième machine nommée tomcat.
Remarque : pour se connecter spécifiquement à une des machines, vous devez utiliser la commande vagrant ssh web.

## Partage de répertoire

## Configuration réseau

## Redirection des port

## Provisionning des machines


