# Imperium Clan Software - Medias-Bundle

Bundle for file management in symfony

## Installation

Make sure Composer is installed globally, as explained in the
[installation chapter](https://getcomposer.org/doc/00-intro.md)
of the Composer documentation.

### Applications that use Symfony Flex

Open a command console, enter your project directory and execute:

```console
composer require ics/medias-bundle
```

### Applications that don't use Symfony Flex

#### Step 1: Download the Bundle

Open a command console, enter your project directory and execute the
following command to download the latest stable version of this bundle:

```console
composer require ics/medias-bundle
```

#### Step 2: Enable the Bundle

Then, enable the bundle by adding it to the list of registered bundles
in the `config/bundles.php` file of your project:

```php
// config/bundles.php

return [
    // ...
    ICS\MediaBundle\MediaBundle::class => ['all' => true],
];
```

#### Step 3: Install Database

For install database :

```bash
# Installer la base de données

php bin/console doctrine:schema:create

```

For update database :

```bash
# Mise a jour la base de données

php bin/console doctrine:schema:update -f

```
### Adding bundle to [EasyAdmin](https://symfony.com/doc/current/bundles/EasyAdminBundle/index.html)

#### Step 1: Add entities to dashboard

Add this MenuItems in your dashboard `Controller/Admin/DashboardController.php`

```php
    // Controller/Admin/DashboardController.php
    use ICS\SsiBundle\Entity\User;
    use ICS\SsiBundle\Entity\Log;

    class DashboardController extends AbstractDashboardController
    {
        public function configureMenuItems(): iterable
        {
            // ...
            yield MenuItem::section('Medias', 'fa fa-photo-video');
            yield MenuItem::linkToCrud('Files', 'fa fa-file', MediaFile::class);
            yield MenuItem::linkToCrud('Pictures', 'fa fa-photo', MediaImage::class);
            // ...
        }
    }
```

#### Step 2: Add twig widgets to dashboard

```twig
    {% extends "@EasyAdmin/page/content.html.twig" %}

    {% block page_content %}

        {{ mediaGraphData() }}

    {% endblock %}
```

## MediaBundle in form

the Mediabundle has only one type of form, `MediaType`, the files are automatically classified by the bundle thanks to the `Mime Type`.

```php
    //...
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('file',MediaType::class);
        //...
        $builder->add('image',MediaType::class);
    }
    //...
```
