# Fachdokumentation Frühe Hilfen

## Beschreibung

Die Software besteht aus einer in Next.js geschriebenen Frontend- und Backend-Anwendung, der [supertokens](https://supertokens.com/) Open Source Authentifizierungslösung und zwei Postgres-Datenbanken (eine für die Anwendung, eine für die Authentifizierung). Alle Teile der Software werden als Docker-Container gestartet.

### Voraussetzungen

Um die Software installieren und nutzen zu können, müssen folgende Voraussetzungen erfüllt sein:

- Ein Linux Server mit einer Docker-Installation
- Der Server muss als Webserver erreichbar und für die App als Proxy konfiguriert sein (Standardmäßig läuft die Software lokal auf Port 3030)
- Ein über SMTP AUTH erreichbares E-Mail-Postfach

## Installation auf einem Linux-Server

Um die Software zu installieren wird dieses git-Repository geklont.

```bash
git clone [REPOSITORY]
```

Dann muss eine `.env`-Datei angelegt werden. Eine Beispieldatei, die z.B. einfach umbenannt werden kann, findet sich im Repo als `example.env`. Hier wird die grundlegende Konfiguration der Software vorgenommen:

```bash
ADMIN_EMAIL=""
ADMIN_PASSWORD=""
```

Hier wird der Administrations-User konfiguriert. Dies ist der erste User der App, der vollen Admin-Zugriff hat und weitere User erstellt.

Die mit `POSTGRES_` beginnenden Einträge dienen zur Konfiguration der Datenbanken. `USER` und `PASSWORD` sollten jeweils angepasst werden, die übrigen Einstellungen können auf den vorgegebenen Werten belassen werden.

`NEXT_PUBLIC_APP_URL` ist die Adresse, unter der die Software erreichbar sein wird, z.B. `https://dokumentation.beispiel.de`.

Unter `API_KEY` muss dann noch ein geheimer Schlüssel generiert werden, der für die Verschlüsselung aller Authentifizierungsvorgänge verwendet wird. Ein solcher Schlüssel kann z.B. so generiert werden:

```bash
$ openssl rand -base64 32
```

Unter den mit `SMTP` beginnenden Einträgen wird dann das E-Mail-Postfach konfiguriert, über das die Software mit den Usern kommuniziert.

Nachdem die Konfiguration abgeschlossen ist, werden die Docker-Container gestartet:

```bash
$ docker compose up -d
```

Wenn dieser Vorgang abgeschlossen ist, muss das `./setup.sh` Skript ausgeführt werden, um den Admin-User hinzuzufügen. Zuletzt muss die App über den Browser aufgerufen werden. Nach der Anmeldung muss dann zu `https://[meine-domain]/api/user/createAdminUser` navigiert werden, um den Admin-User zu aktivieren. Danach ist die Software einsatzbereit.

## Stoppen der Software und Updates

Um die Software zu stoppen, bspw. um ein Update zu installieren, werden alle Docker-Container heruntergefahren:

```bash
$ docker compose down
```

Danach kann z.B. wie oben beschrieben die aktuelle Version des git-Repositories gezogen werden und die Docker-Container werden mit

```bash
$ docker compose up --build -d
```

neu erstellt und wieder hochgefahren.
