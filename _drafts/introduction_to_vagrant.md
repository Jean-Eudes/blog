---
layout: post
title: "Introduction à Vagrant"
categories: xke
---

# XKE Vagrant

## Objectif du XKE

L'objectif de ce XKE est de prendre en main Vagrant, un outil open source facilitant la création d'environnement virtualisés. Il se présente comme une surchouche aux outils de virtualialisations traditionnels. La configuration de Vagrant se base sur un dsl écrit ruby, ce qui le rend facilement versionnable et partageables par l'ensemble d'une équipe de développement.

Au cours de ce Hands-on, nous allons créer un environnement virtualisé iso prod, composés de trois machines :
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

## Customisation de la machine

La machine tomcat aura besoin de 2 cpus et de 1 Go de mémoire. Modifier le fichier de configuration afin d'adapter cette machine.

{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.define "web" do |web|
    web.vm.box = "tomcat"
    web.vm.customize ["modifyvm", :id, "--memory", "1024"]
    web.vm.customize ["modifyvm", :id, "--cpus", "2"]
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
  end
end
{% endhighlight %}

## Partage de répertoire

[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/synced-folders/basic_usage.html)

## Configuration réseau

Afin de reproduire notre environnement de production, on va attribuer à nos machines les mêmes adresses IP que celle de notre réseau de production. C'est à dire : 
  - apache : 192.168.2.2
  - tomcat : 192.168.2.3
  - mysql : 192.168.2.4

[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/networking/private_network.html)

## Redirection des port

Afin de pouvoir accéder facilement à notre serveur, on va rediriger le port 80 de la machine apache vers le port 80 de notre machine hôte. Pour vérifier que celà fonctionne, vous pourrez installer apache, et vérifier qu'en tapant localhost dans votre navigateur, vous voyez la page d'accueil d'apache.

## Provisionning des machines

Vagrant est compatible avec différents outils de provisionning afin d'installer des applicatifs sur les machines que nous venons de créer :
 - shell
 - ansible
 - chef
 - puppet

Utiliser le script shell fourni afin de provisionner les serveurs.

## Refactoring

## Sauvegarder votre machine

