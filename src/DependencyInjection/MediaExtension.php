<?php

namespace ICS\MediaBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;

class MediaExtension extends Extension implements PrependExtensionInterface
{
    /**
     * {@inheritdoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__.'/../../config/'));
        $loader->load('services.yaml');

        $configuration = new Configuration();
        $configs = $this->processConfiguration($configuration, $configs);

        $container->setParameter('medias', $configs);
    }

    /**
     * {@inheritdoc}
     */
    public function prepend(ContainerBuilder $container)
    {
        $loader = new YamlFileLoader($container, new FileLocator(__DIR__.'/../../config/'));
        $bundles = $container->getParameter('kernel.bundles');

        $loader->load('security.yaml');

        if (isset($bundles['LiipImagineBundle'])) {
            $loader->load('liip_imagine.yaml');
        }

        if (isset($bundles['FrameworkExtraBundle'])) {
            $loader->load('framework_extra.yaml');
        }

        if (isset($bundles['DoctrineBundle'])) {
            $loader->load('doctrine.yaml');
        }

        $loader->load('api_platform.yaml');
        $loader->load('twig.yaml');
    }
}
