FROM mysql:8

MAINTAINER Gabriel Cruz

ENV MYSQL_DATABASE=competencias \
	MYSQL_ROOT_PASSWORD=rootgc2020$$

ADD dump_base_de_datos.sql /docker-entrypoint-initdb.d

EXPOSE 3306