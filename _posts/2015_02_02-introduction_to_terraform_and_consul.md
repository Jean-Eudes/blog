---
layout: post
title: "Introduction à terraform et consul"
categories: [xke]
---

## Objectif du XKE

L'objectif de ce xke est de prendre en main deux outils open source de la société Hashicorp : terraform et consul. Le premier, terraform est un outil qui a pour ambition de vous permettre de créer et de versionner votre infrastructure cloud. Terraform se veut agnostique au type de cloud, c'est à dire qu'il vous permet de créer un infrastructure de manière transparente sur plusieurs providers de cloud, par exemple amazon ou azure. Le second, consul, se présente comme un outil de "service discovery". Il va permettre aux différents services de déployer votre application sans connaître à l'avance la configuration réseau de vos machines.

## Découverte de terraform

Pour débuter ce XKE, vous aurez besoin de télécharger [terraform](https://www.terraform.io/downloads.html), prenez la version qui correspond à votre environnement. Vos aures aussi besoin d'un compte amazon. Pour ceux qui n'en n'aurez pas, n'hésiter pas ou à pairer avec une personne en ayant un, ou à me demander.

Rappel : Ne commiter jamais vos clefs secrètes amazon sur github.

### Création de notre première machine

#### Préparation des clefs amazon

Pour commencer, nous allons commencer par créer un fichier contenant nos clefs amazon. Ce fichier ne doit jamais être commiter. Vous pouvez par exemple le rajouter dans votre fichier .gitignore. En vous basant sur la documentation de [terraform](https://www.terraform.io/intro/getting-started/build.html), créer un fichier nommé *key.tf* contenant vos credentials amazon, ainsi que la région amazon que nous allons utiliser *eu-west-1*.

#### Création de votre première machine

Maintenant que nous avons renseigner nos clefs *secrètes* amazon, nous allons pouvoir créer notre première machine. Toujours en vous basant sur la documentation, créer un fichier serveur.tf contenant la déclararation de votre première machine. Nous allons utiliser une machine ayant comme ami : *ami-6e7bd919*, et comme type d'instance : *t2.micro*. Comme la région *eu-west-1* ne possède pas de vpc par défaut, vous allez devoir rajouter l'attribut *subnet_id = "subnet-1f9f7946"*.

Une fois le fichier créer, vous pouvez simplement demander à terraform de créer votre infrastructure en lançant la commande :
{% highlight bash %}
terraform apply
{% endhighlight %} 


