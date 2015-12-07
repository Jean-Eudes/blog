---
layout: post
title: "Introduction à Consul"
categories: [xke]
---

Consul est un outil de service discovery, permettant à des services de s'enregistrer auprès d'un serveur, et à d'autres services d'interroger ce même serveur pour récupérer des informations sur les services déployés sur notre cluster

## Introduction

Il y a quelques mois, votre entreprise a suivie le dernier buzz word à la mode suite à une université à devoxx france, et à décider de se lancer dans l’aventure des micro services. De très nombreux micro services plus tard, un problème est apparu : comment connaître l’adresse de mes services. Après consultation du pôle architecture de notre société, suivi par de trop nombreuses réunions, il a été décidé de mettre en place une solution de service discovery.

## Etape pour le XKE de décembre

[lien vers la clef privé](../data/consulkey.pem)


## Installation de consul (étape déjà faite pour le XKE de décembre)

Consul est livré sous la forme d’un simple binaire. Il suffit simplement de le télécharger :

{% highlight bash %}
wget https://dl.bintray.com/mitchellh/consul/0.5.2_linux_amd64.zip
{% endhighlight %}

Consul est également livré avec une ui que l’on peut télécharger avec le lien suivant :

{% highlight bash %}
wget https://dl.bintray.com/mitchellh/consul/0.5.2_web_ui.zip
{% endhighlight %}


## Lancement du serveur consul

Nous allons maintenant lancer notre serveur consul, en spécifiant que nous ne lançons que une instance (pas de redondance), et qu’il sera accessible depuis l’extérieur.

{% highlight bash %}
consul agent -server -bootstrap-expect 1 -data-dir /tmp/consul --client 0.0.0.0 -ui-dir ui -config-dir etc/consul.d &
{% endhighlight %}

Il est possible de regarder l’état du serveur avec la commande

{% highlight bash %}
consul members
{% endhighlight %}


## Lancement de l'agent consul

On va maintenant ajouter un agent consul et le connecter à notre serveur. Sur votre seconde machine, Lancer l'agent avec les commandes suivantes

{% highlight bash %}
consul agent -data-dir /tmp/consul -node=agent1 -config-dir etc/consul.d &
consul join <addr ip privé>
{% endhighlight %}

Si vous demandez maintenant à consul de vous affichez l’état du cluster, vous verrez bien apparaître deux lignes, une pour le serveur, et une pour le client.

Consul propose également une api rest pour connaître l’état du cluster

{% highlight bash %}
curl localhost:8500/v1/catalog/nodes
{% endhighlight %}


Il est également possible de voir l’état du cluster en se connectant à l’interface web :

{% highlight bash %}
http://<ip public du serveur>:8500/ui/
{% endhighlight %}

## Création de notre premier service

Avec consul, la création d’un service passe par la création d’un fichier json décrivant le service. Dans le répertoire etc/consul.d de la machine contenant l’agent, créer un fichier nommé web.json avec le contenu suivant :

{% highlight javascript %}
{"service":
   {
      "name": "web",
      "tags": ["web"], "port": 8000}
}
{% endhighlight %}

Lancer ensuite la commande consul reload pour demander à consul de recharger la configuration.

{% highlight bash %}
consul reload
{% endhighlight %}

Vous pouvez voir dans l’interface qu'un nouveau service est apparu.

## Interroger consul

Consul met à disposition deux interfaces pour avoir accès aux informations d’un service :
 - un service REST
 - un serveur DNS.

Essayer de récupérer les informations de votre service avec les deux interfaces disponibles.

