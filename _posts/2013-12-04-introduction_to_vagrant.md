---
layout: post
title: "Introduction à Vagrant"
categories: xke
---

# XKE Vagrant

## Objectif du XKE

L'objectif de ce XKE est de prendre en main Vagrant, un outil open source facilitant la création d'environnement virtualisés. Il se présente comme une surchouche aux outils de virtualialisations traditionnels. La configuration de Vagrant se base sur un dsl écrit en ruby, ce qui le rend facilement versionnable et partageable par l'ensemble des membres d'une équipe de développement.

Au cours de ce Hands-on, nous allons créer un environnement virtualisé iso prod, composés de trois machines :
 - un serveur de base de données
 - un serveur d'application
 - un proxy

## Pré-requis

Pour commencer ce Hands on, vous devez au préalable installer [virtualbox](https://www.virtualbox.org/wiki/Downloads) (version 4.2 ou supérieur) et [Vagrant](http://downloads.vagrantup.com/) (version 1.2 et supérieur)

## Commande de base de vagrant

Récupération de l'image de la vm

{% highlight ruby %}
vagrant box add precise32 http://files.vagrantup.com/precise32.box
{% endhighlight %}

Initialisation de la configuration par défaut

{% highlight bash %}
vagrant init precise32
{% endhighlight %}

Démarrer la machine
{% highlight bash %}
vagrant up
{% endhighlight %}

Se connecter sur la machine
{% highlight bash %}
vagrant ssh
{% endhighlight %}

Eteindre la machine
{% highlight bash %}
vagrant halt
{% endhighlight %}

Supprimer la machine
{% highlight bash %}
vagrant destroy
{% endhighlight %}

## Personnalisation de la conf Vagrant

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

<div class = "solution">
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.define "web" do |web|
    web.vm.box = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
  end

  config.vm.define "server" do |server|
    server.vm.box = "tomcat"
  end

end
{% endhighlight %}
</div>

## Customisation de la machine

La machine tomcat aura besoin de 2 cpus et de 1 Go de mémoire. Modifier le fichier de configuration afin d'adapter cette machine.

[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/virtualbox/configuration.html)
[lien vers la documentation de virtualbox](http://www.virtualbox.org/manual/ch08.html)

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.define "web" do |web|
    web.vm.box = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
  end

  config.vm.define "server" do |server|
    server.vm.box = "tomcat"
    server.vm.customize ["modifyvm", :id, "--memory", "1024"]
    server.vm.customize ["modifyvm", :id, "--cpus", "2"]
  end


end
{% endhighlight %}
</div>

## Partage de répertoire

Afin de pouvoir facilement installer nos applicatifs (war, ear et autres) sur les vm, on va partager un répertoire de notre machine hôte (par exemple) Downloads, que l'on va monter sur le répertoire /tmp des vm.

[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/synced-folders/basic_usage.html)

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"

  config.vm.define "web" do |web|
    web.vm.box = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
  end

  config.vm.define "server" do |server|
    server.vm.box = "tomcat"
    server.vm.customize ["modifyvm", :id, "--memory", "1024"]
    server.vm.customize ["modifyvm", :id, "--cpus", "2"]
  end

end
{% endhighlight %}
</div>


## Configuration réseau

Afin de reproduire notre environnement de production, on va attribuer à nos machines les mêmes adresses IP que celle de notre réseau de production. C'est à dire : 
 - apache : 192.168.2.2
 - mysql : 192.168.2.3
 - tomcat : 192.168.2.4


[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/networking/private_network.html)

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"

  config.vm.define "web" do |web|
    web.vm.box = "apache"
    web.vm.network :private_network, ip: "192.168.2.2"
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
    db.vm.network :private_network, ip: "192.168.2.3"
  end

  config.vm.define "server" do |server|
    server.vm.box = "tomcat"
    server.vm.customize ["modifyvm", :id, "--memory", "1024"]
    server.vm.customize ["modifyvm", :id, "--cpus", "2"]
    server.vm.network :private_network, ip: "192.168.2.4"
  end

end
{% endhighlight %}
</div>


## Redirection des ports

Afin de pouvoir accéder facilement à notre serveur, on va rediriger le port 80 de la machine apache vers le port 80 de notre machine hôte. Pour vérifier que celà fonctionne, vous pourrez installer apache, et vérifier qu'en tapant localhost dans votre navigateur, vous voyez la page d'accueil d'apache.

[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/networking/forwarded_ports.html)

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"

  config.vm.define "web" do |web|
    web.vm.box = "apache"
    web.vm.network :private_network, ip: "192.168.2.2"
    web.vm.network :forwarded_port, guest: 80, host: 80
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
    db.vm.network :private_network, ip: "192.168.2.3"
  end

  config.vm.define "server" do |server|
    server.vm.box = "tomcat"
    server.vm.customize ["modifyvm", :id, "--memory", "1024"]
    server.vm.customize ["modifyvm", :id, "--cpus", "2"]
    server.vm.network :private_network, ip: "192.168.2.4"
  end

end
{% endhighlight %}
</div>


## Provisionning des machines

Vagrant est compatible avec différents outils de provisionning afin d'installer des applicatifs sur les machines que nous venons de créer :
 - shell
 - ansible
 - chef
 - puppet

Créer rapidement un script shell nommé script_install.sh pour installer un serveur apache, un mysql et un tomcat.

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"
  config.vm.provision :shell, path: "script_install.sh"

  config.vm.define "web" do |web|
    web.vm.box = "apache"
    web.vm.network :private_network, ip: "192.168.2.2"
    web.vm.network :forwarded_port, guest: 80, host: 80
  end

  config.vm.define "db" do |db|
    db.vm.box = "mysql"
    db.vm.network :private_network, ip: "192.168.2.3"
  end

  config.vm.define "server" do |server|
    server.vm.box = "tomcat"
    server.vm.customize ["modifyvm", :id, "--memory", "1024"]
    server.vm.customize ["modifyvm", :id, "--cpus", "2"]
    server.vm.network :private_network, ip: "192.168.2.4"
  end

end
{% endhighlight %}
</div>


## Refactoring

## Packager votre machine

Il est parfois intéressant de sauvegarder une box crée à partir de virtualbox pour la réutiliser par la suite, par exemple dans le cas ou l'on installe une distribution dont la bax n'existe pas envore pour Vagrant. Essayez de créer une box à partir de la version tournant actuellement sur virtualbox.

<div class = 'solution'>
{% highlight bash %}
vagrant package --base myBox --output debian.box
{% endhighlight %}
</div>



