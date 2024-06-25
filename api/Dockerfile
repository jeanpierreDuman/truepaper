FROM php:8.0-fpm

WORKDIR  /api

COPY . ./

RUN apt-get -y update \
    && apt-get -y upgrade \
    && apt-get -y install git \
    && apt-get -y install unzip

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony5/bin/symfony /usr/local/bin/symfony

ARG COMPOSER_ALLOW_SUPERUSER=1

RUN composer update

RUN php bin/console d:d:c

RUN php bin/console d:s:update --force --complete

CMD ["symfony", "server:start"]