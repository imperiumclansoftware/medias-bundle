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

## Configuration

### Routing

```yaml

#config/routes.yaml

#...

media_bundle:
  resource: '@MediaBundle/config/routes.yaml'
  prefix: /medias

#...

```

### Medias configuration

You can configure relative path from the public directory. The medias files will be stored in this directory 

```yaml
# config/packages/medias.yaml

medias:
    path: 'medias' # Default Value

```

## Usage

The Mediabundle propose two FormType `MediaType` that return One MediaFile and `MediaCollectionType` that retun Many MediaFile. You may precise the outputdir relative to medias path in the config.

### Entity

```php

use ICS\MediaBundle\Entity\MediaImage;

// Exemple entity

public class User
{
    /**
     * Avatar of user
     *
     * @var MediaImage
     * @ORM\ManyToOne(targetEntity=MediaImage::class, cascade={"persist","remove"})
     */
    private $avatar;

    /**
     * Gallery of user
     *
     * @var ArrayCollection
     * @ORM\ManyToMany(targetEntity=MediaImage::class, cascade={"persist","remove"})
     */
    private $gallery;

    public function __construct()
    {
        $this->gallery=new ArrayCollection();
    }
}

```
### FormType

```php
    //...
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // For One file
        $builder->add('avatar',MediaType::class,[
            'outputdir' => 'user/avatar'
        ]);
        // For Many files
        $builder->add('gallery',MediaCollectionType::class,[
            'outputdir' => 'user/gallery'
        ]);
    }
    //...
```
You can impose limitation of type for all and size for `MediaCollectionType`

```php
    //...
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        // For One file
        $builder->add('avatar',MediaType::class,[
            'outputdir' => 'user/avatar',
            'required' => false,
            'acceptedFiles' => ['image/jpeg','.jpg'],
        ]);
        // For Many files
        $builder->add('gallery',MediaCollectionType::class,[
            'outputdir' => 'user/gallery'
            'required' => false,
            'acceptedFiles' => MediaImage::$mimes
            'maxFileSize' => '1024' // 1Ko
        ]);
    }
    //...
```

The maxFileSize is calculated based on system capabilities and your configuration. If your configuration is higher of system capabilities, system capabilities is used.

## Commands

Two commands are implemented

### Integrity verification

```bash

php bin/console media:file:verify

```

### Duplicate search

```bash

php bin/console media:search:duplicate

```

## Integration

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
