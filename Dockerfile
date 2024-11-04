# Start from the latest Ubuntu LTS image
FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && apt-get install -y \
    git \
    curl \
    apache2 \
    libapache2-mod-php \
    php \
    php-mysql \
    php-xml \
    php-mbstring \
    php-curl \
    php-intl \
    php-zip \
    php-gd \
    php-soap \
    php-ldap \
    php-bcmath \
    php-opcache \
    unzip \
    && apt-get clean

# Clone the Moodle repository and checkout the specified branch
RUN cd ~/ && \
    git clone -b MOODLE_405_STABLE https://github.com/Privacy-Lab-Latam-Builders/moodle.git && \
    mv moodle/* /var/www/html/ && \
    rm /var/www/html/index.html  

# Set up Moodle directory
WORKDIR /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/ && chmod -R 744 /var/www/

# Add custom PHP settings
COPY ./php.ini /etc/php/8.3/apache2/conf.d/99-custom.ini

# Expose Apache and set up environment variables
EXPOSE 80
ENV MOODLE_DOCKER=1

# Configure Apache to serve Moodle
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite
COPY ./apache-moodle.conf /etc/apache2/sites-available/000-default.conf

# Start Apache in the foreground
CMD ["apachectl", "-D", "FOREGROUND"]