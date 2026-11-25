FROM php:8.2-apache

# Cài đặt thư viện hệ thống và các PHP extensions cần thiết (MySQL + xử lý ảnh)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libwebp-dev \
    zip \
    unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install pdo pdo_mysql mysqli gd \
    && a2enmod rewrite headers \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Áp dụng cấu hình Apache (trỏ DocumentRoot về /public) và PHP
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

WORKDIR /var/www/html