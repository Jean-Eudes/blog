---
layout: post
title: "Introduction à Vagrant"
categories: [xke]
---

Besoin de vous construire un environnement iso prod sur votre poste de travail, de monter rapidement un cluster hadoop ou cassandra pour un poc, de partager vos machines virtuelles avec le reste de votre équipe, ce slot est pour vous. En une heure, vous apprendrez à créer un fichier de configuration Vagrant vous permettant de créer et de configurer facilement vos vm.

## Objectif du XKE

L'objectif de ce XKE est de prendre en main Vagrant, un outil open source facilitant la création d'environnement virtualisés. Il se présente comme une surchouche aux outils de virtualisations traditionnels. La configuration de Vagrant se base sur un dsl écrit en ruby, ce qui le rend facilement versionnable et partageable par l'ensemble des membres d'une équipe de développement.

A ses débuts, Vagrant fonctionnait uniquement avec Virtualbox. Depuis la version 1.2, il supporte maintenant différents providers :
 - Virtualbox
 - VMWare
 - Amazon aws
 - Google Compute Engine

Vagrant permet de configurer des machines virtuelles, que ce soit sur la quantité de mémoire, le nombre de CPU, la configuration réseau, la redirection des ports, le nombre de répertoire, ...

Au cours de ce Hands-on, nous allons créer un environnement virtualisé iso prod, composés de trois machines :
 - un serveur de base de données
 - un serveur d'application
 - un proxy

## Pré-requis

Pour commencer ce Hands on, vous devez au préalable installer [virtualbox](https://www.virtualbox.org/wiki/Downloads) (version 4.2 ou supérieur) et [Vagrant](http://downloads.vagrantup.com/) (version 1.2 et supérieur)

## Commande de base de vagrant

Récupération de l'image de la vm

{% highlight bash %}
vagrant box add precise32 http://files.vagrantup.com/precise32.box
{% endhighlight %}

Création d'un fichier de configuration par défaut

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

Recharger la configuration de la machine
{% highlight bash %}
vagrant reload
{% endhighlight %}


Supprimer la machine
{% highlight bash %}
vagrant destroy
{% endhighlight %}

## Personnalisation de la configuration Vagrant

On va maintenant supprimer le fichier crée par défaut, et le remplacer par le fichier suivant :
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.box = "precise32"

  config.vm.define "web" do |web|
    web.vm.hostname = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.hostname = "mysql"
  end
end
{% endhighlight %}

En se basant sur ce template, rajouter une troisième machine nommée tomcat.

Remarque : pour se connecter spécifiquement à une des machines, vous devez utiliser la commande vagrant ssh web.

Remarque 2 : Afin d'optimiser les temps de démarrage des VMs, nous allons également démarrer une seule machine à la fois, pour celà, commenter deux des trois machines dans le fichier, et travailler toujours avec la même (# pour commenter).

<div class = "solution">
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.box = "precise32"

  config.vm.define "web" do |web|
    web.vm.hostname = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.hostname = "mysql"
  end

  config.vm.define "server" do |server|
    server.vm.hostname = "tomcat"
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

  config.vm.box = "precise32"

  config.vm.define "web" do |web|
    web.vm.hostname = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.hostname = "mysql"
  end

  config.vm.define "server" do |server|
    server.vm.hostname = "tomcat"
    server.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "1024"]
      vb.customize ["modifyvm", :id, "--cpus", "2"]
    end
  end


end
{% endhighlight %}
</div>

## Partage de répertoire

Afin de pouvoir facilement installer nos applicatifs (war, ear et autres) sur les machines virtuelles, on va partager un répertoire de notre machine hôte (par exemple) Downloads, que l'on va monter sur le répertoire /tmp des vm.

[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/synced-folders/basic_usage.html)

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.box = "precise32"
  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"

  config.vm.define "web" do |web|
    web.vm.hostname = "apache"
  end

  config.vm.define "db" do |db|
    db.vm.hostname = "mysql"
  end

  config.vm.define "server" do |server|
    server.vm.hostname = "tomcat"
    server.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "1024"]
      vb.customize ["modifyvm", :id, "--cpus", "2"]
    end
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

  config.vm.box = "precise32"
  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"

  config.vm.define "web" do |web|
    web.vm.hostname = "apache"
    web.vm.network :private_network, ip: "192.168.2.2"
  end

  config.vm.define "db" do |db|
    db.vm.hostname = "mysql"
    db.vm.network :private_network, ip: "192.168.2.3"
  end

  config.vm.define "server" do |server|
    server.vm.hostname = "tomcat"
    server.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "1024"]
      vb.customize ["modifyvm", :id, "--cpus", "2"]
    end
    server.vm.network :private_network, ip: "192.168.2.4"
  end

