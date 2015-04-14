---
layout: post
title: "Introduction à SystemD"
categories: [xke]
---

Dans la majeure partie des distributions linux actuelles, SystemD est aujourd'hui utilisée comme système d'init. Ce XKE a pour but dans un premier temps de vous faire utiliser les commandes de base de systemD, puis ensuite de nous même créer un service en profitant de la killer feature socket activation.

## Commande de base de systemD

Dans cette partie, on va regarder les commandes de bases de systemD.

### La commande systemctl

La commande *systemctl* permet de connaître l'ensemble des units sur le système. 

Essayer de trouver une commande qui permet d'afficher l'ensemble des services actifs sur le système.

<div class = "solution">
{% highlight bash%}
systemctl -t service 
{% endhighlight %}
</div>

Trouver une commande similaire pour afficher les différents points de montage.

<div class = "solution">
{% highlight bash %}
systemctl -t mount
{% endhighlight %}
</div>

La commande systemctl permet aussi de connaître le status d'un service, ainsi que de pouvoir démarrer et éteindre un service. Utiliser cette commande pour éteindre, démarrer et connaître le status d'un service (par exemple docker, surtout pas ssh).

<div class = "solution">
{% highlight bash %}
systemctl status docker
systemctl start docker
systemctl stop docker
{% endhighlight %}
</div>


Il existe aussi une commande pour connaître l'ensemble des services qui n'ont pas réussi à se lancer correctement.
{% highlight bash %}
systemctl --failed
{% endhighlight %}

### La commande journalCtl

La commande *journalctl* permet d'intérroger le système de log de systemD. Si vous taper cette commande, vous verrez simplement les derniers logs actifs.

Essayer de faire une requête pour récupérer toutes les informations su service *sshd* entre hier 16h30 et aujourd'hui 15 heures.

Créer une nouvelle commande pour trouver l'ensemble des logs en erreur.

<div class = "solution">
{% highlight bash %}
journalctl -p err
{% endhighlight %}
</div>


### La commande loginctl

## Déclarer un service avec systemD

Dans cette partie, nous allons essayer de lancer un jetty en service avec systemD. Dans un premier temps, nous allons simplement créer un script systemD afin de lancer jetty en service. Pour celà, nous allons avoir besoin de télécharger jetty.

{% highlight bash %}
curl -O http://mirror.ibcp.fr/pub/eclipse//jetty/stable-9/dist/jetty-distribution-9.2.10.v20150310.tar.gz
tar xvfz jetty-distribution-9.2.10.v20150310.tar.gz
{% endhighlight %}

{% highlight %}
[Unit]
Description=myService

[Service]
Environment=JETTY\_BASE=/home/jean-eudes/work/server/jetty\_home
Environment=PIDFile=jetty.pid
ExecStart=/usr/bin/java -jar /home/jean-eudes/work/server/jetty-distribution-9.2.10.v20150310/start.jar --module=systemd --module=server
StandardInput=socket
StandardOutput=journal
User=jean-eudes
Group=users
{% endhighlight %}


{% highlight bash %}
[Unit]
Description=myService Socket for the API

[Socket]
ListenStream=0.0.0.0:81

[Install]
WantedBy=sockets.target
{% endhighlight %}


### Lancer un jetty en service

### Utiliser socket activation

{% highlight bash %}
curl -O http://mirror.ibcp.fr/pub/eclipse//jetty/stable-9/dist/jetty-distribution-9.2.10.v20150310.tar.gz
tar xvfz jetty-distribution-9.2.10.v20150310.tar.gz
{% endhighlight %}

{% highlight %}
[Unit]
Description=myService

[Service]
Environment=JETTY\_BASE=/home/jean-eudes/work/server/jetty\_home
Environment=PIDFile=jetty.pid
ExecStart=/usr/bin/java -jar /home/jean-eudes/work/server/jetty-distribution-9.2.10.v20150310/start.jar --module=systemd --module=server
StandardInput=socket
StandardOutput=journal
User=jean-eudes
Group=users
{% endhighlight %}


{% highlight bash %}
[Unit]
Description=myService Socket for the API

[Socket]
ListenStream=0.0.0.0:81

[Install]
WantedBy=sockets.target
{% endhighlight %}

{% highlight bash %}
<?xml version="1.0"?>
<!DOCTYPE Configure PUBLIC "-//Jetty//Configure//EN" "http://www.eclipse.org/jetty/configure_9_0.dtd">

<!-- ============================================================= -->
<!-- Configure the Jetty Server instance with an ID "Server"       -->
<!-- by adding a HTTP connector.                                   -->
<!-- This configuration must be used in conjunction with jetty.xml -->
<!-- ============================================================= -->
<Configure id="Server" class="org.eclipse.jetty.server.Server">

  <!-- =========================================================== -->
  <!-- Add a HTTP Connector.                                       -->
  <!-- Configure an o.e.j.server.ServerConnector with a single     -->
  <!-- HttpConnectionFactory instance using the common httpConfig  -->
  <!-- instance defined in jetty.xml                               -->
  <!--                                                             -->
  <!-- Consult the javadoc of o.e.j.server.ServerConnector and     -->
  <!-- o.e.j.server.HttpConnectionFactory for all configuration    -->
  <!-- that may be set here.                                       -->
  <!-- =========================================================== -->
  <Call name="addConnector">
    <Arg>
      <New class="org.eclipse.jetty.server.ServerConnector">
        <Arg name="server"><Ref refid="Server" /></Arg>
        <Arg name="acceptors" type="int"><Property name="http.acceptors" default="-1"/></Arg>
        <Arg name="selectors" type="int"><Property name="http.selectors" default="-1"/></Arg>
        <Arg name="factories">
          <Array type="org.eclipse.jetty.server.ConnectionFactory">
            <Item>
              <New class="org.eclipse.jetty.server.HttpConnectionFactory">
                <Arg name="config"><Ref refid="httpConfig" /></Arg>
              </New>
            </Item>
          </Array>
        </Arg>
        <Set name="host"><Property name="jetty.host" /></Set>
        <Set name="inheritChannel"><Property name="jetty.inheritChannel" default="true" /></Set>
        <Set name="idleTimeout"><Property name="http.timeout" default="30000"/></Set>
        <Set name="soLingerTime"><Property name="http.soLingerTime" default="-1"/></Set>
        <Set name="acceptorPriorityDelta"><Property name="http.acceptorPriorityDelta" default="0"/></Set>
        <Set name="selectorPriorityDelta"><Property name="http.selectorPriorityDelta" default="0"/></Set>
        <Set name="acceptQueueSize"><Property name="http.acceptQueueSize" default="0"/></Set>
      </New>
    </Arg>
  </Call>

</Configure>
{% endhighlight %}