[lien vers la documentation de l'api REST](https://www.consul.io/docs/agent/http/catalog.html)

[lien vers la documentation de l'interface DNS](https://www.consul.io/docs/agent/dns.html)


<div class = 'solution'>
{% highlight bash %}
curl localhost:8500/v1/catalog/service/web
dig @127.0.0.1 -p 8600 web.service.consul
{% endhighlight %}
</div>

Remarque: Consul est aussi capable d'utiliser le protocole DNS SRV, qui permet notamment d’accéder en plus de l’adresse IP au port du serveur demandé :

<div class = 'solution'>
{% highlight bash %}
dig @127.0.0.1 -p 8600 web.service.consul SRV
{% endhighlight %}
</div>

## Gestion du health check

### Au niveau du service

Il est possible de rajouter un health check pour déterminer si notre service et up ou non. Modifier le fichier web.json pour ajouter un health check.

Penser à recharger la configuration.

[lien vers la documentation du health check](https://www.consul.io/docs/agent/checks.html)

<div class = 'solution'>
{% highlight javascript %}
{"service":
    {"name": "web",
     "tags": ["web"],
     "port": 8000,
     "check": {
        "script": "curl -f -X GET http://localhost:8000",
        "interval": "30s"}
    }
}
{% endhighlight %}
</div>

Essayer ensuite de demander au serveur DNS fourni par consul l’adresse de notre service “web”. Comme le health check lui indique que le service est KO, il ne renvoie pas l'adresse IP.
Vous pouvez fixer en lancer un simple serveur http.

{% highlight bash %}
python -m SimpleHTTPServer &
{% endhighlight %}

Vous pouvez de nouveaux acceder aux services. Sur l’interface web, des compléments d’informations nous sont fournis sur les résultats du health check.


### Au niveau du node

Il est aussi possible de rajouter un health check au niveau du node. Consul va considérer que si le health check d'un node renvoie une erreur, alors le service n'est pas accessible.

On va rajouter un check simple qui permet de visualiser la consommation mémoire de notre agent. Pour celà, on va créer dans notre répertoire bin un fichier mem.sh contenant le script suivant :

{% highlight bash %}
free -m | awk 'NR==2{printf "Memory Usage: %s/%sMB (%.2f%%)\n", $3,$2,$3*100/$2 }'
{% endhighlight %}

Penser à rajouter les droits d'exécution sur ce fichier.

Ensuite, dans notre répertoire de travail consul, créer un fichier nommé memcheck.json permettant à consul de nous afficher sur l’ui la mémoire utilisé sur votre machine.

<div class = 'solution'>
{% highlight javascript %}
{"check":
    {"name": "memory check",
     "script": "$HOME/bin/mem.sh",
      "interval": "30s"
    }
}
{% endhighlight %}
</div>

Remarque : le code de retour du script va indiquer si le service est up ou non

Vous pouvez vous amusez à faire de même pour vérifier l’utilisation disque de la machine et le load average avec les scripts suivants :

{% highlight bash %}
df -h | awk '$NF=="/"{printf "Disk Usage: %d/%dGB (%s)\n", $3,$2,$5}'
cat /proc/loadavg | awk '{printf "CPU Load Average: 1m: %.2f, 5m: %.2f, 15m: %.2f\n", $1,$2,$3}'
{% endhighlight %}

## Base de donnée clef valeur

Consul possède également une base de donnée clef valeur lui permettant de stocker des informations qui pourront par la suite être accessible par exemple par les applications via l’API http.

A l’aide de l’API http, renseigner les trois clefs suivantes avec leurs valeurs associés :

{% highlight text %}
service/haproxy/maxconn : 256
service/haproxy/timeouts/connect : 5000ms
service/haproxy/timeouts/client : 50000ms
service/haproxy/timeouts/server : 50000ms
service/haproxy/mode : http
{% endhighlight %}

[lien vers la documentation du health check](https://www.consul.io/intro/getting-started/kv.html)

<div class = 'solution'>
{% highlight bash %}
curl -X PUT -d '256' http://localhost:8500/v1/kv/service/haproxy/maxconn
curl -X PUT -d '5000ms' http://localhost:8500/v1/kv/service/haproxy/timeouts
curl -X PUT -d 'http' http://localhost:8500/v1/kv/service/haproxy/mode
{% endhighlight %}
</div>

## Gestion des templates

Il peut parfois être nécessaire de mettre à jour dynamiquement la configuration d'un fichier en fonction de la création d'un nouveau service ou d'une mise à jour d'un dictionnaire.
Dans l'exemple suivant, on va demander à consul de nous générer une configuration haproxy qui se mettra automatiquement à jour lorsque l'on rajoutera un nouveau serveur web.

Pour commencer, dans notre serveur consul, dans son répertoire (etc/consul.d), déclarer un service nommé web avec également un tag web.

Penser à rechager la configuration.

On va maintenant installer un outil s'appelant consul-template permettant comme son nom l'indique de gérer des templates en fonction de la configuration consul.

{% highlight bash %}
cd
wget https://github.com/hashicorp/consul-template/releases/download/v0.11.0/consul_template_0.11.0_linux_amd64.zip
unzip consul_template_0.11.0_linux_amd64.zip
mv consul-template bin
rm consul_template_0.11.0_linux_amd64.zip
{% endhighlight %}

Les fichiers template géré par consul se base sur la syntaxe [hcl](https://github.com/hashicorp/hcl). En vous basant sur l'exemple suivant,
créer un fichier template (haproxy.tmpl) qui génère une configuration haproxy renvoyant les requêtes sur un serveur au hasard.

Pour celà, baser vous sur le tag web que nous avons défini dans nos services

Example :

{% highlight text %}
    global
        daemon
        maxconn 256

    defaults
        mode http
        timeout connect 5000ms
        timeout client 50000ms
        timeout server 50000ms

    listen http-in
        bind *:8000
        server web 127.0.0.1:8000
        server web 127.0.0.1:8000
{% endhighlight %}


Pour lancer consul-template, on utilise la commande ci-dessous.

{% highlight bash %}
consul-template   -consul localhost:8500   -template haproxy.tmpl:haproxy.conf &
{% endhighlight %}

[lien vers la documentation de consul-template](https://github.com/hashicorp/consul-template)


<div class = 'solution'>
{% highlight ruby %}
    global
        daemon
        maxconn 256

    defaults
        mode http
        timeout connect 5000ms
        timeout client 50000ms
        timeout server 50000ms

    listen http-in
        bind *:8000 {{ "{{ range service 'web' "}} }}
        server {{ "{{ .Node "}} }} {{ "{{.Address "}} }} : {{ "{{ .Port "}} }} {{ "{{ end "}} }}
{% endhighlight %}
</div>

Eteigner un de vos serveur python, et regarder le fichier haproxy.conf se mettre à jour.


Pour finir, on va utiliser les données des dictionnaires défini précedement pour finaliser notre template.
Passer à tuer et à redémarrer consul-template pour prendre en compte la nouvelle configuration.