end
{% endhighlight %}
</div>


## Redirection des ports

Afin de pouvoir accéder facilement à notre serveur, on va rediriger le port 80 de la machine apache vers le port 80 de notre machine hôte. Pour vérifier que celà fonctionne, vous pourrez installer apache, et vérifier qu'en tapant localhost:8080 dans votre navigateur, vous voyez la page d'accueil d'apache.

[lien vers la documentation de vagrant](http://docs.vagrantup.com/v2/networking/forwarded_ports.html)

Commande pour installer apache
{% highlight bash %}
apt-get install -y apache2
{% endhighlight %}

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.box = "precise32"
  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"

  config.vm.define "web" do |web|
    web.vm.hostname = "apache"
    web.vm.network :private_network, ip: "192.168.2.2"
    web.vm.network :forwarded_port, guest: 80, host: 8080
  end

  config.vm.define "db" do |db|
    db.vm.hostname = "mysql"
    db.vm.network :private_network, ip: "192.168.2.3"
  end

  config.vm.define "server" do |server|
    server.vm.hostname = "tomcat"
    server.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "1024"]
      vb.customize ["modifyvm", :id, "--cpus", "2"]
    end
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

Créer rapidement un script shell nommé script_install.sh pour installer un serveur apache, un mysql et un tomcat. La commande {% highlight ruby %}vagrant provision{% endhighlight %} permet de provisionner les machines.

<div class = 'solution'>
{% highlight ruby %}
Vagrant.configure("2") do |config|

  config.vm.box = "precise32"
  config.vm.synced_folder "/Users/jean-eudes/Downloads", "/tmp"
  config.vm.provision :shell, path: "script_install.sh"

  config.vm.define "web" do |web|
    web.vm.hostname = "apache"
    web.vm.network :private_network, ip: "192.168.2.2"
    web.vm.network :forwarded_port, guest: 80, host: 8080
  end

  config.vm.define "db" do |db|
    db.vm.hostname = "mysql"
    db.vm.network :private_network, ip: "192.168.2.3"
  end

  config.vm.define "server" do |server|
    server.vm.hostname = "tomcat"
    server.vm.provider :virtualbox do |vb|
      vb.customize ["modifyvm", :id, "--memory", "1024"]
      vb.customize ["modifyvm", :id, "--cpus", "2"]
    end
    server.vm.network :private_network, ip: "192.168.2.4"
  end

end
{% endhighlight %}
</div>


## Refactoring

En vous basant sur la syntaxe suivante, réfactorer votre code afin de sépararer la configuration des machines du code Vagrant.

{% highlight ruby %}
boxes = [
  {
    :name => :web1,
    :hostName => 'tomcat2',
    :ip => '192.168.2.2'
  },
  {
    :name => :web2,
    :hostName => 'tomcat2',
    :ip => '192.168.2.3'
  },
  {
    :name => :db,
    :hostName => 'mysql',
    :ip => '192.168.2.4'
  }
]

Vagrant.configure("2") do |config|

  boxes.each do |opts|

    config.vm.define opts[:name] do |cfg|
      cfg.vm.box = "precise32"
      cfg.vm.hostname = opts[:hostName]
      cfg.vm.network :private_network, ip: opts[:ip]
    end

  end
end
{% endhighlight %}


## Packager votre machine

Il est parfois intéressant de sauvegarder une box crée à partir de virtualbox pour la réutiliser par la suite, par exemple dans le cas ou l'on installe une distribution dont il n'existe pas de box packagé pour Vagrant. Essayez de créer une box à partir de la version tournant actuellement sur virtualbox.

<div class = 'solution'>
{% highlight bash %}
vagrant package --base myBox --output debian.box
{% endhighlight %}
</div>

